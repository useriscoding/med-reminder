import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocale } from '@contexts/LocaleContext';

const About = () => {
  const { t } = useLocale();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.profile.about}</Text>
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