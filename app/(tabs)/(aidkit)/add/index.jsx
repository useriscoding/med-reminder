import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocale } from '@contexts/LocaleContext';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const commonMedicines = [
  'Панадол',
  'Нурофен', 
  'Анальгин',
  'Вольтарен',
  'Кеторолак',
  'Трамал',
  'Морфин',
  'Напроксен',
  'Мовалис',
  'Целебрекс',
  'Аркоксиа',
  'Амоксиклав',
  'Сумамед',
  'Ципробай',
  'Роцефин',
  'Юнидокс Солютаб',
  'Трихопол',
  'Клацид',
  'Левофлоксацин',
  'Супракс',
  'Тамифлю',
  'Зовиракс',
  'Валацикловир',
  'Веклури',
  'Виреад',
  'Эпивир',
  'Дифлюкан',
  'Канестен',
  'Низорал',
  'Нистатин',
  'Кларитин',
  'Зиртек',
  'Эриус',
  'Ксизал',
  'Хлоропирамин',
  'Лазолван',
  'АЦЦ',
  'Бромгексин',
  'Гликодин',
  'Вазотек',
  'Престариум',
  'Пренесса',
  'Норваск',
  'Конкор',
  'Эгилок',
  'Лозартан',
  'Диован',
  'Плавикс',
  'Липримар',
  'Крестор',
  'Дигоксин',
  'Лазикс',
  'Гидрохлортиазид',
  'Верошпирон',
  'Варфарин',
  'Ксарелто',
  'Эликвис',
  'Гепарин',
  'Аспирин',
  'Глюкофаж',
  'Диабетон',
  'Жанет',
  'Фариксга',
  'Лантус',
  'Новорапид',
  'Эутирокс',
  'Преднизолон',
  'Дексаметазон',
  'Гидрокортизон',
  'Эстриол',
  'Утрожестан',
  'Валиум',
  'Атевис',
  'Ксанакс',
  'Золофт',
  'Прозак',
  'Ципралекс',
  'Амитриптилин',
  'Сероквель',
  'Зипрекса',
  'Рисполепт',
  'Депакин',
  'Тегретол',
  'Кеппра',
  'Ламиктал',
  'Лидокаин',
  'Маркаин',
  'Но-шпа',
  'Папаверин',
  'Омепразол',
  'Контролок',
  'Мотилиум',
  'Имодиум',
  'Месалазин',
  'Ондансетрон',
  'Церукал',
  'Витамин B12',
  'Витамин D3',
  'Метотрексат',
  'Тритцея',
  'Парацетамол',
  'Ибупрофен',
  'Супрастин',
  'Цитрамон'
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
  const [profileFilled, setProfileFilled] = useState(true);

  useEffect(() => {
    (async () => {
      const profile = await AsyncStorage.getItem('userProfile');
      if (profile) {
        const data = JSON.parse(profile);
        if (!data.age || !data.height || !data.weight) {
          setProfileFilled(false);
        } else {
          setProfileFilled(true);
        }
      } else {
        setProfileFilled(false);
      }
    })();
    navigation.setOptions({ title: t.tabs.addMedicine });
  }, [navigation, t]);

  const handleNameChange = (text) => {
    setName(text);
    if (text.length > 0) {
      const filtered = commonMedicines.filter(med => 
        med.toLowerCase().includes(text.toLowerCase())
      )
      .slice(0, 8) // Ограничиваем до 8 результатов
      .sort((a, b) => {
        // Сначала показываем точные совпадения в начале
        const aStarts = a.toLowerCase().startsWith(text.toLowerCase());
        const bStarts = b.toLowerCase().startsWith(text.toLowerCase());
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.localeCompare(b);
      });
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleNext = () => {
    if (!profileFilled) {
      alert('Пожалуйста, заполните профиль перед добавлением лекарства.');
      return;
    }
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
          <ScrollView style={styles.suggestions} nestedScrollEnabled={true}>
            {suggestions.map((suggestion) => (
              <TouchableOpacity 
                key={suggestion} 
                style={styles.suggestionItem}
                onPress={() => {
                  setName(suggestion);
                  setSuggestions([]);
                }}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
          style={[styles.button, (!name.trim() || !profileFilled) && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!name.trim() || !profileFilled}
        >
          <Text style={styles.buttonText}>Далее</Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
        {!profileFilled && (
          <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>
            Для добавления лекарства заполните профиль.
          </Text>
        )}
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
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionText: {
    color: '#3B82F6',
    fontSize: 16,
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