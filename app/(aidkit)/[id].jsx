import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useLocale } from '../../contexts/LocaleContext';

const MedicineDetails = () => {
  const { id } = useLocalSearchParams();
  const { t } = useLocale();

  // Здесь вы можете получить данные лекарства по id из вашего хранилища
  // Пока используем mock данные
  const medicine = {
    id: '1',
    name: 'Колдакт',
    schedule: '2 раза в день (утром и вечером по 1 таблетке)',
    stock: 5,
    stockInfo: 'Осталось 5 таблеток',
    dosage: '1 таблетка',
    times: ['08:00', '20:00']
  };

  return (
    <View style={styles.container}>
      {/* Плашка с названием */}
      <View style={styles.card}>
        <Text style={styles.title}>{medicine.name}</Text>
      </View>

      {/* Плашка с запасом */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>{t.medicineCard.remaining}</Text>
        <Text style={styles.text}>{medicine.stockInfo}</Text>
      </View>

      {/* Плашка с графиком приема */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>{t.medicineDetails.schedule}</Text>
        <Text style={styles.text}>{medicine.schedule}</Text>
        <Text style={styles.text}>{t.medicineDetails.dosage}: {medicine.dosage}</Text>
        <Text style={styles.text}>
          {t.medicineDetails.times}: {medicine.times.join(', ')}
        </Text>
      </View>

      {/* Кнопки внизу */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.pauseButton]}>
          <Text style={styles.buttonText}>{t.medicineDetails.pauseReminders}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={() => console.log('Delete medicine', id)}
        >
          <Text style={styles.buttonText}>{t.medicineDetails.deleteMedicine}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  buttonsContainer: {
    marginTop: 'auto',
    marginBottom: 32,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  pauseButton: {
    backgroundColor: '#FFA500',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MedicineDetails;