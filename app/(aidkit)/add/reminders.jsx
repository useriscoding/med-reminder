import { View, Text, Switch,  Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function RemindersStep() {
  const { name, description, unit, schedule } = useLocalSearchParams();
  const router = useRouter();

  const [enableReminder, setEnableReminder] = useState(false);
  const [currentStock, setCurrentStock] = useState('10');
  const [remindThreshold, setRemindThreshold] = useState('2');

  const handleNext = () => {
    router.push({
      pathname: '/(aidkit)/add/confirmation',
      params: {
        name, description, unit, schedule,
        enableReminder,
        currentStock,
        remindThreshold,
      }
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Хотите получать напоминания о пополнении вашего запаса?</Text>
      <Switch
        value={enableReminder}
        onValueChange={setEnableReminder}
      />

      {enableReminder && (
        <>
          <Text style={{ marginTop: 10 }}>Текущие запасы ({unit})</Text>
          <Picker
            selectedValue={currentStock}
            onValueChange={setCurrentStock}
            style={{ height: 50 }}
          >
            {[...Array(21).keys()].map(n => (
              <Picker.Item key={n} label={`${n}`} value={`${n}`} />
            ))}
          </Picker>

          <Text style={{ marginTop: 10 }}>Напомни мне, когда останется</Text>
          <Picker
            selectedValue={remindThreshold}
            onValueChange={setRemindThreshold}
            style={{ height: 50 }}
          >
            {[...Array(21).keys()].map(n => (
              <Picker.Item key={n} label={`${n}`} value={`${n}`} />
            ))}
          </Picker>
        </>
      )}

      <Button title="Далее" onPress={handleNext} />
    </View>
  );
}