/**
 * PicklePaddle - React Native iOS Pickleball Paddle Simulator
 *
 * Transforms your iPhone into a virtual pickleball paddle using motion sensors.
 * Swing your phone to detect different shot types with realistic sounds and haptics.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';

// Components
import LoadingScreen from './src/components/LoadingScreen';
import HitCounter from './src/components/HitCounter';
import PowerMeter from './src/components/PowerMeter';
import ShotTypeIndicator from './src/components/ShotTypeIndicator';
import GameButton from './src/components/GameButton';

// Hooks
import useMotionDetection from './src/hooks/useMotionDetection';

// Utilities
import SoundManager from './src/utils/SoundManager';
import HapticManager from './src/utils/HapticManager';
import StorageManager from './src/utils/StorageManager';

// Constants
import { COLORS, SHOT_TYPES } from './src/constants/SwingConfig';

const App = () => {
  // App state
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hitCount, setHitCount] = useState(0);
  const [lastShotType, setLastShotType] = useState(null);
  const [powerLevel, setPowerLevel] = useState(0);
  const [showPowerMeter, setShowPowerMeter] = useState(false);
  const [showShotType, setShowShotType] = useState(false);

  // Refs for state that doesn't need to trigger re-renders
  const shotTypeTimeoutRef = useRef(null);
  const powerMeterTimeoutRef = useRef(null);

  /**
   * Handle swing detection callback
   */
  const handleSwingDetected = useCallback((swingData) => {
    const { shotType, powerLevel: power, acceleration } = swingData;

    // Update hit count
    setHitCount(prev => {
      const newCount = prev + 1;
      // Save to storage
      StorageManager.saveHitCount(newCount);
      return newCount;
    });

    // Update shot type display
    setLastShotType(shotType);
    setShowShotType(true);

    // Clear previous timeout
    if (shotTypeTimeoutRef.current) {
      clearTimeout(shotTypeTimeoutRef.current);
    }

    // Hide shot type after animation
    shotTypeTimeoutRef.current = setTimeout(() => {
      setShowShotType(false);
    }, 2000);

    // Update power meter
    setPowerLevel(power);
    setShowPowerMeter(true);

    // Clear previous timeout
    if (powerMeterTimeoutRef.current) {
      clearTimeout(powerMeterTimeoutRef.current);
    }

    // Hide power meter after animation
    powerMeterTimeoutRef.current = setTimeout(() => {
      setShowPowerMeter(false);
      setPowerLevel(0);
    }, 1500);

    // Play sound for shot type
    SoundManager.playSound(shotType);

    // Trigger haptic feedback
    HapticManager.triggerFeedback(shotType);

    console.log(`Shot detected: ${shotType}, Power: ${power.toFixed(2)}, Accel: ${acceleration.toFixed(1)}`);
  }, []);

  // Initialize motion detection hook
  useMotionDetection(isPlaying, handleSwingDetected);

  /**
   * Initialize app on mount
   */
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Preload sounds
        await SoundManager.preloadSounds();

        // Load saved hit count
        const savedCount = await StorageManager.loadHitCount();
        setHitCount(savedCount);

        console.log('App initialized successfully');
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      SoundManager.release();
      if (shotTypeTimeoutRef.current) {
        clearTimeout(shotTypeTimeoutRef.current);
      }
      if (powerMeterTimeoutRef.current) {
        clearTimeout(powerMeterTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Handle loading complete
   */
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  /**
   * Toggle game state
   */
  const handleToggleGame = useCallback(() => {
    setIsPlaying(prev => !prev);
    HapticManager.trigger('selection');
  }, []);

  /**
   * Reset hit counter
   */
  const handleReset = useCallback(() => {
    setHitCount(0);
    StorageManager.clearHitCount();
    HapticManager.trigger('notificationWarning');
  }, []);

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Keep screen awake during gameplay */}
      {isPlaying && <KeepAwake />}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={styles.resetButtonText}>↺ Reset</Text>
        </TouchableOpacity>

        <HitCounter count={hitCount} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Shot Type Indicator */}
        <View style={styles.shotTypeContainer}>
          <ShotTypeIndicator
            shotType={lastShotType}
            isVisible={showShotType}
          />
        </View>

        {/* Power Meter */}
        <PowerMeter
          powerLevel={powerLevel}
          isVisible={showPowerMeter}
        />

        {/* Game Status */}
        <View style={styles.statusContainer}>
          {isPlaying ? (
            <Text style={styles.statusText}>🎾 Swing your paddle!</Text>
          ) : (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>How to Play</Text>
              <Text style={styles.instructionsText}>
                1. Hold your phone like a paddle{'\n'}
                2. Press START GAME{'\n'}
                3. Swing to hit!{'\n\n'}
                Different swings = Different shots:{'\n'}
                • Gentle tap = Dink{'\n'}
                • Fast swing = Drive{'\n'}
                • Upward motion = Lob{'\n'}
                • Downward slam = Smash{'\n'}
                • Reverse swing = Backhand
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Footer with Game Button */}
      <View style={styles.footer}>
        <GameButton isPlaying={isPlaying} onPress={handleToggleGame} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  resetButton: {
    backgroundColor: COLORS.overlay,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  shotTypeContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  statusText: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: '600',
    textShadowColor: COLORS.overlay,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  instructionsContainer: {
    backgroundColor: COLORS.overlay,
    padding: 20,
    borderRadius: 15,
    maxWidth: 300,
  },
  instructionsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 16,
    color: COLORS.white,
    lineHeight: 24,
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
});

export default App;
