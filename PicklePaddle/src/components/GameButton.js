/**
 * GameButton Component
 * Large centered button to start/end game sessions
 */

import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/SwingConfig';

const GameButton = ({ isPlaying, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          isPlaying ? styles.buttonStop : styles.buttonStart,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}>
        <Text style={styles.buttonText}>
          {isPlaying ? '⏹ END GAME' : '▶️ START GAME'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    minWidth: 220,
    alignItems: 'center',
  },
  buttonStart: {
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  buttonStop: {
    backgroundColor: COLORS.danger,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: COLORS.overlay,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default GameButton;
