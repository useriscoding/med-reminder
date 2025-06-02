import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMedicines } from '@contexts/MedicinesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChartsTab = () => {
  const { medicines, reminderStatuses } = useMedicines();
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [chartData, setChartData] = useState({});
  const [showMedicineSelector, setShowMedicineSelector] = useState(false);

  useEffect(() => {
    if (selectedMedicine) {
      generateChartData();
    }
  }, [selectedMedicine, currentWeekOffset, medicines, reminderStatuses]);

  useEffect(() => {
    // Автоматически выбираем первое лекарство, если оно есть
    if (medicines.length > 0 && !selectedMedicine) {
      setSelectedMedicine(medicines[0]);
    }
  }, [medicines]);

  const generateChartData = async () => {
    if (!selectedMedicine) return;

    try {
      const stored = await AsyncStorage.getItem('medicineHistory');
      const history = stored ? JSON.parse(stored) : {};
      
      const weekData = {};
      const currentDate = new Date();
      
      // Вычисляем начало недели с учетом смещения
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() - (currentWeekOffset * 7));
      startOfWeek.setHours(0, 0, 0, 0);

      // Создаем данные для 7 дней недели
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateString = date.toDateString();
        
        // Получаем данные для этого дня
        let dayData = [];
        if (dateString === new Date().toDateString()) {
          // Для сегодняшнего дня используем текущие данные
          dayData = generateTodayData(selectedMedicine);
        } else {
          // Для других дней используем сохраненную историю
          const savedDayData = history[dateString] || [];
          dayData = savedDayData.filter(entry => 
            entry.medicineName === selectedMedicine.name
          );
        }

        weekData[i] = {
          date: date,
          dayName: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
          entries: dayData
        };
      }

      setChartData(weekData);
    } catch (error) {
      console.error('Ошибка генерации данных графика:', error);
    }
  };

  const generateTodayData = (medicine) => {
    const todayEntries = [];
    
    medicine.schedule.forEach(scheduleItem => {
      const reminderId = `${medicine.id}-${scheduleItem.time}`;
      const status = reminderStatuses[reminderId] || 'upcoming';
      
      todayEntries.push({
        id: reminderId,
        medicineName: medicine.name,
        time: scheduleItem.time,
        dose: `${scheduleItem.amount} ${medicine.unit}`,
        status
      });
    });

    return todayEntries.sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time}`);
      const timeB = new Date(`1970/01/01 ${b.time}`);
      return timeA - timeB;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return '#10B981'; // Зеленый
      case 'missed':
        return '#EF4444'; // Красный
      case 'upcoming':
        return '#9CA3AF'; // Серый
      default:
        return '#E5E7EB'; // Светло-серый
    }
  };

  const formatWeekRange = () => {
    if (!Object.keys(chartData).length) return '';
    
    const firstDay = chartData[0]?.date;
    const lastDay = chartData[6]?.date;
    
    if (!firstDay || !lastDay) return '';

    const options = { day: 'numeric', month: 'short' };
    const start = firstDay.toLocaleDateString('ru-RU', options);
    const end = lastDay.toLocaleDateString('ru-RU', options);
    
    return `${start} - ${end}`;
  };

  const isCurrentWeek = () => {
    return currentWeekOffset === 0;
  };

  const renderChart = () => {
    if (!selectedMedicine || !Object.keys(chartData).length) {
      return (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyText}>Выберите лекарство для просмотра графика</Text>
        </View>
      );
    }

    // Определяем максимальное количество приемов в день для построения сетки
    const maxEntries = Math.max(...Object.values(chartData).map(day => day.entries.length), 1);

    return (
      <View style={styles.chart}>
        {/* Заголовок графика */}
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>{selectedMedicine.name}</Text>
          <Text style={styles.chartWeek}>{formatWeekRange()}</Text>
        </View>

        {/* Дни недели */}
        <View style={styles.daysRow}>
          {Object.values(chartData).map((day, index) => (
            <View key={index} style={styles.dayColumn}>
              <Text style={styles.dayName}>{day.dayName}</Text>
              <Text style={styles.dayDate}>
                {day.date.getDate()}
              </Text>
            </View>
          ))}
        </View>

        {/* Сетка приемов */}
        <View style={styles.entriesGrid}>
          {Array.from({ length: maxEntries }, (_, rowIndex) => (
            <View key={rowIndex} style={styles.entriesRow}>
              {Object.values(chartData).map((day, dayIndex) => {
                const entry = day.entries[rowIndex];
                const color = entry ? getStatusColor(entry.status) : '#F3F4F6';
                
                return (
                  <View key={dayIndex} style={styles.entryCell}>
                    <View 
                      style={[
                        styles.statusDot,
                        { backgroundColor: color }
                      ]}
                    />
                    {entry && (
                      <Text style={styles.entryTime}>{entry.time}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Легенда */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Принято</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>Пропущено</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#9CA3AF' }]} />
            <Text style={styles.legendText}>Ожидается</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Графики приема</Text>
        <Text style={styles.subtitle}>Недельная визуализация</Text>
      </View>

      {medicines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bar-chart-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Нет лекарств</Text>
          <Text style={styles.emptySubtitle}>
            Добавьте лекарства для просмотра графиков
          </Text>
        </View>
      ) : (
        <>
          {/* Селектор лекарства */}
          <TouchableOpacity 
            style={styles.medicineSelector}
            onPress={() => setShowMedicineSelector(true)}
          >
            <Text style={styles.selectorLabel}>Лекарство:</Text>
            <View style={styles.selectorValue}>
              <Text style={styles.selectorText}>
                {selectedMedicine?.name || 'Выберите лекарство'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </View>
          </TouchableOpacity>

          {/* Навигация по неделям */}
          <View style={styles.weekNavigation}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            >
              <Ionicons name="chevron-back" size={24} color="#3B82F6" />
              <Text style={styles.navButtonText}>Предыдущая</Text>
            </TouchableOpacity>
            
            <Text style={styles.weekIndicator}>
              {isCurrentWeek() ? 'Текущая неделя' : `${currentWeekOffset} нед. назад`}
            </Text>
            
            <TouchableOpacity 
              style={[styles.navButton, currentWeekOffset === 0 && styles.navButtonDisabled]}
              onPress={() => setCurrentWeekOffset(Math.max(0, currentWeekOffset - 1))}
              disabled={currentWeekOffset === 0}
            >
              <Text style={[
                styles.navButtonText, 
                currentWeekOffset === 0 && styles.navButtonTextDisabled
              ]}>
                Следующая
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={currentWeekOffset === 0 ? '#D1D5DB' : '#3B82F6'} 
              />
            </TouchableOpacity>
          </View>

          {/* График */}
          {renderChart()}
        </>
      )}

      {/* Модальное окно выбора лекарства */}
      <Modal
        visible={showMedicineSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMedicineSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderContent}>
                <View style={styles.modalIcon}>
                  <Ionicons name="medical" size={24} color="#3B82F6" />
                </View>
                <View style={styles.modalTitleContainer}>
                  <Text style={styles.modalTitle}>Выберите лекарство</Text>
                  <Text style={styles.modalSubtitle}>
                    Для просмотра графика приема
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowMedicineSelector(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.medicinesList} showsVerticalScrollIndicator={false}>
              {medicines.map((medicine) => (
                <TouchableOpacity
                  key={medicine.id}
                  style={[
                    styles.medicineItem,
                    selectedMedicine?.id === medicine.id && styles.selectedMedicineItem
                  ]}
                  onPress={() => {
                    setSelectedMedicine(medicine);
                    setShowMedicineSelector(false);
                  }}
                >
                  <View style={styles.medicineItemContent}>
                    <View style={[
                      styles.medicineItemIcon,
                      selectedMedicine?.id === medicine.id && styles.selectedMedicineItemIcon
                    ]}>
                      <Ionicons 
                        name="medical-outline" 
                        size={20} 
                        color={selectedMedicine?.id === medicine.id ? '#3B82F6' : '#6B7280'} 
                      />
                    </View>
                    <View style={styles.medicineItemInfo}>
                      <Text style={[
                        styles.medicineItemText,
                        selectedMedicine?.id === medicine.id && styles.selectedMedicineItemText
                      ]}>
                        {medicine.name}
                      </Text>
                      <Text style={styles.medicineItemSubtext}>
                        {medicine.schedule.length} приема в день • {medicine.unit}
                      </Text>
                    </View>
                    {selectedMedicine?.id === medicine.id && (
                      <View style={styles.selectedIndicator}>
                        <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 400,
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
  medicineSelector: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  selectorValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#D1D5DB',
  },
  weekIndicator: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  chart: {
    margin: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  chartHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  chartWeek: {
    fontSize: 14,
    color: '#6B7280',
  },
  daysRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 2,
  },
  dayDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  entriesGrid: {
    marginBottom: 16,
  },
  entriesRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  entryCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 2,
  },
  entryTime: {
    fontSize: 10,
    color: '#6B7280',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyChart: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    maxHeight: '80%',
    marginVertical: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIcon: {
    marginRight: 16,
  },
  modalTitleContainer: {
    flexDirection: 'column',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalCloseButton: {
    padding: 4,
  },
  medicinesList: {
    maxHeight: 400,
    borderRadius: 12,
    overflow: 'hidden',
  },
  medicineItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedMedicineItem: {
    backgroundColor: '#EBF4FF',
  },
  medicineItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicineItemIcon: {
    marginRight: 16,
  },
  selectedMedicineItemIcon: {
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    padding: 4,
  },
  medicineItemInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  medicineItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  selectedMedicineItemText: {
    color: '#3B82F6',
  },
  medicineItemSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedIndicator: {
    marginLeft: 'auto',
  },
});

export default ChartsTab; 