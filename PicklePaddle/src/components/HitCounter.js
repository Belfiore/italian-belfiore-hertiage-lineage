/**
 * HitCounter Component
 * Displays the current hit count with pulse animation on each hit
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, ANIMATION } from '../constants/SwingConfig';

const HitCounter = ({ count, shouldPulse }) => {
  const scale = useSharedValue(1);
  const lastCount = React.useRef(count);

  useEffect(() => {
    // Only animate when count increases
    if (count > lastCount.current) {
      scale.value = withSequence(
        withTiming(1.3, {
          duration: ANIMATION.hitPulseDuration / 2,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(1, {
          duration: ANIMATION.hitPulseDuration / 2,
          easing: Easing.in(Easing.quad),
        })
      );
    }
    lastCount.current = count;
  }, [count, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>HITS</Text>
      <Animated.View style={animatedStyle}>
        <Text style={styles.count}>{count}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.overlay,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    minWidth: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 2,
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: COLORS.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default HitCounter;
