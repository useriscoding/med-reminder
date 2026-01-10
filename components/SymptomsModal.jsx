import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SYMPTOMS_RU, SYMPTOMS_LIST } from '@utils/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '@utils/apiService';

const SymptomsModal = ({ 
  visible, 
  onClose, 
  sideEffect,
  onSymptomsSubmitted
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Загружаем профиль пользователя при открытии модального окна
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await AsyncStorage.getItem('userProfile');
        if (profile) {
          setUserProfile(JSON.parse(profile));
        }
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      }
    };

    if (visible) {
      loadUserProfile();
      // Сбрасываем выбранные симптомы при открытии
      setSelectedSymptoms({});
    }
  }, [visible]);

  const toggleSymptom = (symptomIndex) => {
    setSelectedSymptoms(prev => ({
      ...prev,
      [symptomIndex]: !prev[symptomIndex]
    }));
  };

  const submitSymptoms = async () => {
    if (!userProfile) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные профиля');
      return;
    }

    if (!userProfile.age || !userProfile.height || !userProfile.weight || userProfile.gender === undefined) {
      Alert.alert(
        'Неполный профиль', 
        'Пожалуйста, заполните все поля профиля (возраст, рост, вес, пол) перед отправкой симптомов'
      );
      return;
    }

    setLoading(true);

    try {
      // Формируем массив симптомов в правильном порядке
      const symptomsArray = SYMPTOMS_LIST.map((_, index) => 
        selectedSymptoms[index] ? 1 : 0
      );

      // Получаем текущую дату в формате DD.MM.YYYY
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;

      const requestData = {
        drug: sideEffect.medicineName, // Используем название лекарства
        date: formattedDate,
        gender: parseInt(userProfile.gender),
        height: parseInt(userProfile.height),
        weight: parseInt(userProfile.weight),
        age: parseInt(userProfile.age),
        symptoms: JSON.stringify(symptomsArray)
      };

      await ApiService.submitSymptoms(requestData);
      
      // Уведомляем родительский компонент об успешной отправке
      onSymptomsSubmitted(sideEffect.id, Object.keys(selectedSymptoms).filter(key => selectedSymptoms[key]).map(key => SYMPTOMS_RU[SYMPTOMS_LIST[key]]));
      
      Alert.alert('Успешно', 'Симптомы отправлены успешно!');
      onClose();
    } catch (error) {
      Alert.alert('Ошибка', error.message || 'Не удалось отправить симптомы');
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = Object.values(selectedSymptoms).filter(Boolean).length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Выберите симптомы</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.subtitle}>
            <Text style={styles.medicineText}>
              Лекарство: {sideEffect?.medicineName}
            </Text>
            <Text style={styles.countText}>
              Выбрано: {selectedCount} симптомов
            </Text>
          </View>

          <ScrollView style={styles.content}>
            {SYMPTOMS_LIST.map((symptom, index) => (
              <TouchableOpacity
                key={index}
                style={styles.symptomItem}
                onPress={() => toggleSymptom(index)}
              >
                <View style={styles.symptomContent}>
                  <Text style={styles.symptomName}>
                    {SYMPTOMS_RU[symptom] || symptom}
                  </Text>
                  <View style={[
                    styles.checkbox,
                    selectedSymptoms[index] && styles.checkboxSelected
                  ]}>
                    {selectedSymptoms[index] && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={submitSymptoms}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>
                    Отправить симптомы
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  medicineText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  countText: {
    fontSize: 12,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  symptomItem: {
    marginBottom: 12,
  },
  symptomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  symptomName: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default SymptomsModal; 