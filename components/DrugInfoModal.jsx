import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DrugInfoModal = ({ 
  visible, 
  onClose, 
  drugInfo, 
  loading, 
  error,
  medicineName 
}) => {
  const renderSymptoms = () => {
    if (!drugInfo?.symptomsArray || drugInfo.symptomsArray.length === 0) {
      return (
        <Text style={styles.noSymptomsText}>
          Нет данных о возможных побочных эффектах
        </Text>
      );
    }

    // Сортируем симптомы по вероятности (убывание)
    const sortedSymptoms = drugInfo.symptomsArray.sort((a, b) => b.probability - a.probability);

    return sortedSymptoms.map((symptom, index) => {
      // Рассчитываем ширину полоски: максимум 80% от контейнера для крупных значений
      const barWidth = Math.min(symptom.probability * 80, 80);
      
      return (
        <View key={index} style={styles.symptomRow}>
          <Text style={styles.symptomName}>{symptom.nameRu}</Text>
          <View style={styles.probabilityContainer}>
            <View 
              style={[
                styles.probabilityBar, 
                { width: `${barWidth}%` }
              ]} 
            />
            <Text style={styles.probabilityText}>
              {(symptom.probability * 100).toFixed(1)}%
            </Text>
          </View>
        </View>
      );
    });
  };

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
            <Text style={styles.title}>Информация о лекарстве</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Загрузка информации...</Text>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={48} color="#EF4444" />
                <Text style={styles.errorTitle}>Ошибка</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {drugInfo && !loading && !error && (
              <>
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Основная информация</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Название:</Text>
                    <Text style={styles.infoValue}>{drugInfo.name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>МНН:</Text>
                    <Text style={styles.infoValue}>{drugInfo.mnn}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Фармакологическая группа:</Text>
                    <Text style={styles.infoValue}>{drugInfo.pharmaGroup}</Text>
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Возможные побочные эффекты</Text>
                  <Text style={styles.sectionSubtitle}>
                    Вероятность возникновения симптомов после приема лекарства:
                  </Text>
                  {renderSymptoms()}
                </View>
              </>
            )}
          </ScrollView>
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
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
    flexWrap: 'wrap',
  },
  symptomRow: {
    marginBottom: 12,
  },
  symptomName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 6,
  },
  probabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    maxWidth: '100%',
  },
  probabilityBar: {
    height: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
    marginRight: 8,
    minWidth: 2,
  },
  probabilityText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  noSymptomsText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default DrugInfoModal; 