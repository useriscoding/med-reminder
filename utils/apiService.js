import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:8080/epill';

// Список симптомов в том же порядке, что указан в API
export const SYMPTOMS_LIST = [
  'Pain', 'Fever', 'Cough', 'Runny nose', 'Headache', 'Sore throat', 
  'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Heartburn', 
  'Shortness of breath', 'Palpitations', 'Dizziness', 'High blood pressure', 
  'Swelling', 'Rash', 'Itching', 'Drowsiness', 'Insomnia', 'Depression', 
  'Anxiety', 'Seizures', 'Cognitive impairment', 'Fatigue', 'Joint pain', 
  'Abdominal pain', 'Dysuria', 'Hematuria', 'Bleeding'
];

// Русские названия симптомов
export const SYMPTOMS_RU = {
  'Pain': 'Боль',
  'Fever': 'Лихорадка',
  'Cough': 'Кашель',
  'Runny nose': 'Насморк',
  'Headache': 'Головная боль',
  'Sore throat': 'Боль в горле',
  'Nausea': 'Тошнота',
  'Vomiting': 'Рвота',
  'Diarrhea': 'Диарея',
  'Constipation': 'Запор',
  'Heartburn': 'Изжога',
  'Shortness of breath': 'Одышка',
  'Palpitations': 'Сердцебиение',
  'Dizziness': 'Головокружение',
  'High blood pressure': 'Высокое давление',
  'Swelling': 'Отек',
  'Rash': 'Сыпь',
  'Itching': 'Зуд',
  'Drowsiness': 'Сонливость',
  'Insomnia': 'Бессонница',
  'Depression': 'Депрессия',
  'Anxiety': 'Тревожность',
  'Seizures': 'Судороги',
  'Cognitive impairment': 'Нарушение когнитивных функций',
  'Fatigue': 'Усталость',
  'Joint pain': 'Боль в суставах',
  'Abdominal pain': 'Боль в животе',
  'Dysuria': 'Болезненное мочеиспускание',
  'Hematuria': 'Кровь в моче',
  'Bleeding': 'Кровотечение'
};

class ApiService {
  
  // Получение нового токена
  async refreshToken() {
    try {
      const userProfile = await AsyncStorage.getItem('userProfile');
      if (!userProfile) {
        throw new Error('Нет данных пользователя');
      }

      const { email } = JSON.parse(userProfile);
      const password = await AsyncStorage.getItem('password'); // Нужно сохранять пароль
      
      if (!password) {
        throw new Error('Пароль не найден');
      }

      const ip = await AsyncStorage.getItem('ip') || '178.71.129.113';
      
      const response = await fetch(`http://${ip}:8080/epill/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });

      if (!response.ok) {
        throw new Error('Ошибка обновления токена');
      }

      const data = await response.json();
      await AsyncStorage.setItem('token', data.token);
      return data.token;
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      throw error;
    }
  }

  // Выполнение запроса с автоматическим обновлением токена
  async makeAuthenticatedRequest(url, options = {}) {
    let token = await AsyncStorage.getItem('token');
    
    if (!token) {
      token = await this.refreshToken();
    }

    const requestOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    let response = await fetch(url, requestOptions);

    // Если токен протух (403), обновляем его и повторяем запрос
    if (response.status === 403) {
      token = await this.refreshToken();
      requestOptions.headers['Authorization'] = `Bearer ${token}`;
      response = await fetch(url, requestOptions);
    }

    return response;
  }

  // Получение информации о лекарстве
  async getDrugInfo(drugName) {
    try {
      const ip = await AsyncStorage.getItem('ip') || '178.71.129.113';
      const url = `http://${ip}:8080/epill/drugs/${encodeURIComponent(drugName)}`;
      
      console.log('Requesting drug info from:', url); // Для отладки
      
      const response = await this.makeAuthenticatedRequest(url);

      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Лекарство с таким названием не найдено');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('Drug info received:', data); // Для отладки
      
      // Парсим симптомы из строки в массив чисел
      let symptomsArray = [];
      try {
        symptomsArray = JSON.parse(data.symptoms);
      } catch (e) {
        console.error('Ошибка парсинга симптомов:', e);
        symptomsArray = [];
      }

      // Создаем объект с симптомами и их вероятностями
      const symptomsWithProbabilities = SYMPTOMS_LIST.map((symptom, index) => ({
        name: symptom,
        nameRu: SYMPTOMS_RU[symptom] || symptom,
        probability: symptomsArray[index] || 0
      }));

      // Фильтруем только значимые симптомы (с вероятностью > 0.01)
      const significantSymptoms = symptomsWithProbabilities.filter(s => s.probability > 0.01);

      return {
        ...data,
        symptomsArray: significantSymptoms
      };
    } catch (error) {
      console.error('Ошибка получения информации о лекарстве:', error);
      throw error;
    }
  }

  // Отправка симптомов на сервер
  async submitSymptoms(symptomsData) {
    try {
      const ip = await AsyncStorage.getItem('ip') || '178.71.129.113';
      const url = `http://${ip}:8080/epill/pill-swallowed`;
      
      console.log('Submitting symptoms to:', url); // Для отладки
      console.log('Symptoms data:', symptomsData); // Для отладки
      
      const response = await this.makeAuthenticatedRequest(url, {
        method: 'POST',
        body: JSON.stringify(symptomsData)
      });

      if (response.status === 403) {
        throw new Error('Ошибка авторизации');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Symptoms submission response:', responseText); // Для отладки
      
      return responseText;
    } catch (error) {
      console.error('Ошибка отправки симптомов:', error);
      throw error;
    }
  }
}

export default new ApiService(); 