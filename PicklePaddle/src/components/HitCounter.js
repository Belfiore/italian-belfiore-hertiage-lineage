/**
 * HitCounter Component
 * Displays the current hit count with pulse animation on each hit
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, ANIMATION } from '../constants/SwingConfig';

const HitCounter = ({ count }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const lastCount = useRef(count);

  useEffect(() => {
    if (count > lastCount.current) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: ANIMATION.hitPulseDuration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: ANIMATION.hitPulseDuration / 2,
          useNativeDriver: true,
        }),
      ]).start();
    }
    lastCount.current = count;
  }, [count, scaleAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>HITS</Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
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
