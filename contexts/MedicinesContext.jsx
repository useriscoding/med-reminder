import { createContext, useContext, useState } from 'react';

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

        const status = reminderTime > today ? 'upcoming' : 'missed';

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

  const updateReminderStatus = (reminderId, newStatus) => {
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

  return (
    <MedicinesContext.Provider
      value={{
        medicines,
        todayReminders,
        addMedicine,
        updateReminderStatus,
        updateMedicineStock,
      }}
    >
      {children}
    </MedicinesContext.Provider>
  );
} 