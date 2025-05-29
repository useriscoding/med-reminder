import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { useLocale } from '../../contexts/LocaleContext';

const About = () => {
  const { t } = useLocale();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t.profile.about}</Text>
      <Text style={styles.text}>
        {t.about.text}
      </Text>
    </ScrollView>
  )
}

export default About

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#0f172a',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  },
})