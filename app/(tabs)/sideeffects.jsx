import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useMedicines } from '@contexts/MedicinesContext';
import SideEffectCard from '@components/SideEffectCard';
import DrugInfoModal from '@components/DrugInfoModal';
import SymptomsModal from '@components/SymptomsModal';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '@utils/apiService';

const SideEffects = () => {
  const { sideEffectsData, updateSideEffectSymptoms } = useMedicines();
  const [drugInfoModal, setDrugInfoModal] = useState({
    visible: false,
    loading: false,
    error: null,
    drugInfo: null,
    medicineName: ''
  });
  
  const [symptomsModal, setSymptomsModal] = useState({
    visible: false,
    sideEffect: null
  });

  const handleViewSymptoms = async (sideEffectId) => {
    const sideEffect = sideEffectsData.find(item => item.id === sideEffectId);
    if (!sideEffect) return;

    // Открываем модальное окно и начинаем загрузку
    setDrugInfoModal({
      visible: true,
      loading: true,
      error: null,
      drugInfo: null,
      medicineName: sideEffect.medicineName
    });

    try {
      const drugInfo = await ApiService.getDrugInfo(sideEffect.medicineName);
      
      setDrugInfoModal(prev => ({
        ...prev,
        loading: false,
        drugInfo: drugInfo
      }));
    } catch (error) {
      setDrugInfoModal(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Не удалось загрузить информацию о лекарстве'
      }));
    }
  };

  const handleAddSymptoms = (sideEffectId) => {
    const sideEffect = sideEffectsData.find(item => item.id === sideEffectId);
    if (!sideEffect) return;

    // Если симптомы уже отправлены, не открываем модальное окно
    if (sideEffect.symptomsSubmitted) {
      Alert.alert('Информация', 'Симптомы для этого лекарства уже были отправлены');
      return;
    }

    setSymptomsModal({
      visible: true,
      sideEffect: sideEffect
    });
  };

  const handleSymptomsSubmitted = (sideEffectId, selectedSymptomsNames) => {
    // Обновляем локальные данные о симптомах
    if (updateSideEffectSymptoms) {
      updateSideEffectSymptoms(sideEffectId, selectedSymptomsNames);
    }
  };

  const closeDrugInfoModal = () => {
    setDrugInfoModal({
      visible: false,
      loading: false,
      error: null,
      drugInfo: null,
      medicineName: ''
    });
  };

  const closeSymptomsModal = () => {
    setSymptomsModal({
      visible: false,
      sideEffect: null
    });
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="medical-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>Нет данных о побочных эффектах</Text>
      <Text style={styles.emptyText}>
        Принятые лекарства будут отображаться здесь для отслеживания побочных эффектов
      </Text>
    </View>
  );

  // Сортируем по времени приема (новые сверху)
  const sortedSideEffects = [...sideEffectsData].sort((a, b) => 
    new Date(b.takenAt) - new Date(a.takenAt)
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {sortedSideEffects.length > 0 ? (
          sortedSideEffects.map((sideEffect) => (
            <SideEffectCard
              key={sideEffect.id}
              medicineName={sideEffect.medicineName}
              dose={sideEffect.dose}
              takenTime={sideEffect.takenTime}
              takenAt={sideEffect.takenAt}
              symptoms={sideEffect.symptoms}
              symptomsSubmitted={sideEffect.symptomsSubmitted}
              onViewSymptoms={() => handleViewSymptoms(sideEffect.id)}
              onAddSymptoms={() => handleAddSymptoms(sideEffect.id)}
            />
          ))
        ) : renderEmptyList()}
      </ScrollView>

      <DrugInfoModal
        visible={drugInfoModal.visible}
        onClose={closeDrugInfoModal}
        drugInfo={drugInfoModal.drugInfo}
        loading={drugInfoModal.loading}
        error={drugInfoModal.error}
        medicineName={drugInfoModal.medicineName}
      />

      <SymptomsModal
        visible={symptomsModal.visible}
        onClose={closeSymptomsModal}
        sideEffect={symptomsModal.sideEffect}
        onSymptomsSubmitted={handleSymptomsSubmitted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  scrollView: {
    flex: 1,
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
  },
});

export default SideEffects;