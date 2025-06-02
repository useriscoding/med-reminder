import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMedicines } from '@contexts/MedicinesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryTab = () => {
  const { medicines, reminderStatuses } = useMedicines();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistoryData();
  }, [medicines, reminderStatuses]);

  const loadHistoryData = async () => {
    try {
      const stored = await AsyncStorage.getItem('medicineHistory');
      const history = stored ? JSON.parse(stored) : {};
      
      // Создаем объединенные данные с текущим днем
      const today = new Date().toDateString();
      const todayData = generateTodayData();
      
      // Объединяем с сохраненной историей
      const combinedHistory = {
        ...history,
        [today]: todayData
      };

      // Сортируем дни по убыванию (сегодня первым)
      const sortedDays = Object.keys(combinedHistory)
        .sort((a, b) => new Date(b) - new Date(a))
        .slice(0, 30); // Последние 30 дней

      const historyArray = sortedDays.map(date => ({
        date,
        data: combinedHistory[date],
        isToday: date === today
      }));

      setHistoryData(historyArray);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
      setLoading(false);
    }
  };

  const generateTodayData = () => {
    const todayEntries = [];
    
    medicines.forEach(medicine => {
      medicine.schedule.forEach(scheduleItem => {
        const reminderId = `${medicine.id}-${scheduleItem.time}`;
        const status = reminderStatuses[reminderId] || 'upcoming';
        
        todayEntries.push({
          id: reminderId,
          medicineName: medicine.name,
          time: scheduleItem.time,
          dose: `${scheduleItem.amount} ${medicine.unit}`,
          status,
          unit: medicine.unit
        });
      });
    });

    return todayEntries.sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time}`);
      const timeB = new Date(`1970/01/01 ${b.time}`);
      return timeA - timeB;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      const formatted = date.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      // Делаем первую букву дня недели заглавной
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      const formatted = date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        weekday: 'short',
        year: 'numeric'
      });
      // Делаем первую букву дня недели заглавной
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return { name: 'checkmark-circle', color: '#10B981' };
      case 'missed':
        return { name: 'close-circle', color: '#EF4444' };
      case 'upcoming':
        return { name: 'time', color: '#6B7280' };
      default:
        return { name: 'help-circle', color: '#6B7280' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'done':
        return 'Принято';
      case 'missed':
        return 'Пропущено';
      case 'upcoming':
        return 'Ожидается';
      default:
        return 'Неизвестно';
    }
  };

  const renderDayHistory = (dayData) => {
    const { date, data, isToday } = dayData;
    
    if (!data || data.length === 0) {
      return (
        <View key={date} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>{formatDate(date)}</Text>
          <View style={styles.emptyDay}>
            <Text style={styles.emptyText}>Нет записей о приеме лекарств</Text>
          </View>
        </View>
      );
    }

    return (
      <View key={date} style={styles.dayContainer}>
        <Text style={styles.dayTitle}>
          {formatDate(date)}
        </Text>
        
        {data.map((entry) => {
          const statusIcon = getStatusIcon(entry.status);
          
          return (
            <View key={entry.id} style={styles.entryContainer}>
              <View style={styles.entryContent}>
                <View style={styles.timeContainer}>
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text style={styles.timeText}>{entry.time}</Text>
                </View>
                
                <View style={styles.entryBody}>
                  <Text style={styles.medicineName}>{entry.medicineName}</Text>
                  <Text style={styles.doseText}>{entry.dose}</Text>
                </View>
              </View>
              
              <View style={[styles.statusContainer, { backgroundColor: statusIcon.color + '15' }]}>
                <Text style={[styles.statusText, { color: statusIcon.color }]}>
                  {getStatusText(entry.status)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Загрузка истории...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>История приемов</Text>
        <Text style={styles.subtitle}>Последние {historyData.length} дней</Text>
      </View>
      
      {historyData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>История пуста</Text>
          <Text style={styles.emptySubtitle}>
            Добавьте лекарства и начните принимать их, чтобы увидеть историю
          </Text>
        </View>
      ) : (
        historyData.map(renderDayHistory)
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  dayContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 12,
  },
  todayBadge: {
    color: '#3B82F6',
    fontSize: 16,
  },
  emptyDay: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
  entryContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 12,
    minWidth: 70,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  entryBody: {
    gap: 2,
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  doseText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 100,
    maxWidth: 100,
    height: 32,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HistoryTab; 