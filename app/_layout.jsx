import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot } from 'expo-router';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      setHasToken(!!token);
      setLoading(false);
    })();
  }, []);

  if (loading) return null;

  // Если токена нет — показываем только регистрацию
  if (!hasToken) {
    const RegisterScreen = require('./(auth)/register.jsx').default;
    return <RegisterScreen />;
  }

  // Если токен есть — показываем все табы приложения
  return <Slot />;
} 