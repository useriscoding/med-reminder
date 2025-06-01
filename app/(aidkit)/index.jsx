import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import MedicineCard from '../../components/MedicineCard';
import { useRouter } from 'expo-router';
import { useMedicines } from '../../contexts/MedicinesContext';
import { Ionicons } from '@expo/vector-icons';

const AidKit = () => {
  const { medicines } = useMedicines();
  const router = useRouter();

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="medkit-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>Ваша аптечка пуста</Text>
      <Text style={styles.emptyText}>
        Добавьте лекарства, чтобы получать напоминания о приёме
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList 
        data={medicines}
        renderItem={({ item }) => <MedicineCard medicine={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyList}
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/add')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AidKit

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