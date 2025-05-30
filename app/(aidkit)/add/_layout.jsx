// app/aidkit/add/_layout.jsx
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const steps = [
  { id: 'index', title: 'Информация', icon: 'information-circle' },
  { id: 'schedule', title: 'График', icon: 'calendar' },
  { id: 'reminders', title: 'Напоминания', icon: 'notifications' },
  { id: 'confirmation', title: 'Подтверждение', icon: 'checkmark-circle' },
];

export default function AddMedicineLayout() {
  const segments = useSegments();
  const currentPath = segments[segments.length - 1];
  
  const getStepStatus = (stepId) => {
    const currentIndex = steps.findIndex(step => step.id === currentPath);
    const stepIndex = steps.findIndex(step => step.id === stepId);
    
    if (currentIndex === -1) return stepIndex === 0 ? 'current' : 'upcoming';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          
          return (
            <View key={step.id} style={styles.stepWrapper}>
              <View style={styles.stepContainer}>
                <View style={[
                  styles.stepCircle,
                  status === 'completed' && styles.completedStep,
                  status === 'current' && styles.currentStep
                ]}>
                  {status === 'completed' ? (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  ) : (
                    <Text style={[
                      styles.stepText,
                      status === 'current' && styles.currentStepText
                    ]}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text style={[
                  styles.stepTitle,
                  status === 'completed' && styles.completedText,
                  status === 'current' && styles.currentText
                ]}>
                  {step.title}
                </Text>
              </View>
              
              {index < steps.length - 1 && (
                <View style={[
                  styles.connector,
                  status === 'completed' && styles.completedConnector
                ]} />
              )}
            </View>
          );
        })}
      </View>
      
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {steps.map(step => (
          <Stack.Screen 
            key={step.id} 
            name={step.id}
          />
        ))}
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stepWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 100,
  },
  stepContainer: {
    alignItems: 'center',
    minWidth: 65,
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    zIndex: 1,
  },
  completedStep: {
    backgroundColor: '#3B82F6',
  },
  currentStep: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  stepText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  currentStepText: {
    color: '#3B82F6',
  },
  stepTitle: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  completedText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  currentText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  connector: {
    position: 'absolute',
    top: 14,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: '#E5E7EB',
    zIndex: 0,
  },
  completedConnector: {
    backgroundColor: '#3B82F6',
  },
});