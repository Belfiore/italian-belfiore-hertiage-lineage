/**
 * PowerMeter Component
 * Displays a visual power bar that shows swing intensity
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, ANIMATION } from '../constants/SwingConfig';

const PowerMeter = ({ powerLevel, isVisible }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible && powerLevel > 0) {
      widthAnim.setValue(0);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(widthAnim, {
            toValue: powerLevel * 100,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.delay(500),
          Animated.timing(widthAnim, {
            toValue: 0,
            duration: ANIMATION.powerBarFadeDuration / 2,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.delay(500),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: ANIMATION.powerBarFadeDuration / 2,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    }
  }, [powerLevel, isVisible, widthAnim, opacityAnim]);

  const barColor = widthAnim.interpolate({
    inputRange: [0, 33, 66, 100],
    outputRange: [COLORS.powerLow, COLORS.powerLow, COLORS.powerMedium, COLORS.powerHigh],
  });

  const widthPercent = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.bar,
            { width: widthPercent, backgroundColor: barColor },
          ]}
        />
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
