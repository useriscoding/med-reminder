import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const IP = '178.71.129.113'; // Задай свой ip

export default function RegisterScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!password || !confirmPassword || !email) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }
    setLoading(true);
    try {
      // Регистрация
      const res = await fetch(`http://${IP}:8080/epill/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password, confirmPassword, email })
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Ошибка', data.message || 'Ошибка регистрации');
        setLoading(false);
        return;
      }
      // Получение токена
      const authRes = await fetch(`http://${IP}:8080/epill/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      const authData = await authRes.json();
      if (!authRes.ok) {
        Alert.alert('Ошибка', authData.message || 'Ошибка авторизации');
        setLoading(false);
        return;
      }
      await AsyncStorage.setItem('token', authData.token);
      await AsyncStorage.setItem('ip', IP);
      setLoading(false);
      router.replace('/');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось выполнить регистрацию');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Пароль" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Подтвердите пароль" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      {loading ? <ActivityIndicator size="large" color="#007AFF" /> : <Button title="Зарегистрироваться" onPress={handleRegister} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
}); 