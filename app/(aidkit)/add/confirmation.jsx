import { View, Text, ScrollView, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ConfirmationStep() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const schedule = params.schedule ? JSON.parse(params.schedule) : [];

  const handleSave = () => {
    // Здесь можно добавить сохранение в БД

    Alert.alert(
      'Успех',
      'Лекарство успешно добавлено!',
      [
        {
          text: 'ОК',
          onPress: () => {
            router.replace('/(aidkit)'); 
          }
        }
      ],
      { cancelable: false }
    );
  };


  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontWeight: 'bold' }}>Подтверждение данных</Text>

      <Text>Название: {params.name}</Text>
      <Text>Описание: {params.description}</Text>
      <Text>Единицы: {params.unit}</Text>

      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>График:</Text>
      {schedule.map((entry, index) => (
        <Text key={index}>
          Приём {index + 1}: {entry.time}, {entry.amount} {params.unit}
        </Text>
      ))}

      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Напоминания:</Text>
      <Text>
        Напоминание: {params.enableReminder === 'true' ? 'Да' : 'Нет'}
      </Text>
      {params.enableReminder === 'true' && (
        <>
          <Text>Текущие запасы: {params.currentStock} {params.unit}</Text>
          <Text>Напомнить при остатке: {params.remindThreshold} {params.unit}</Text>
        </>
      )}

      <Button title="Сохранить" onPress={handleSave} />
    </ScrollView>
  );
}