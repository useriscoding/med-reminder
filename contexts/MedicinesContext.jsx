import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MedicinesContext = createContext();

export function useMedicines() {
  const context = useContext(MedicinesContext);
  if (!context) {
    throw new Error('useMedicines must be used within MedicinesProvider');
  }
  return context;
}

export function MedicinesProvider({ children }) {
  const [medicines, setMedicines] = useState([]);
  const [todayReminders, setTodayReminders] = useState([]);
  const [reminderStatuses, setReminderStatuses] = useState({});
  // Храним информацию о том, для каких напоминаний уже был изменен остаток
  const [stockChanges, setStockChanges] = useState(new Set());
  // Храним данные о принятых лекарствах для побочных эффектов
  const [sideEffectsData, setSideEffectsData] = useState([]);
  // Дата последней фиксации остатков (для контроля ежедневного сброса)
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());
  // Храним время добавления лекарств для корректной обработки статусов
  const [medicineAddTimes, setMedicineAddTimes] = useState({});

  // Функция для сохранения истории в AsyncStorage
  const saveHistoryToStorage = async (date, historyData) => {
    try {
      const stored = await AsyncStorage.getItem('medicineHistory');
      const history = stored ? JSON.parse(stored) : {};
      
      history[date] = historyData;
      
      // Ограничиваем историю последними 60 днями
      const dates = Object.keys(history).sort((a, b) => new Date(b) - new Date(a));
      if (dates.length > 60) {
        const toDelete = dates.slice(60);
        toDelete.forEach(date => delete history[date]);
      }
      
      await AsyncStorage.setItem('medicineHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Ошибка сохранения истории:', error);
    }
  };

  // Функция для сохранения времени добавления лекарств в AsyncStorage
  const saveMedicineAddTimesToStorage = async (addTimes) => {
    try {
      await AsyncStorage.setItem('medicineAddTimes', JSON.stringify(addTimes));
    } catch (error) {
      console.error('Ошибка сохранения времени добавления лекарств:', error);
    }
  };

  // Функция для загрузки времени добавления лекарств из AsyncStorage
  const loadMedicineAddTimesFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem('medicineAddTimes');
      if (stored) {
        const parsedTimes = JSON.parse(stored);
        // Преобразуем строки обратно в объекты Date
        const convertedTimes = {};
        Object.keys(parsedTimes).forEach(medicineId => {
          convertedTimes[medicineId] = new Date(parsedTimes[medicineId]);
        });
        setMedicineAddTimes(convertedTimes);
      }
    } catch (error) {
      console.error('Ошибка загрузки времени добавления лекарств:', error);
    }
  };

  // Функция для создания записи истории из текущих данных
  const generateHistoryEntry = () => {
    const historyEntries = [];
    
    medicines.forEach(medicine => {
      medicine.schedule.forEach(scheduleItem => {
        const reminderId = `${medicine.id}-${scheduleItem.time}`;
        const status = reminderStatuses[reminderId] || 'upcoming';
        
        historyEntries.push({
          id: reminderId,
          medicineName: medicine.name,
          time: scheduleItem.time,
          dose: `${scheduleItem.amount} ${medicine.unit}`,
          status,
          unit: medicine.unit
        });
      });
    });

    return historyEntries.sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time}`);
      const timeB = new Date(`1970/01/01 ${b.time}`);
      return timeA - timeB;
    });
  };

  // Функция для проверки, прошло ли время приема
  const isTimePassedForReminder = (reminderTime) => {
    const now = new Date();
    const [hours, minutes] = reminderTime.split(':').map(Number);
    const reminderDate = new Date(now);
    reminderDate.setHours(hours, minutes, 0, 0);
    return now > reminderDate;
  };

  const addMedicine = (medicineData) => {
    const { 
      name, 
      description, 
      unit, 
      schedule, 
      currentStock, 
      remindThreshold 
    } = medicineData;

    // Создаем новое лекарство
    const newMedicine = {
      id: Date.now().toString(),
      name,
      description,
      schedule: schedule.map(s => ({
        time: s.time,
        amount: parseInt(s.amount),
      })),
      unit,
      stock: parseInt(currentStock),
      stockInfo: `Осталось ${currentStock} ${unit}`,
      remindThreshold: parseInt(remindThreshold),
    };

    const addTime = new Date();

    // Добавляем лекарство в список
    setMedicines(prev => [...prev, newMedicine]);

    // Сохраняем время добавления лекарства
    setMedicineAddTimes(prev => {
      const newTimes = {
        ...prev,
        [newMedicine.id]: addTime
      };
      // Сохраняем в AsyncStorage
      saveMedicineAddTimesToStorage(newTimes);
      return newTimes;
    });

    // updateTodayReminders([...medicines, newMedicine]); // Удалено, чтобы избежать багов с состоянием
  };

  const updateTodayReminders = (medicinesList) => {
    const today = new Date();
    const reminders = [];

    medicinesList.forEach(medicine => {
      medicine.schedule.forEach(scheduleItem => {
        const [hours, minutes] = scheduleItem.time.split(':');
        const reminderTime = new Date(today);
        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const reminderId = `${medicine.id}-${scheduleItem.time}`;
        
        // Определяем статус
        let status = 'upcoming';
        
        // Если есть сохраненный статус в reminderStatuses - используем его
        if (reminderStatuses[reminderId]) {
          status = reminderStatuses[reminderId];
        } 
        // Если статуса нет и время прошло - проверяем, не новое ли это лекарство
        else if (isTimePassedForReminder(scheduleItem.time)) {
          const medicineAddTime = medicineAddTimes[medicine.id];
          
          // Если лекарство было добавлено сегодня и после времени приема, 
          // то оно остается upcoming, а не missed
          if (medicineAddTime) {
            const isAddedToday = medicineAddTime.toDateString() === today.toDateString();
            const wasAddedAfterReminderTime = medicineAddTime > reminderTime;
            
            if (isAddedToday && wasAddedAfterReminderTime) {
              status = 'upcoming';
            } else {
              status = 'missed';
            }
          } else {
            // Если времени добавления нет (старые лекарства), то missed
            status = 'missed';
          }
        }

        reminders.push({
          id: reminderId,
          name: medicine.name,
          dose: `${scheduleItem.amount} ${medicine.unit}`,
          time: scheduleItem.time,
          status,
          description: medicine.description,
          instructions: medicine.instructions,
        });
      });
    });

    // Сортируем по времени
    reminders.sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time}`);
      const timeB = new Date(`1970/01/01 ${b.time}`);
      return timeA - timeB;
    });

    setTodayReminders(reminders);
  };

  const updateReminderStatus = (reminderId, newStatus, amount = 0, medicineId = null) => {
    if (!reminderId || !newStatus) return;

    // Получаем текущий статус напоминания
    const currentStatus = reminderStatuses[reminderId];

    // Обновляем статусы напоминаний
    setReminderStatuses(prev => {
      const newStatuses = { ...prev, [reminderId]: newStatus };
      
      // Сохраняем историю при каждом изменении статуса
      const today = new Date().toDateString();
      setTimeout(() => {
        const historyEntry = generateHistoryEntry();
        saveHistoryToStorage(today, historyEntry);
      }, 100);
      
      return newStatuses;
    });

    // Если меняем на done и остаток еще не менялся для этого напоминания
    if (newStatus === 'done' && !stockChanges.has(reminderId) && medicineId) {
      const medicine = medicines.find(m => m.id === medicineId);
      if (medicine) {
        updateMedicineStock(medicineId, medicine.stock - amount);
        setStockChanges(prev => new Set([...prev, reminderId]));
        
        // Добавляем принятое лекарство в список побочных эффектов
        addToSideEffects(reminderId, medicine, amount);
      }
    }

    // Если меняем с done на другой статус и остаток уже был изменен
    if (currentStatus === 'done' && newStatus !== 'done' && stockChanges.has(reminderId) && medicineId) {
      const medicine = medicines.find(m => m.id === medicineId);
      if (medicine) {
        // Возвращаем таблетки в аптечку
        updateMedicineStock(medicineId, medicine.stock + amount);
        // Убираем из списка изменений
        setStockChanges(prev => {
          const newChanges = new Set(prev);
          newChanges.delete(reminderId);
          return newChanges;
        });
        
        // Удаляем запись из побочных эффектов
        removeFromSideEffects(reminderId);
      }
    }
  };

  // Функция для добавления принятого лекарства в список побочных эффектов
  const addToSideEffects = (reminderId, medicine, amount) => {
    const reminder = todayReminders.find(r => r.id === reminderId);
    if (!reminder) return;

    const sideEffectEntry = {
      id: `se-${Date.now()}-${reminderId}`,
      reminderId: reminderId, // Добавляем ссылку на напоминание для удаления
      medicineId: medicine.id,
      medicineName: medicine.name,
      dose: `${amount} ${medicine.unit}`,
      takenAt: new Date().toISOString(),
      takenTime: reminder.time,
      symptoms: [], // Массив выбранных симптомов
      symptomsSubmitted: false, // Флаг отправки симптомов
    };

    setSideEffectsData(prev => [...prev, sideEffectEntry]);
  };

  // Функция для удаления записи из побочных эффектов
  const removeFromSideEffects = (reminderId) => {
    setSideEffectsData(prev => prev.filter(item => item.reminderId !== reminderId));
  };

  // Функция для обновления симптомов у записи побочных эффектов
  const updateSideEffectSymptoms = (sideEffectId, symptoms) => {
    setSideEffectsData(prev => prev.map(item => 
      item.id === sideEffectId 
        ? { ...item, symptoms: symptoms, symptomsSubmitted: true }
        : item
    ));
  };

  const updateMedicineStock = (medicineId, newStock) => {
    setMedicines(prev =>
      prev.map(medicine =>
        medicine.id === medicineId
          ? {
              ...medicine,
              stock: newStock,
              stockInfo: `Осталось ${newStock} ${medicine.unit}`,
            }
          : medicine
      )
    );
  };

  const deleteMedicine = (medicineId) => {
    // Удаляем лекарство из списка
    setMedicines(prev => prev.filter(medicine => medicine.id !== medicineId));
    
    // Удаляем все напоминания для этого лекарства
    setTodayReminders(prev => prev.filter(reminder => {
      const [reminderMedicineId] = reminder.id.split('-');
      return reminderMedicineId !== medicineId;
    }));
    
    // Удаляем информацию об изменениях остатка для этого лекарства
    setStockChanges(prev => {
      const newChanges = new Set(prev);
      for (const reminderId of newChanges) {
        if (reminderId.startsWith(medicineId)) {
          newChanges.delete(reminderId);
        }
      }
      return newChanges;
    });

    // Удаляем время добавления лекарства
    setMedicineAddTimes(prev => {
      const newTimes = { ...prev };
      delete newTimes[medicineId];
      // Сохраняем в AsyncStorage
      saveMedicineAddTimesToStorage(newTimes);
      return newTimes;
    });
  };

  // Ежедневное обновление в полночь
  useEffect(() => {
    const scheduleNextUpdate = () => {
      const now = new Date();
      const today = now.toDateString();
      
      // Проверяем, нужно ли выполнить сброс (если дата изменилась)
      if (lastResetDate !== today) {
        performDailyReset();
      }
      
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow - now;
      
      return setTimeout(() => {
        performDailyReset();
        
        // Перезапускаем таймер на следующий день
        scheduleNextUpdate();
      }, timeUntilMidnight);
    };

    const performDailyReset = () => {
      const today = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();
      
      // Сохраняем историю вчерашнего дня перед сбросом
      const yesterdayHistory = generateHistoryEntry();
      if (yesterdayHistory.length > 0) {
        saveHistoryToStorage(yesterdayString, yesterdayHistory);
      }
      
      // Сбрасываем все статусы напоминаний на upcoming
      setReminderStatuses(prev => {
        const newStatuses = {};
        Object.keys(prev).forEach(key => {
          newStatuses[key] = 'upcoming';
        });
        return newStatuses;
      });
      
      // Очищаем информацию об изменениях остатка (фиксируем текущее количество)
      setStockChanges(new Set());
      
      // Очищаем данные побочных эффектов (они переносятся в новый день)
      setSideEffectsData([]);
      
      // Обновляем дату последнего сброса
      setLastResetDate(today);
      
      // Обновляем todayReminders с новыми статусами будет выполнено автоматически через useEffect
    };

    const timerId = scheduleNextUpdate();
    return () => clearTimeout(timerId);
  }, [lastResetDate, medicines]);

  // Обновляем todayReminders при изменении medicines или reminderStatuses
  useEffect(() => {
    updateTodayReminders(medicines);
  }, [medicines, reminderStatuses]);

  // Загружаем данные при инициализации
  useEffect(() => {
    loadMedicineAddTimesFromStorage();
  }, []);

  return (
    <MedicinesContext.Provider
      value={{
        medicines,
        todayReminders,
        reminderStatuses,
        sideEffectsData,
        addMedicine,
        updateReminderStatus,
        updateMedicineStock,
        updateSideEffectSymptoms,
        isTimePassedForReminder,
        deleteMedicine,
      }}
    >
      {children}
    </MedicinesContext.Provider>
  );
} 