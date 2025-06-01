import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocale } from '@contexts/LocaleContext';
import { useNavigation } from 'expo-router';

const commonMedicines = [
  'Парацетамол',
  'Ибупрофен',
  'Аспирин',
  'Нурофен',
  'Анальгин',
  'Но-шпа',
  'Супрастин',
  'Цитрамон',
];

const unitOptions = [
  { icon: 'tablet', label: 'Таблетки', value: 'таблетки' },
  { icon: 'water', label: 'Миллилитры', value: 'мл' },
  { icon: 'medical', label: 'Капсулы', value: 'капсулы' },
  { icon: 'eyedrop', label: 'Капли', value: 'капли' },
];

export default function AddMedicineStep1() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('таблетки');
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();
  const { t } = useLocale();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: t.tabs.addMedicine });
  }, [navigation, t]);

  const handleNameChange = (text) => {
    setName(text);
    if (text.length > 0) {
      const filtered = commonMedicines.filter(med => 
        med.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleNext = () => {
    router.push({
      pathname: '/(aidkit)/add/schedule',
      params: { name, description, unit }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Название лекарства</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите название"
          value={name}
          onChangeText={handleNameChange}
        />
        
        {suggestions.length > 0 && (
          <View style={styles.suggestions}>
            {suggestions.map((suggestion) => (
              <TouchableOpacity 
                key={suggestion} 
                style={styles.suggestionItem}
                onPress={() => {
                  setName(suggestion);
                  setSuggestions([]);
                }}
              >
                <Text>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Описание</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Добавьте важную информацию о препарате"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Единицы измерения</Text>
        <View style={styles.unitContainer}>
          {unitOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.unitOption,
                unit === option.value && styles.unitOptionSelected
              ]}
              onPress={() => setUnit(option.value)}
            >
              <Ionicons 
                name={option.icon} 
                size={24} 
                color={unit === option.value ? '#fff' : '#3B82F6'} 
              />
              <Text style={[
                styles.unitText,
                unit === option.value && styles.unitTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>Далее</Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  suggestions: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: -8,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  unitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  unitOption: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 8,
  },
  unitOptionSelected: {
    backgroundColor: '#3B82F6',
  },
  unitText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  unitTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});