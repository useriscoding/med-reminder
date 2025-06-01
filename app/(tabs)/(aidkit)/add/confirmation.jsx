import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMedicines } from '../../../../contexts/MedicinesContext';

export default function ConfirmationStep() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { addMedicine } = useMedicines();

  const schedule = params.schedule ? JSON.parse(params.schedule) : [];

  const handleSave = () => {
    addMedicine({
      name: params.name,
      description: params.description,
      unit: params.unit,
      schedule,
      currentStock: params.currentStock,
      remindThreshold: params.remindThreshold,
    });
    
    router.replace('/(aidkit)');
  };

  const renderInfoCard = (title, icon, children) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color="#3B82F6" />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Подтверждение</Text>
      <Text style={styles.subtitle}>Проверьте введенную информацию</Text>

      {renderInfoCard('Основная информация', 'information-circle', (
        <>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Название</Text>
            <Text style={styles.infoValue}>{params.name}</Text>
          </View>
          {params.description && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Описание</Text>
              <Text style={styles.infoValue}>{params.description}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Единицы измерения</Text>
            <Text style={styles.infoValue}>{params.unit}</Text>
          </View>
        </>
      ))}

      {renderInfoCard('График приёма', 'calendar', (
        <View style={styles.scheduleContainer}>
          {schedule.map((entry, index) => (
            <View key={index} style={styles.scheduleItem}>
              <View style={styles.scheduleTime}>
                <Ionicons name="time-outline" size={20} color="#6B7280" />
                <Text style={styles.scheduleTimeText}>{entry.time}</Text>
              </View>
              <View style={styles.scheduleAmount}>
                <Text style={styles.scheduleAmountText}>
                  {entry.amount} {params.unit}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ))}

      {renderInfoCard('Напоминания', 'notifications', (
        <>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Статус</Text>
            <View style={[
              styles.statusBadge,
              params.enableReminder === 'true' ? styles.statusEnabled : styles.statusDisabled
            ]}>
              <Text style={[
                styles.statusText,
                params.enableReminder === 'true' ? styles.statusTextEnabled : styles.statusTextDisabled
              ]}>
                {params.enableReminder === 'true' ? 'Включены' : 'Отключены'}
              </Text>
            </View>
          </View>
          
          {params.enableReminder === 'true' && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Текущий запас</Text>
                <Text style={styles.infoValue}>{params.currentStock} {params.unit}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Порог уведомления</Text>
                <Text style={styles.infoValue}>{params.remindThreshold} {params.unit}</Text>
              </View>
            </>
          )}
        </>
      ))}

      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Сохранить</Text>
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  cardContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  scheduleContainer: {
    gap: 8,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  scheduleTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleTimeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  scheduleAmount: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  scheduleAmountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusEnabled: {
    backgroundColor: '#D1FAE5',
  },
  statusDisabled: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusTextEnabled: {
    color: '#059669',
  },
  statusTextDisabled: {
    color: '#DC2626',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 32,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});