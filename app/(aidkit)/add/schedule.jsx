import { View, Text, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ScheduleStep() {
  const { name, description, unit } = useLocalSearchParams();
  const router = useRouter();

  const [timesPerDay, setTimesPerDay] = useState(1);
  const [schedule, setSchedule] = useState([{ time: '08:00', amount: '1' }]);

  const handleTimesChange = (value) => {
    const num = parseInt(value);
    setTimesPerDay(num);
    setSchedule(Array.from({ length: num }, (_, i) => schedule[i] || { time: '08:00', amount: '1' }));
  };

  const handleChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleNext = () => {
    router.push({
      pathname: '/(aidkit)/add/reminders',
      params: {
        name, description, unit,
        schedule: JSON.stringify(schedule),
      }
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Укажите количество раз</Text>
      <Picker
        selectedValue={timesPerDay.toString()}
        onValueChange={handleTimesChange}
        style={{ height: 50 }}
      >
        {[1, 2, 3, 4, 5].map(num => (
          <Picker.Item key={num} label={num.toString()} value={num.toString()} />
        ))}
      </Picker>

      {schedule.map((entry, index) => (
        <View key={index} style={{ flexDirection: 'row', marginVertical: 8, alignItems: 'center' }}>
          <Text style={{ width: 60 }}>Время:</Text>
          <TextInput
            value={entry.time}
            onChangeText={(text) => handleChange(index, 'time', text)}
            placeholder="HH:MM"
            style={{ borderWidth: 1, padding: 5, width: 80 }}
          />
          <Text style={{ marginLeft: 10, width: 80 }}>Количество:</Text>
          <Picker
            selectedValue={entry.amount}
            onValueChange={(value) => handleChange(index, 'amount', value)}
            style={{ flex: 1 }}
          >
            {[...Array(10).keys()].map(n => (
              <Picker.Item key={n+1} label={`${n+1}`} value={`${n+1}`} />
            ))}
          </Picker>
        </View>
      ))}

      <Button title="Далее" onPress={handleNext} />
    </View>
  );
}
