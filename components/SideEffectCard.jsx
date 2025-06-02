import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SideEffectCard = ({ 
  medicineName, 
  dose, 
  takenTime, 
  takenAt, 
  symptoms = [],
  symptomsSubmitted = false,
  onViewSymptoms,
  onAddSymptoms 
}) => {
  const formatTakenDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return 'Сегодня';
    }
    
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerContainer}>
        <View style={styles.medicineInfo}>
          <Text style={styles.medicineName}>{medicineName}</Text>
          <Text style={styles.dose}>{dose}</Text>
        </View>
        <View style={styles.timeInfo}>
          <Text style={styles.takenDate}>{formatTakenDate(takenAt)}</Text>
          <Text style={styles.takenTime}>{takenTime}</Text>
        </View>
      </View>
      
      {symptoms.length > 0 && (
        <View style={styles.symptomsContainer}>
          <Text style={styles.symptomsLabel}>Отмеченные симптомы:</Text>
          <Text style={styles.symptomsText}>{symptoms.join(', ')}</Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.viewButton]}
          onPress={onViewSymptoms}
        >
          <Ionicons name="eye-outline" size={20} color="#6B7280" />
          <Text style={styles.viewButtonText}>Просмотр</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            symptomsSubmitted ? styles.submittedButton : styles.addButton
          ]}
          onPress={symptomsSubmitted ? null : onAddSymptoms}
          disabled={symptomsSubmitted}
        >
          <Ionicons 
            name={symptomsSubmitted ? "checkmark-circle" : "checkbox-outline"} 
            size={20} 
            color={symptomsSubmitted ? "#10B981" : "#3B82F6"} 
          />
          <Text style={[
            symptomsSubmitted ? styles.submittedButtonText : styles.addButtonText
          ]}>
            {symptomsSubmitted ? "Отправлено" : "Симптомы"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  dose: {
    fontSize: 14,
    color: '#6B7280',
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  takenDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  takenTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  symptomsContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  symptomsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  symptomsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  viewButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addButton: {
    backgroundColor: '#EBF5FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  submittedButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  submittedButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
  },
});

export default SideEffectCard; 