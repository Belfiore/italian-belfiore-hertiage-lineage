/**
 * ShotTypeIndicator Component
 * Displays the last detected shot type with fade animation
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { COLORS, ANIMATION, SHOT_THRESHOLDS, SHOT_TYPES } from '../constants/SwingConfig';

// Get display info for each shot type
const getShotInfo = (shotType) => {
  switch (shotType) {
    case SHOT_TYPES.DINK:
      return { emoji: '🎯', text: 'DINK!', color: '#81C784' };
    case SHOT_TYPES.DRIVE:
      return { emoji: '💨', text: 'DRIVE!', color: '#64B5F6' };
    case SHOT_TYPES.LOB:
      return { emoji: '🌈', text: 'LOB!', color: '#FFD54F' };
    case SHOT_TYPES.SMASH:
      return { emoji: '💥', text: 'SMASH!', color: '#EF5350' };
    case SHOT_TYPES.BACKHAND:
      return { emoji: '↩️', text: 'BACKHAND!', color: '#BA68C8' };
    default:
      return { emoji: '🏓', text: 'HIT!', color: COLORS.white };
  }
};

const ShotTypeIndicator = ({ shotType, isVisible }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (isVisible && shotType) {
      // Animate in
      opacity.value = withSequence(
        withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) }),
        withDelay(
          ANIMATION.shotTypeFadeDuration - 500,
          withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) })
        )
      );

      scale.value = withSequence(
        withTiming(1.2, { duration: 150, easing: Easing.out(Easing.back) }),
        withTiming(1, { duration: 100 }),
        withDelay(
          ANIMATION.shotTypeFadeDuration - 500,
          withTiming(0.8, { duration: 500 })
        )
      );

      translateY.value = withSequence(
        withTiming(0, { duration: 150, easing: Easing.out(Easing.quad) }),
        withDelay(
          ANIMATION.shotTypeFadeDuration - 500,
          withTiming(-20, { duration: 500 })
        )
      );
    }
  }, [shotType, isVisible, opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const shotInfo = getShotInfo(shotType);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.emoji}>{shotInfo.emoji}</Text>
      <Text style={[styles.text, { color: shotInfo.color }]}>
        {shotInfo.text}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 5,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: COLORS.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});

export default ShotTypeIndicator;
