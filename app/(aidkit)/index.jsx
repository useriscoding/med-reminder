import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import MedicineCard from '../../components/MedicineCard';
import { useRouter } from 'expo-router';


const AidKit = () => {

  const medicines = [
      { id: '1', name: 'Колдакт', schedule: '2 раза в день', stock: 5, stockInfo: 'Осталось 5 таблеток' },
      { id: '2', name: 'Эреспал', schedule: '1 раз в день', stock: 120, stockInfo: 'Осталось около 120 мл' },
    ];

  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList 
        data={medicines}
        renderItem={({ item }) => <MedicineCard medicine={item} />}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/add')} // Или другая логика
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