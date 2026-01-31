/**
 * LoadingScreen Component
 * Displays an animated loading screen when the app starts
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, ANIMATION } from '../constants/SwingConfig';

const LoadingScreen = ({ onLoadingComplete }) => {
  // Animation values
  const bounceY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Start bouncing animation
    bounceY.value = withRepeat(
      withSequence(
        withTiming(-30, { duration: 400, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 400, easing: Easing.in(Easing.quad) })
      ),
      -1, // Infinite repeat
      false
    );

    // Pulse scale animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 400 }),
        withTiming(1, { duration: 400 })
      ),
      -1,
      false
    );

    // Complete loading after specified duration
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, ANIMATION.loadingDuration);

    return () => clearTimeout(timer);
  }, [onLoadingComplete, bounceY, scale]);

  // Animated styles
  const ballAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounceY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.ball, ballAnimatedStyle]}>
        🏓
      </Animated.Text>
      <Text style={styles.title}>PicklePaddle</Text>
      <Text style={styles.subtitle}>Getting Ready to Play...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ball: {
    fontSize: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: COLORS.overlay,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.white,
    opacity: 0.9,
  },
});

export default LoadingScreen;
