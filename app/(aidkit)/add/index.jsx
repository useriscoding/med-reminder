import { View, TextInput, Button, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function AddMedicineStep1() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('таблетки');
  const router = useRouter();

  const handleNext = () => {
    router.push({
      pathname: '/(aidkit)/add/schedule',
      params: { name, description, unit }
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Название лекарства"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Описание"
        value={description}
        onChangeText={setDescription}
        style={{ marginVertical: 10 }}
      />

      <Text>Единицы измерения</Text>
      <Picker
        selectedValue={unit}
        onValueChange={(itemValue) => setUnit(itemValue)}
        style={{ height: 50 }}
      >
        <Picker.Item label="Таблетки" value="таблетки" />
        <Picker.Item label="Миллилитры (мл)" value="мл" />
      </Picker>

      <Button 
        title="Далее" 
        onPress={handleNext} 
        disabled={!name.trim()}
      />
    </View>
  );
}