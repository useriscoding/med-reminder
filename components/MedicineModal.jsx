import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MedicineModal = ({ medicine, visible, onClose, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      'Удаление лекарства',
      'Вы уверены, что хотите удалить это лекарство? Все напоминания о приеме будут также удалены.',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            onDelete(medicine.id);
            onClose();
          }
        }
      ]
    );
  };

  if (!medicine) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>

          <ScrollView style={styles.content}>
            <Text style={styles.title}>{medicine.name}</Text>
            
            {medicine.description && (
              <Text style={styles.description}>{medicine.description}</Text>
            )}

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Остаток</Text>
              <Text style={styles.stockInfo}>{medicine.stockInfo}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Расписание приема</Text>
              {medicine.schedule.map((item, index) => (
                <Text key={index} style={styles.scheduleItem}>
                  {item.time} - {item.amount} {medicine.unit}
                </Text>
              ))}
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Напоминание о пополнении</Text>
              <Text style={styles.thresholdInfo}>
                Когда остаток меньше {medicine.remindThreshold} {medicine.unit}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>Удалить лекарство</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  content: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  stockInfo: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '500',
  },
  scheduleItem: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 4,
  },
  thresholdInfo: {
    fontSize: 16,
    color: '#4B5563',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 24,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default MedicineModal; 