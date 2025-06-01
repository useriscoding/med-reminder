import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import React, { useState } from 'react';
import { useLocale } from '@contexts/LocaleContext';

const Settings = () => {
  const { t, locale, setLocale } = useLocale();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.settings.title}</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => setLanguageModalVisible(true)}
        >
          <Text style={styles.settingText}>{t.settings.language}</Text>
          <Text style={styles.settingValue}>
            {locale === 'ru' ? 'Русский' : 'English'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={languageModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.settings.language}</Text>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={styles.languageOption}
                onPress={() => {
                  setLocale(lang.code);
                  setLanguageModalVisible(false);
                }}
              >
                <Text style={styles.languageText}>{lang.name}</Text>
                {locale === lang.code && (
                  <Text style={styles.selectedIcon}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.cancelText}>{t.common.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingText: {
    fontSize: 16,
    color: '#0f172a',
  },
  settingValue: {
    fontSize: 14,
    color: '#64748B',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  languageText: {
    fontSize: 16,
  },
  selectedIcon: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Settings;