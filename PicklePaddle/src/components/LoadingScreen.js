/**
 * LoadingScreen Component
 * Displays an animated loading screen when the app starts
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS, ANIMATION } from '../constants/SwingConfig';

const LoadingScreen = ({ onLoadingComplete }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -30,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      onLoadingComplete();
    }, ANIMATION.loadingDuration);

    return () => clearTimeout(timer);
  }, [onLoadingComplete, bounceAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.ball,
          {
            transform: [
              { translateY: bounceAnim },
              { scale: scaleAnim },
            ],
          },
        ]}>
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
