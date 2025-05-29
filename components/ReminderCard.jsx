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
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dose: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 40,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
});

export default ReminderCard;