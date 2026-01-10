import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocale } from '@contexts/LocaleContext';
import HistoryTab from '../components/statistics/HistoryTab';
import ChartsTab from '../components/statistics/ChartsTab';

const Statistics = () => {
  const [activeTab, setActiveTab] = useState('history');
  const { t } = useLocale();

  const tabs = [
    { id: 'history', label: 'История', icon: 'time-outline' },
    { id: 'charts', label: 'Графики', icon: 'bar-chart-outline' }
  ];

  return (
    <View style={styles.container}>
      {/* Навигация по вкладкам */}
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons 
              name={tab.icon} 
              size={20} 
              color={activeTab === tab.id ? '#fff' : '#3B82F6'} 
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Контент вкладок */}
      <View style={styles.content}>
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'charts' && <ChartsTab />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
});

export default Statistics;