import { View, Text, Switch, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function RemindersStep() {
  const { name, description, unit, schedule } = useLocalSearchParams();
  const router = useRouter();

  const [enableReminder, setEnableReminder] = useState(false);
  const [currentStock, setCurrentStock] = useState(10);
  const [remindThreshold, setRemindThreshold] = useState(2);

  const handleStockChange = (increment) => {
    const newValue = currentStock + increment;
    if (newValue >= 0 && newValue <= 999) {
      setCurrentStock(newValue);
    }
  };

  const handleThresholdChange = (increment) => {
    const newValue = remindThreshold + increment;
    if (newValue >= 0 && newValue < currentStock) {
      setRemindThreshold(newValue);
    }
  };

  const handleNext = () => {
    router.push({
      pathname: '/(aidkit)/add/confirmation',
      params: {
        name, 
        description, 
        unit, 
        schedule,
        enableReminder: enableReminder.toString(),
        currentStock: currentStock.toString(),
        remindThreshold: remindThreshold.toString(),
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Напоминания</Text>
      <Text style={styles.subtitle}>Настройте уведомления о пополнении запасов</Text>

      <View style={styles.card}>
        <View style={styles.switchContainer}>
          <View>
            <Text style={styles.switchTitle}>Напоминать о пополнении</Text>
            <Text style={styles.switchDescription}>
              Получайте уведомления, когда запасы подходят к концу
            </Text>
          </View>
          <Switch
            value={enableReminder}
            onValueChange={setEnableReminder}
            trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
            thumbColor={enableReminder ? '#3B82F6' : '#9CA3AF'}
          />
        </View>

        {enableReminder && (
          <View style={styles.reminderSettings}>
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Текущие запасы</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => handleStockChange(-1)}
                >
                  <Ionicons name="remove" size={24} color="#3B82F6" />
                </TouchableOpacity>
                
                <View style={styles.counterValueContainer}>
                  <Text style={styles.counterValue}>{currentStock}</Text>
                  <Text style={styles.unitText}>{unit}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => handleStockChange(1)}
                >
                  <Ionicons name="add" size={24} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Напомнить, когда останется</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => handleThresholdChange(-1)}
                >
                  <Ionicons name="remove" size={24} color="#3B82F6" />
                </TouchableOpacity>
                
                <View style={styles.counterValueContainer}>
                  <Text style={styles.counterValue}>{remindThreshold}</Text>
                  <Text style={styles.unitText}>{unit}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => handleThresholdChange(1)}
                >
                  <Ionicons name="add" size={24} color="#3B82F6" />
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>
                Вы получите уведомление, когда останется {remindThreshold} {unit}
              </Text>
            </View>
          </View>
        )}
      </View>

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
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    color: '#6B7280',
    maxWidth: '80%',
  },
  reminderSettings: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  settingSection: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  counterButton: {
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  counterValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    minWidth: 100,
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 4,
  },
  unitText: {
    fontSize: 14,
    color: '#6B7280',
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
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
});