import { Stack, Tabs } from 'expo-router';
import { LocaleProvider } from '@contexts/LocaleContext';
import { useLocale } from '@contexts/LocaleContext';
import { MedicinesProvider } from '@contexts/MedicinesContext';

export default function Layout() {

  return (

    <Stack>
         <Stack.Screen name="index" options={{ headerShown: true }} />
         <Stack.Screen name="add" options={{ headerShown: false }} />
         {/* Если есть edit, тоже можно скрыть: */}
         {/* <Stack.Screen name="edit" options={{ headerShown: false }} /> */}
         {/* Остальные экраны по необходимости */}
       </Stack>
  );
}