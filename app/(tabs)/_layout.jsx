import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import '../../i18n';
import { LocaleProvider } from '../../contexts/LocaleContext';
import { useLocale } from '../../contexts/LocaleContext';
import { MedicinesProvider } from '../../contexts/MedicinesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Layout() {
  const { t } = useLocale();
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      console.log('TOKEN:', token);
      setHasToken(!!token);
      setLoading(false);
    })();
  }, []);

  if (loading) return null;
  if (!hasToken) {
    const RegisterScreen = require('../(auth)/register.jsx').default;
    return <RegisterScreen />;
  }

  return (
    <LocaleProvider>
      <MedicinesProvider>
        <Tabs screenOptions={{
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#64748B'
        }}>
        
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: t.tabs.today,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            )
          }} 
        />
        <Tabs.Screen 
          name="statistics" 
          options={{ 
            title: 'Stats',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            )
          }} 
        />
        <Tabs.Screen 
          name="sideeffects" 
          options={{ 
            title: 'Side Effects',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="warning" size={size} color={color} />
            )
          }} 
        />
        <Tabs.Screen 
          name="(aidkit)" 
          options={{ 
            title: 'AidKit', 
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="medkit" size={size} color={color} />
            )
          }} 
        />
        <Tabs.Screen 
          name="(profile)" 
          options={{ 
            title: 'Profile', 
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            )
          }} 
        />
      </Tabs>
      </MedicinesProvider>
    </LocaleProvider>
  );
}