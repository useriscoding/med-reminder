import { createContext, useContext, useState, useEffect } from 'react';

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

    // Добавляем лекарство в список
    setMedicines(prev => [...prev, newMedicine]);

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
        // Если статуса нет и время прошло - ставим missed
        else if (isTimePassedForReminder(scheduleItem.time)) {
          status = 'missed';
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
    setReminderStatuses(prev => ({ ...prev, [reminderId]: newStatus }));

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

  return (
    <MedicinesContext.Provider
      value={{
        medicines,
        todayReminders,
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