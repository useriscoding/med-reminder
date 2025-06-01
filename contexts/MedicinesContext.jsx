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
  // Храним информацию о том, для каких напоминаний уже был изменен остаток
  const [stockChanges, setStockChanges] = useState(new Set());

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

    // Обновляем напоминания на сегодня
    updateTodayReminders([...medicines, newMedicine]);
  };

  const updateTodayReminders = (medicinesList) => {
    const today = new Date();
    const reminders = [];

    medicinesList.forEach(medicine => {
      medicine.schedule.forEach(scheduleItem => {
        const [hours, minutes] = scheduleItem.time.split(':');
        const reminderTime = new Date(today);
        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Определяем начальный статус
        let status = 'upcoming';
        if (isTimePassedForReminder(scheduleItem.time)) {
          status = 'missed';
        }

        reminders.push({
          id: `${medicine.id}-${scheduleItem.time}`,
          name: medicine.name,
          dose: `${scheduleItem.amount} ${medicine.unit}`,
          time: scheduleItem.time,
          status,
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
    const reminder = todayReminders.find(r => r.id === reminderId);
    if (!reminder) return;

    // Проверяем, можно ли установить статус upcoming для прошедшего времени
    if (newStatus === 'upcoming' && isTimePassedForReminder(reminder.time)) {
      return;
    }

    // Если меняем на done и остаток еще не менялся для этого напоминания
    if (newStatus === 'done' && !stockChanges.has(reminderId) && medicineId) {
      const medicine = medicines.find(m => m.id === medicineId);
      if (medicine) {
        updateMedicineStock(medicineId, medicine.stock - amount);
        setStockChanges(prev => new Set([...prev, reminderId]));
      }
    }

    setTodayReminders(prev =>
      prev.map(reminder =>
        reminder.id === reminderId
          ? { ...reminder, status: newStatus }
          : reminder
      )
    );
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
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow - now;
      
      return setTimeout(() => {
        // Обновляем все напоминания на upcoming
        setTodayReminders(prev =>
          prev.map(reminder => ({
            ...reminder,
            status: 'upcoming'
          }))
        );
        
        // Очищаем информацию об изменениях остатка
        setStockChanges(new Set());
        
        // Перезапускаем таймер
        scheduleNextUpdate();
      }, timeUntilMidnight);
    };

    const timerId = scheduleNextUpdate();
    return () => clearTimeout(timerId);
  }, []);

  // Обновляем напоминания при изменении medicines
  useEffect(() => {
    updateTodayReminders(medicines);
  }, [medicines]);

  return (
    <MedicinesContext.Provider
      value={{
        medicines,
        todayReminders,
        addMedicine,
        updateReminderStatus,
        updateMedicineStock,
        isTimePassedForReminder,
        deleteMedicine,
      }}
    >
      {children}
    </MedicinesContext.Provider>
  );
} 