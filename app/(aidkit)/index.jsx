import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useMedicines } from '../../contexts/MedicinesContext';
import MedicineCard from '../../components/MedicineCard';
import MedicineModal from '../../components/MedicineModal';
import { Ionicons } from '@expo/vector-icons';

const AidKit = () => {
  const router = useRouter();
  const { medicines, deleteMedicine } = useMedicines();
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleMedicinePress = (medicine) => {
    setSelectedMedicine(medicine);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedMedicine(null);
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="medkit-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>Аптечка пуста</Text>
      <Text style={styles.emptyText}>
        Добавьте лекарства, чтобы начать отслеживать их прием
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {medicines.length > 0 ? (
          medicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onPress={handleMedicinePress}
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

      <MedicineModal
        medicine={selectedMedicine}
        visible={modalVisible}
        onClose={handleCloseModal}
        onDelete={deleteMedicine}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
    padding: 16,
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
});

export default AidKit;