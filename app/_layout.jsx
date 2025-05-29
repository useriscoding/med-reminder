import React from 'react';
import { Tabs } from 'expo-router';
import '../i18n';
import { LocaleProvider } from '../contexts/LocaleContext';
import { useLocale } from '../contexts/LocaleContext';

export default function Layout() {
  const { t } = useLocale();

  return (
    <LocaleProvider>
        <Tabs screenOptions={{
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#64748B'
        }}>
        
        <Tabs.Screen name="index" options={{ title: t.tabs.today }} />
        <Tabs.Screen name="statistics" options={{ title: 'statistics' }} />
        <Tabs.Screen name="sideeffects" options={{ title: 'sideeffects' }} />
        <Tabs.Screen name="(aidkit)" options={{ title: 'aidkKit', headerShown: false }} />
        <Tabs.Screen name="(profile)" options={{ title: 'profile', headerShown: false }} />
      </Tabs>
    </LocaleProvider>
  );
}