import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StatusChangeModal = ({ visible, onClose, onConfirm, currentStatus, medicineName, description, instructions, dose }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'done':
        return 'Принято';
      case 'missed':
        return 'Пропущено';
      case 'upcoming':
        return 'Предстоит';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return '#059669';
      case 'missed':
        return '#DC2626';
      case 'upcoming':
        return '#7E57C2';
      default:
        return '#6B7280';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>Отметить прием</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Информационный блок */}
          <View style={styles.infoBlock}>
            <Text style={styles.medicineName}>{medicineName}</Text>
            {dose && (
              <Text style={styles.dose}>{dose}</Text>
            )}
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
            {instructions && (
              <Text style={styles.instructions}>{instructions}</Text>
            )}
          </View>
          
          <View style={styles.statusButtons}>
            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: '#ECFDF5', borderColor: '#059669' }]}
              onPress={() => {
                onConfirm('done');
                onClose();
              }}
            >
              <Ionicons name="checkmark-circle" size={24} color="#059669" />
              <Text style={[styles.statusButtonText, { color: '#059669' }]}>
                Принято
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: '#FEF2F2', borderColor: '#DC2626' }]}
              onPress={() => {
                onConfirm('missed');
                onClose();
              }}
            >
              <Ionicons name="close-circle" size={24} color="#DC2626" />
              <Text style={[styles.statusButtonText, { color: '#DC2626' }]}>
                Пропущено
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  infoBlock: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
  },
  medicineName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  dose: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 2,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 15,
    color: '#059669',
    marginTop: 2,
    textAlign: 'center',
  },
  statusButtons: {
    gap: 12,
    marginBottom: 16,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default StatusChangeModal; 