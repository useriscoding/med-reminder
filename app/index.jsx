import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import ReminderCard from '../components/ReminderCard';
import { useRouter } from 'expo-router';
import { useMedicines } from '../contexts/MedicinesContext';
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  const router = useRouter();
  const { 
    todayReminders, 
    updateReminderStatus, 
    medicines, 
    isTimePassedForReminder 
  } = useMedicines();

  const toggleStatus = (id) => {
    const reminder = todayReminders.find(r => r.id === id);
    if (!reminder) return;

    const [medicineId] = reminder.id.split('-');
    const medicine = medicines.find(m => m.id === medicineId);
    
    if (!medicine) return;

    // Получаем количество из дозы (например, из "2 таблетки" получаем 2)
    const amount = parseInt(reminder.dose.split(' ')[0]);

    // Определяем следующий статус в зависимости от текущего и времени
    const timePassed = isTimePassedForReminder(reminder.time);
    let newStatus;

    if (reminder.status === 'done') {
      newStatus = 'missed';
    } else if (reminder.status === 'missed') {
      if (medicine.stock < amount) {
        Alert.alert(
          'Недостаточно лекарства',
          'В аптечке недостаточно единиц лекарства для приема. Пожалуйста, пополните запас.',
          [{ text: 'OK' }]
        );
        return;
      }
      newStatus = 'done';
    } else if (!timePassed) {
      // Если время не прошло и статус upcoming, можем отметить как принятое
      if (medicine.stock < amount) {
        Alert.alert(
          'Недостаточно лекарства',
          'В аптечке недостаточно единиц лекарства для приема. Пожалуйста, пополните запас.',
          [{ text: 'OK' }]
        );
        return;
      }
      newStatus = 'done';
    }

    if (newStatus) {
      updateReminderStatus(id, newStatus, amount, medicineId);
    }
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>Нет напоминаний на сегодня</Text>
      <Text style={styles.emptyText}>
        Добавьте лекарства в аптечку, чтобы начать отслеживать приём
      </Text>
      <TouchableOpacity 
        style={styles.goToAidKitButton}
        onPress={() => router.push('/(aidkit)')}
      >
        <Text style={styles.goToAidKitText}>Перейти в аптечку</Text>
        <Ionicons name="arrow-forward" size={20} color="#3B82F6" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ScrollView>
        {todayReminders.length > 0 ? (
          todayReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              name={reminder.name}
              dose={reminder.dose}
              time={reminder.time}
              status={reminder.status}
              onToggleStatus={() => toggleStatus(reminder.id)}
            />
          ))
        ) : renderEmptyList()}
      </ScrollView>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/add')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  goToAidKitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#EBF5FF',
    borderRadius: 8,
    gap: 8,
  },
  goToAidKitText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    lineHeight: 30,
    marginTop: -2,
  },
})