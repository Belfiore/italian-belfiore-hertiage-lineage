/**
 * useMotionDetection Hook
 * Handles accelerometer and gyroscope data for swing detection
 */

import { useEffect, useRef, useCallback } from 'react';
import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import { SWING_CONFIG, SHOT_TYPES, SHOT_THRESHOLDS } from '../constants/SwingConfig';

/**
 * Calculate the magnitude of a 3D vector
 */
const calculateMagnitude = (x, y, z) => {
  return Math.sqrt(x * x + y * y + z * z);
};

/**
 * Determine shot type based on acceleration magnitude and motion vectors
 */
const determineShotType = (accelMagnitude, accelData, gyroData) => {
  const { x: ax, y: ay, z: az } = accelData;
  const { x: gx } = gyroData;

  // Normalize the z-axis value for angle detection
  const normalizedZ = az / accelMagnitude;

  // Check for backhand first (negative x-rotation)
  if (gx < SHOT_THRESHOLDS.BACKHAND.rotationThreshold) {
    return SHOT_TYPES.BACKHAND;
  }

  // Check for smash (high acceleration with downward motion)
  if (
    accelMagnitude >= SHOT_THRESHOLDS.SMASH.minAcceleration &&
    normalizedZ < SHOT_THRESHOLDS.SMASH.zAxisThreshold
  ) {
    return SHOT_TYPES.SMASH;
  }

  // Check for lob (medium acceleration with upward motion)
  if (
    accelMagnitude >= SHOT_THRESHOLDS.LOB.minAcceleration &&
    accelMagnitude <= SHOT_THRESHOLDS.LOB.maxAcceleration &&
    normalizedZ > SHOT_THRESHOLDS.LOB.zAxisThreshold
  ) {
    return SHOT_TYPES.LOB;
  }

  // Check for drive (high horizontal acceleration)
  if (
    accelMagnitude >= SHOT_THRESHOLDS.DRIVE.minAcceleration &&
    accelMagnitude <= SHOT_THRESHOLDS.DRIVE.maxAcceleration
  ) {
    return SHOT_TYPES.DRIVE;
  }

  // Check for dink (low acceleration, gentle motion)
  if (
    accelMagnitude >= SHOT_THRESHOLDS.DINK.minAcceleration &&
    accelMagnitude <= SHOT_THRESHOLDS.DINK.maxAcceleration
  ) {
    return SHOT_TYPES.DINK;
  }

  // Default to drive for any other high acceleration
  if (accelMagnitude >= SHOT_THRESHOLDS.DRIVE.minAcceleration) {
    return SHOT_TYPES.DRIVE;
  }

  // Default to dink for lower accelerations
  return SHOT_TYPES.DINK;
};

/**
 * Custom hook for motion detection
 * @param {boolean} isActive - Whether motion detection is active
 * @param {function} onSwingDetected - Callback when a swing is detected
 */
const useMotionDetection = (isActive, onSwingDetected) => {
  // Refs to store sensor data without causing re-renders
  const accelDataRef = useRef({ x: 0, y: 0, z: 0 });
  const gyroDataRef = useRef({ x: 0, y: 0, z: 0 });
  const lastSwingTimeRef = useRef(0);
  const isInSwingRef = useRef(false);
  const swingStartTimeRef = useRef(0);
  const peakAccelerationRef = useRef(0);
  const subscriptionsRef = useRef([]);

  // Process sensor data and detect swings
  const processMotionData = useCallback(() => {
    const currentTime = Date.now();
    const accelData = accelDataRef.current;
    const gyroData = gyroDataRef.current;

    // Calculate acceleration magnitude (subtract gravity ~9.8 m/s²)
    const rawMagnitude = calculateMagnitude(accelData.x, accelData.y, accelData.z);
    const magnitude = Math.abs(rawMagnitude - 9.8);

    // Check if we're in cooldown period
    const timeSinceLastSwing = currentTime - lastSwingTimeRef.current;
    if (timeSinceLastSwing < SWING_CONFIG.cooldownMs) {
      return;
    }

    // Swing detection state machine
    if (!isInSwingRef.current) {
      // Not currently in a swing - check if one is starting
      if (magnitude >= SWING_CONFIG.minAcceleration) {
        isInSwingRef.current = true;
        swingStartTimeRef.current = currentTime;
        peakAccelerationRef.current = magnitude;
      }
    } else {
      // Currently tracking a swing
      const swingDuration = currentTime - swingStartTimeRef.current;

      // Update peak acceleration if higher
      if (magnitude > peakAccelerationRef.current) {
        peakAccelerationRef.current = magnitude;
      }

      // Check if swing has ended (acceleration dropped or max duration reached)
      const swingEnded =
        magnitude < SWING_CONFIG.minAcceleration * 0.5 ||
        swingDuration >= SWING_CONFIG.swingWindowMs;

      if (swingEnded) {
        // Determine shot type based on collected data
        const shotType = determineShotType(
          peakAccelerationRef.current,
          accelData,
          gyroData
        );

        // Calculate power level (0-1) based on acceleration
        const powerLevel = Math.min(
          1,
          (peakAccelerationRef.current - SWING_CONFIG.minAcceleration) / 35
        );

        // Trigger callback with swing data
        onSwingDetected({
          shotType,
          powerLevel,
          acceleration: peakAccelerationRef.current,
          duration: swingDuration,
        });

        // Reset swing tracking
        isInSwingRef.current = false;
        lastSwingTimeRef.current = currentTime;
        peakAccelerationRef.current = 0;
      }
    }
  }, [onSwingDetected]);

  // Set up sensor subscriptions
  useEffect(() => {
    if (!isActive) {
      // Clean up subscriptions when not active
      subscriptionsRef.current.forEach(sub => sub.unsubscribe());
      subscriptionsRef.current = [];
      return;
    }

    // Configure sensor update intervals
    const updateInterval = Math.floor(1000 / SWING_CONFIG.sensorUpdateHz);
    setUpdateIntervalForType(SensorTypes.accelerometer, updateInterval);
    setUpdateIntervalForType(SensorTypes.gyroscope, updateInterval);

    // Subscribe to accelerometer
    const accelSubscription = accelerometer.subscribe(
      ({ x, y, z }) => {
        accelDataRef.current = { x, y, z };
        processMotionData();
      },
      error => {
        console.error('Accelerometer error:', error);
      }
    );

    // Subscribe to gyroscope
    const gyroSubscription = gyroscope.subscribe(
      ({ x, y, z }) => {
        gyroDataRef.current = { x, y, z };
      },
      error => {
        console.error('Gyroscope error:', error);
      }
    );

    subscriptionsRef.current = [accelSubscription, gyroSubscription];

    // Cleanup on unmount or when isActive changes
    return () => {
      subscriptionsRef.current.forEach(sub => sub.unsubscribe());
      subscriptionsRef.current = [];
    };
  }, [isActive, processMotionData]);

  return {
    // Expose current sensor data for debugging if needed
    getAccelData: () => accelDataRef.current,
    getGyroData: () => gyroDataRef.current,
  };
};

export default useMotionDetection;
