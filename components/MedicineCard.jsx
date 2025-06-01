// components/MedicineCard.jsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocale } from '../contexts/LocaleContext';
import { useRouter } from 'expo-router';

const MedicineCard = ({ medicine, onPress }) => {
    const { t } = useLocale();
    const router = useRouter();
    const isLowStock = medicine.stock <= medicine.remindThreshold;

    // Форматируем расписание в строку
    const scheduleText = medicine.schedule
        .map(s => `${s.amount} ${medicine.unit} в ${s.time}`)
        .join(', ');

    return (
    <TouchableOpacity 
      style={[styles.card, isLowStock && styles.lowStockCard]}
      onPress={() => onPress(medicine)}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{medicine.name}</Text>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color="#6B7280" 
        />
      </View>
      
      <Text style={[
        styles.stockInfo,
        isLowStock && styles.lowStockText
      ]}>
        {medicine.stockInfo}
      </Text>

      {isLowStock && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning-outline" size={16} color="#DC2626" />
          <Text style={styles.warningText}>
            Необходимо пополнить запас
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  lowStockCard: {
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  stockInfo: {
    fontSize: 14,
    color: '#059669',
  },
  lowStockText: {
    color: '#DC2626',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#DC2626',
  },
});

export default MedicineCard;
