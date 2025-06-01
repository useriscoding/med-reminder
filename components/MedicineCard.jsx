// components/MedicineCard.jsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocale } from '../contexts/LocaleContext';
import { useRouter } from 'expo-router';

const MedicineCard = ({ medicine, onPress }) => {
    const { t } = useLocale();
    const router = useRouter();

    // Форматируем расписание в строку
    const scheduleText = medicine.schedule
        .map(s => `${s.amount} ${medicine.unit} в ${s.time}`)
        .join(', ');

    return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/(aidkit)/${medicine.id}`)}
    >
      <Text style={styles.title}>{medicine.name}</Text>
      <Text style={styles.subtitle}>{scheduleText}</Text>
      <Text style={[
        styles.stock,
        medicine.stock <= medicine.remindThreshold ? styles.stockWarning : null
      ]}>
        {medicine.stockInfo}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  stock: {
    fontSize: 14,
    color: '#059669',
  },
  stockWarning: {
    color: '#DC2626',
  },
});

export default MedicineCard;
