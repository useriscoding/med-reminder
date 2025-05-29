import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import ReminderCard from '../components/ReminderCard';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const Home = () => {

  const router = useRouter()

  const [reminders, setReminders] = useState([
    {
      id: '1',
      name: 'Колдакт',
      dose: '2 таблетки',
      time: '08:00',
      status: 'done',
    },
    {
      id: '2',
      name: 'Эреспал',
      dose: '1 столовая ложка',
      time: '09:00',
      status: 'missed',
    },
    {
      id: '3',
      name: 'Колдакт',
      dose: '2 таблетки',
      time: '20:00',
      status: 'upcoming',
    },
  ]);

  const toggleStatus = (id) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status:
                r.status === 'upcoming'
                  ? 'done'
                  : r.status === 'done'
                  ? 'missed'
                  : 'upcoming',
            }
          : r
      )
    );
  };

  return (
    <View style={ styles.container }>
      <ScrollView>
      {reminders.map((reminder) => (
        <ReminderCard
          key={reminder.id}
          name={reminder.name}
          dose={reminder.dose}
          time={reminder.time}
          status={reminder.status}
          onToggleStatus={() => toggleStatus(reminder.id)}
        />
      ))}
      </ScrollView>
      <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/add-reminder')} // Или другая логика
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
    position: 'relative', // Важно для абсолютного позиционирования кнопки
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF', // Синий цвет как в iOS
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Тень для Android
    shadowColor: '#000', // Тень для iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    lineHeight: 30,
    marginTop: -2, // Корректировка вертикального выравнивания
  },
})