// components/MedicineCard.jsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocale } from '../contexts/LocaleContext';
import { useRouter } from 'expo-router';

const MedicineCard = ({ medicine, onPress }) => {
    const { t } = useLocale();
    const router = useRouter();

    return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/(aidkit)/${medicine.id}`)}
    >
      <Text style={styles.title}>{medicine.name}</Text>
      <Text style={styles.subtitle}>{medicine.schedule}</Text>
      <Text style={styles.stock}>{t.medicineCard.remaining}: {medicine.stockInfo}</Text>
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
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { color: '#555' },
  stock: { marginTop: 8, color: 'red' },
});

export default MedicineCard;
