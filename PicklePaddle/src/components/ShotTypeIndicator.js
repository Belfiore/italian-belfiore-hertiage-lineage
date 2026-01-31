/**
 * ShotTypeIndicator Component
 * Displays the last detected shot type with fade animation
 */

import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { COLORS, ANIMATION, SHOT_TYPES } from '../constants/SwingConfig';

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
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (isVisible && shotType) {
      opacityAnim.setValue(0);
      scaleAnim.setValue(0.5);
      translateYAnim.setValue(20);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.delay(ANIMATION.shotTypeFadeDuration - 500),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.delay(ANIMATION.shotTypeFadeDuration - 500),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.delay(ANIMATION.shotTypeFadeDuration - 500),
          Animated.timing(translateYAnim, {
            toValue: -20,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [shotType, isVisible, opacityAnim, scaleAnim, translateYAnim]);

  const shotInfo = getShotInfo(shotType);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
        },
      ]}>
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
