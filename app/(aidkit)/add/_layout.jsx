// app/aidkit/add/_layout.jsx
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useSegments } from 'expo-router';

const steps = [
  { name: 'index', title: 'Основная информация' },
  { name: 'schedule', title: 'График приёма' },
  { name: 'reminders', title: 'Напоминания' },
  { name: 'confirmation', title: 'Подтверждение' },
];

export default function AddMedicineLayout() {
  const segments = useSegments();
  const currentStep = steps.findIndex(step => 
    segments[segments.length - 1] === step.name
  );

  return (
    <>
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <View key={step.name} style={styles.stepContainer}>
            <View style={[
              styles.stepCircle,
              index <= currentStep && styles.activeStep
            ]}>
              <Text style={styles.stepText}>{index + 1}</Text>
            </View>
            <Text style={[
              styles.stepTitle,
              index <= currentStep && styles.activeText
            ]}>
              {step.title}
            </Text>
          </View>
        ))}
      </View>
      
      <Stack
        screenOptions={{
          headerShown: false, // Скрываем стандартный заголовок
        }}
      >
        {steps.map(step => (
          <Stack.Screen 
            key={step.name} 
            name={step.name} 
          />
        ))}
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeStep: {
    backgroundColor: '#007AFF',
  },
  stepText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  activeText: {
    color: '#007AFF',
  },
});