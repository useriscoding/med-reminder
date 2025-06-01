import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import StatusChangeModal from './StatusChangeModal';

const ReminderCard = ({ name, dose, time, status, onToggleStatus }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleStatusPress = () => {
    setModalVisible(true);
  };

  const handleConfirm = (newStatus) => {
    // Анимация при изменении статуса
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    onToggleStatus(newStatus);
  };

  const backgroundColor = {
    done: '#ECFDF5',
    missed: '#FEF2F2',
    upcoming: '#FFFFFF',
  }[status];

  const circleStyle = {
    done: {
      borderColor: '#059669',
      backgroundColor: '#059669',
    },
    missed: {
      borderColor: '#DC2626',
      backgroundColor: '#DC2626',
    },
    upcoming: {
      borderColor: '#7E57C2',
      backgroundColor: '#FFFFFF',
    },
  }[status];

  return (
    <>
      <Animated.View style={[styles.card, { backgroundColor, opacity: fadeAnim }]}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.dose}>{dose}</Text>
        </View>

        <View style={styles.rightContainer}>
          <Text style={[styles.time, { color: circleStyle.borderColor }]}>{time}</Text>
          <TouchableOpacity
            style={[styles.circle, circleStyle]}
            onPress={handleStatusPress}
          />
        </View>
      </Animated.View>

      <StatusChangeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
        currentStatus={status}
        medicineName={name}
      />
    </>
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