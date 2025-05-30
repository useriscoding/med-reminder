import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

export default function ScheduleStep() {
  const { name, description, unit } = useLocalSearchParams();
  const router = useRouter();

  const [schedule, setSchedule] = useState([{ time: new Date(), amount: 1 }]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activeTimeIndex, setActiveTimeIndex] = useState(null);
  const [selectedTime, setSelectedTime] = useState(new Date());

  const handleAddTime = () => {
    setSchedule([...schedule, { time: new Date(), amount: 1 }]);
  };

  const handleRemoveTime = (index) => {
    if (schedule.length > 1) {
      setSchedule(schedule.filter((_, i) => i !== index));
    }
  };

  const handleTimeChange = (event, selected) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selected && activeTimeIndex !== null) {
      const updatedSchedule = [...schedule];
      updatedSchedule[activeTimeIndex] = {
        ...updatedSchedule[activeTimeIndex],
        time: selected
      };
      setSchedule(updatedSchedule);
      setSelectedTime(selected);
    }
  };

  const showTimePickerModal = (index) => {
    setSelectedTime(schedule[index].time);
    setActiveTimeIndex(index);
    setShowTimePicker(true);
  };

  const handleAmountChange = (index, increment) => {
    const updatedSchedule = [...schedule];
    const newAmount = updatedSchedule[index].amount + increment;
    if (newAmount >= 1 && newAmount <= 10) {
      updatedSchedule[index].amount = newAmount;
      setSchedule(updatedSchedule);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleNext = () => {
    const formattedSchedule = schedule.map(item => ({
      time: formatTime(item.time),
      amount: item.amount.toString()
    }));

    router.push({
      pathname: '/(aidkit)/add/reminders',
      params: {
        name, 
        description, 
        unit,
        schedule: JSON.stringify(formattedSchedule),
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>График приёма</Text>
      <Text style={styles.subtitle}>Укажите время и количество для каждого приёма</Text>

      {schedule.map((entry, index) => (
        <View key={index} style={styles.scheduleItem}>
          <View style={styles.timeSection}>
            <Text style={styles.label}>Время</Text>
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => showTimePickerModal(index)}
            >
              <Ionicons name="time-outline" size={24} color="#3B82F6" />
              <Text style={styles.timeText}>{formatTime(entry.time)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.label}>Количество ({unit})</Text>
            <View style={styles.amountControl}>
              <TouchableOpacity 
                style={styles.amountButton}
                onPress={() => handleAmountChange(index, -1)}
              >
                <Ionicons name="remove" size={24} color="#3B82F6" />
              </TouchableOpacity>
              
              <Text style={styles.amountText}>{entry.amount}</Text>
              
              <TouchableOpacity 
                style={styles.amountButton}
                onPress={() => handleAmountChange(index, 1)}
              >
                <Ionicons name="add" size={24} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>

          {schedule.length > 1 && (
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => handleRemoveTime(index)}
            >
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddTime}
      >
        <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
        <Text style={styles.addButtonText}>Добавить время приёма</Text>
      </TouchableOpacity>

      {Platform.OS === 'android' ? (
        showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            is24Hour={true}
            onChange={handleTimeChange}
            display="spinner"
          />
        )
      ) : (
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity 
                  onPress={() => setShowTimePicker(false)}
                  style={styles.pickerButton}
                >
                  <Text style={styles.pickerButtonText}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setShowTimePicker(false)}
                  style={styles.pickerButton}
                >
                  <Text style={[styles.pickerButtonText, styles.pickerButtonTextDone]}>Готово</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={true}
                onChange={handleTimeChange}
                display="spinner"
                style={styles.picker}
              />
            </View>
          </View>
        </Modal>
      )}

      <TouchableOpacity 
        style={styles.nextButton}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>Далее</Text>
        <Ionicons name="arrow-forward" size={24} color="#fff" />
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
  scheduleItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  timeSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  amountSection: {
    marginBottom: 8,
  },
  amountControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  amountButton: {
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  amountText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    marginBottom: 24,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#3B82F6',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pickerButton: {
    padding: 8,
    minWidth: 60,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    textAlign: 'center',
  },
  pickerButtonTextDone: {
    fontWeight: '600',
  },
  picker: {
    width: 280,
    height: 200,
  },
});
