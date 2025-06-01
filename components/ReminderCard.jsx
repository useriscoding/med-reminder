import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ReminderCard = ({ name, dose, time, status, onToggleStatus }) => {
  const backgroundColor = {
    done: '#F2F2F2',
    missed: '#FFE5E5',
    upcoming: '#FFFFFF',
  }[status];

  const circleStyle = {
    done: {
      borderColor: '#A0A0A0',
      backgroundColor: '#A0A0A0',
    },
    missed: {
      borderColor: '#FF5C5C',
      backgroundColor: '#FF5C5C',
    },
    upcoming: {
      borderColor: '#7E57C2',
      backgroundColor: '#FFFFFF',
    },
  }[status];

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.dose}>{dose}</Text>
      </View>

      <View style={styles.rightContainer}>
        <Text style={[styles.time, { color: circleStyle.borderColor }]}>{time}</Text>
        <TouchableOpacity
          style={[styles.circle, circleStyle]}
          onPress={onToggleStatus}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  dose: {
    fontSize: 14,
    color: '#6B7280',
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 48,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1F2937',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
});

export default ReminderCard;