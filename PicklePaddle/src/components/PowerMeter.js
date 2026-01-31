/**
 * PowerMeter Component
 * Displays a visual power bar that shows swing intensity
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { COLORS, ANIMATION } from '../constants/SwingConfig';

const PowerMeter = ({ powerLevel, isVisible }) => {
  const width = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible && powerLevel > 0) {
      // Animate the power bar filling up
      width.value = withSequence(
        withTiming(powerLevel * 100, {
          duration: 100,
          easing: Easing.out(Easing.quad),
        }),
        // Hold for a moment
        withTiming(powerLevel * 100, { duration: 500 }),
        // Fade out
        withTiming(0, {
          duration: ANIMATION.powerBarFadeDuration / 2,
          easing: Easing.in(Easing.quad),
        })
      );

      // Animate opacity
      opacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: ANIMATION.powerBarFadeDuration / 2 })
      );
    }
  }, [powerLevel, isVisible, width, opacity]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const barAnimatedStyle = useAnimatedStyle(() => {
    // Determine color based on power level
    const percentage = width.value / 100;
    let backgroundColor;

    if (percentage < 0.33) {
      backgroundColor = COLORS.powerLow;
    } else if (percentage < 0.66) {
      backgroundColor = COLORS.powerMedium;
    } else {
      backgroundColor = COLORS.powerHigh;
    }

    return {
      width: `${width.value}%`,
      backgroundColor,
    };
  });

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, barAnimatedStyle]} />
      </View>
      <View style={styles.markers}>
        <View style={styles.marker} />
        <View style={styles.marker} />
        <View style={styles.marker} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  track: {
    height: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  bar: {
    height: '100%',
    borderRadius: 8,
  },
  markers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 4,
  },
  marker: {
    width: 2,
    height: 8,
    backgroundColor: COLORS.white,
    opacity: 0.5,
  },
});

export default PowerMeter;
