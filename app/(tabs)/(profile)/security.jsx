import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Security = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: 'Безопасность' });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Ionicons name="shield-checkmark" size={48} color="#10B981" />
          <Text style={styles.title}>Политика конфиденциальности</Text>
        </View>

        {/* Какие данные собираются */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Какие данные мы собираем</Text>
          </View>
          <Text style={styles.text}>
            Для работы приложения мы собираем следующую информацию:
          </Text>
          <View style={styles.dataList}>
            <View style={styles.dataItem}>
              <Ionicons name="mail" size={16} color="#6B7280" />
              <Text style={styles.dataText}>Email адрес для создания аккаунта</Text>
            </View>
            <View style={styles.dataItem}>
              <Ionicons name="lock-closed" size={16} color="#6B7280" />
              <Text style={styles.dataText}>Пароль для безопасного входа</Text>
            </View>
            <View style={styles.dataItem}>
              <Ionicons name="person" size={16} color="#6B7280" />
              <Text style={styles.dataText}>Биометрические данные: рост, вес, возраст, пол</Text>
            </View>
            <View style={styles.dataItem}>
              <Ionicons name="medical" size={16} color="#6B7280" />
              <Text style={styles.dataText}>Информация о принимаемых лекарствах</Text>
            </View>
          </View>
        </View>

        {/* Как используются данные */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cog" size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Как мы используем ваши данные</Text>
          </View>
          
          <View style={styles.usageItem}>
            <Text style={styles.usageTitle}>🔐 Авторизация и безопасность</Text>
            <Text style={styles.usageText}>
              Пароль сохраняется локально для автоматического доступа к ресурсам сервера 
              и обновления токенов безопасности.
            </Text>
          </View>

          <View style={styles.usageItem}>
            <Text style={styles.usageTitle}>🧬 Улучшение модели ИИ</Text>
            <Text style={styles.usageText}>
              Биометрические данные (рост, вес, возраст, пол) используются для улучшения 
              модели машинного обучения, которая рассчитывает вероятность побочных эффектов 
              лекарств с учетом ваших индивидуальных особенностей.
            </Text>
          </View>

          <View style={styles.usageItem}>
            <Text style={styles.usageTitle}>📊 Персонализация</Text>
            <Text style={styles.usageText}>
              Информация о лекарствах помогает создавать персональные напоминания и 
              отслеживать статистику приема препаратов.
            </Text>
          </View>
        </View>

        {/* Безопасность данных */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield" size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Защита ваших данных</Text>
          </View>
          <Text style={styles.text}>
            Мы серьезно относимся к защите вашей конфиденциальной информации:
          </Text>
          <View style={styles.securityList}>
            <Text style={styles.securityItem}>
              • Все данные передаются через защищенное HTTPS соединение
            </Text>
            <Text style={styles.securityItem}>
              • Пароли хранятся в зашифрованном виде
            </Text>
            <Text style={styles.securityItem}>
              • Персональные данные не передаются третьим лицам
            </Text>
          </View>
        </View>

        {/* Контроль данных */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings" size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Ваш контроль над данными</Text>
          </View>
          <Text style={styles.text}>
            Вы имеете полный контроль над своими данными и можете в любое время:
          </Text>
          <View style={styles.controlList}>
            <Text style={styles.controlItem}>
              ✓ Просматривать все сохраненные данные в профиле
            </Text>
            <Text style={styles.controlItem}>
              ✓ Изменять или обновлять личную информацию
            </Text>
            <Text style={styles.controlItem}>
              ✓ Удалить аккаунт и все связанные данные
            </Text>
          </View>
        </View>

        {/* Контактная информация */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="help-circle" size={20} color="#EF4444" />
            <Text style={styles.sectionTitle}>Вопросы и поддержка</Text>
          </View>
          <Text style={styles.text}>
            Если у вас есть вопросы о нашей политике конфиденциальности или 
            использовании данных, вы можете связаться с нами через раздел "О нас".
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default Security

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  lastSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4B5563',
    marginBottom: 12,
  },
  dataList: {
    marginTop: 8,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  dataText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  usageItem: {
    marginBottom: 16,
    paddingLeft: 8,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  usageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  securityList: {
    marginTop: 8,
  },
  securityItem: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    marginBottom: 6,
  },
  controlList: {
    marginTop: 8,
  },
  controlItem: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    marginBottom: 6,
  },
})