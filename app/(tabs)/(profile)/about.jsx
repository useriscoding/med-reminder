import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useLocale } from '@contexts/LocaleContext';
import { useNavigation } from 'expo-router';

const About = () => {
  const { t } = useLocale();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: 'About us' });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {t.about.text}
      </Text>
      <View style={styles.versionContainer}>
        <Text style={styles.version}>{t.about.version}</Text>
      </View>
    </View>
  )
}

export default About

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  },
  versionContainer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 20,
  },
  version: {
    fontSize: 14,
    color: '#64748b',
  }
})