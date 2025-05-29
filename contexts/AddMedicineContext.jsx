import { createContext, useContext, useState } from 'react';

export const AddMedicineContext = createContext();

// Создаем кастомный хук для удобства использования
export function useAddMedicineContext() {
  const context = useContext(AddMedicineContext);
  if (!context) {
    throw new Error('useAddMedicineContext must be used within AddMedicineProvider');
  }
  return context;
}

export function AddMedicineProvider({ children }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: '',
    dosage: '',
    times: [],
    stock: 0
  });

  const updateForm = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      schedule: '',
      dosage: '',
      times: [],
      stock: 0
    });
  };

  return (
    <AddMedicineContext.Provider value={{ formData, updateForm, resetForm }}>
      {children}
    </AddMedicineContext.Provider>
  );
}