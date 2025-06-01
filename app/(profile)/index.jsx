import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Link } from 'expo-router'
import { useLocale } from '../../contexts/LocaleContext';
import { useNavigation } from 'expo-router';

const Profile = () => {
  const { t } = useLocale();
  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({ title: t.tabs.profile });
  }, [navigation, t]);

  // Данные пользователя (можно заменить на реальные данные из состояния)
  const user = {
    name: "Иван Иванов",
    age: 32,
    weight: 75,
    email: "ivanov@example.com",
    photo: "https://randomuser.me/api/portraits/men/1.jpg"
  };

  return (
    <View style={styles.container}>
      {/* Информация о пользователе */}
      <View style={styles.userInfo}>
        <Image 
          source={{ uri: user.photo }} 
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user.name}</Text>
        <View style={styles.userDetails}>
          <Text style={styles.detailText}>{t.profile.age}: {user.age}</Text>
          <Text style={styles.detailText}>{t.profile.weight}: {user.weight} кг</Text>
          <Text style={styles.detailText}>{t.profile.email}: {user.email}</Text>
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
      </View>
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
})
