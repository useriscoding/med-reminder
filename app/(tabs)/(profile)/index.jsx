import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { useLocale } from '@contexts/LocaleContext';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const { t } = useLocale();
  const navigation = useNavigation();
  const router = useRouter();
  const [user, setUser] = useState({
    name: '',
    email: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
  });
  const [editVisible, setEditVisible] = useState(false);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [photo, setPhoto] = useState('https://randomuser.me/api/portraits/men/1.jpg');

  useEffect(() => {
    navigation.setOptions({ title: t.tabs.profile });
    (async () => {
      const profile = await AsyncStorage.getItem('userProfile');
      if (profile) {
        const data = JSON.parse(profile);
        setUser(prev => ({ ...prev, ...data }));
        setGender(data.gender !== undefined ? String(data.gender) : '');
        setAge(data.age || '');
        setHeight(data.height || '');
        setWeight(data.weight || '');
        setPhoto(data.photo || 'https://randomuser.me/api/portraits/men/1.jpg');
      } else {
        setPhoto('https://randomuser.me/api/portraits/men/1.jpg');
      }
    })();
  }, [navigation, t]);

  return (
    <View style={styles.container}>
      {/* Информация о пользователе */}
      <View style={styles.userInfo}>
        <Image 
          source={{ uri: photo }} 
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user.name}</Text>
        <View style={styles.userDetails}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
            onPress={() => setEditVisible(true)}
          >
            <Ionicons name="create-outline" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <Text style={styles.detailText}>{t.profile.email}: {user.email}</Text>
          <Text style={styles.detailText}>{t.profile.age}: {user.age}</Text>
          <Text style={styles.detailText}>Рост: {user.height} см</Text>
          <Text style={styles.detailText}>{t.profile.weight}: {user.weight} кг</Text>
        </View>
      </View>

      {/* Разделитель */}
      <View style={styles.divider} />

      {/* Навигационные ссылки */}
      <View style={styles.linksContainer}>
        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>{t.tabs.settings}</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/security" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>{t.tabs.security}</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/about" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>{t.profile.about}</Text>
          </TouchableOpacity>
        </Link>

        {/* Временная кнопка для очистки данных */}
        <TouchableOpacity 
          style={[styles.linkButton, { backgroundColor: '#EF4444' }]}
          onPress={async () => {
            try {
              await AsyncStorage.multiRemove(['token', 'password', 'userProfile', 'ip']);
              alert('Данные очищены. Приложение перезагрузится.');
              // Перезагружаем приложение
              window.location.reload();
            } catch (error) {
              alert('Ошибка при очистке данных');
            }
          }}
        >
          <Text style={styles.linkText}>Очистить данные (DEBUG)</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={editVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.centeredView}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ width: '100%', alignItems: 'center' }}
            >
              <View style={styles.modalView}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setEditVisible(false)}>
                  <Ionicons name="close" size={28} color="#6B7280" />
                </TouchableOpacity>
                <Text style={styles.title}>Редактировать профиль</Text>
                <View style={styles.genderRow}>
                  {[
                    { label: 'Мужской', value: 0 },
                    { label: 'Женский', value: 1 },
                  ].map(option => (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.genderButton, gender === String(option.value) && styles.genderButtonActive]}
                      onPress={() => setGender(String(option.value))}
                    >
                      <Text style={[styles.genderButtonText, gender === String(option.value) && styles.genderButtonTextActive]}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.fieldBlock}>
                  <Text style={styles.label}>Возраст</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Введите возраст"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
                <View style={styles.fieldBlock}>
                  <Text style={styles.label}>Рост (см)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Введите рост"
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
                <View style={styles.fieldBlock}>
                  <Text style={styles.label}>Вес (кг)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Введите вес"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
                <TouchableOpacity style={styles.photoEditButton} onPress={async () => {
                  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                  if (!permissionResult.granted) {
                    alert('Для выбора фото нужно разрешение на доступ к галерее');
                    return;
                  }
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.7,
                  });
                  if (!result.canceled && result.assets && result.assets.length > 0) {
                    setPhoto(result.assets[0].uri);
                  }
                }}>
                  <Ionicons name="camera" size={20} color="#3B82F6" />
                  <Text style={styles.photoEditText}>Изменить фото</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={async () => {
                  if (!gender || !age || !height || !weight) {
                    alert('Пожалуйста, заполните все поля');
                    return;
                  }
                  const profile = await AsyncStorage.getItem('userProfile');
                  let email = '';
                  if (profile) {
                    const data = JSON.parse(profile);
                    email = data.email || '';
                  }
                  await AsyncStorage.setItem('userProfile', JSON.stringify({ email, gender: gender === '' ? '' : Number(gender), age, height, weight, photo }));
                  setUser(prev => ({ ...prev, gender, age, height, weight, photo }));
                  setEditVisible(false);
                }}>
                  <Ionicons name="checkmark-circle" size={22} color="#fff" />
                  <Text style={styles.saveButtonText}>Сохранить</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    color: '#0f172a',
  },
  userDetails: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#334155',
  },
  divider: {
    height: 1,
    backgroundColor: '#000000',
    opacity: 0.25,
    marginVertical: 20,
    width: '80%',
    alignSelf: 'center',
  },
  linksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkButton: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  linkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fieldBlock: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  genderButtonText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '500',
  },
  genderButtonTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  photoEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 18,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  photoEditText: {
    color: '#3B82F6',
    fontSize: 15,
    fontWeight: '500',
  },
})
