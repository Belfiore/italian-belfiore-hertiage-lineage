/**
 * GameButton Component
 * Large centered button to start/end game sessions
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { COLORS } from '../constants/SwingConfig';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const GameButton = ({ isPlaying, onPress }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      style={[
        styles.button,
        isPlaying ? styles.buttonStop : styles.buttonStart,
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Text style={styles.buttonText}>
        {isPlaying ? '⏹ END GAME' : '▶️ START GAME'}
      </Text>
    </AnimatedTouchable>
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
