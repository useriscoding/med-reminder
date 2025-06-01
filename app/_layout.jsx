import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import '../i18n';
import { LocaleProvider } from '../contexts/LocaleContext';
import { useLocale } from '../contexts/LocaleContext';
import { MedicinesProvider } from '../contexts/MedicinesContext';

export default function Layout() {
  const { t } = useLocale();

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