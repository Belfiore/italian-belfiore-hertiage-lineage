/**
 * Swing Detection Configuration
 * These thresholds determine how different shot types are detected
 */

export const SWING_CONFIG = {
  // Minimum acceleration magnitude (m/s²) to trigger swing detection
  minAcceleration: 15,

  // Cooldown period (ms) between detected swings to prevent double-hits
  cooldownMs: 500,

  // Maximum duration (ms) of a swing motion
  swingWindowMs: 800,

  // Sensor update frequency in Hz for smooth detection
  sensorUpdateHz: 60,
};

/**
 * Shot Type Thresholds
 * Each shot type has specific acceleration and angle requirements
 */
export const SHOT_THRESHOLDS = {
  DINK: {
    minAcceleration: 10,
    maxAcceleration: 20,
    name: 'Dink',
    description: 'Soft touch shot',
  },
  DRIVE: {
    minAcceleration: 25,
    maxAcceleration: 40,
    name: 'Drive',
    description: 'Fast horizontal shot',
  },
  LOB: {
    minAcceleration: 15,
    maxAcceleration: 30,
    zAxisThreshold: 0.5, // Upward motion detected
    name: 'Lob',
    description: 'High arcing shot',
  },
  SMASH: {
    minAcceleration: 40,
    zAxisThreshold: -0.5, // Downward motion detected
    name: 'Smash',
    description: 'Powerful overhead',
  },
  BACKHAND: {
    rotationThreshold: -0.5, // Negative x-rotation
    name: 'Backhand',
    description: 'Reverse swing shot',
  },
};

/**
 * Shot Types Enum
 */
export const SHOT_TYPES = {
  DINK: 'dink',
  DRIVE: 'drive',
  LOB: 'lob',
  SMASH: 'smash',
  BACKHAND: 'backhand',
};

/**
 * Haptic Feedback Types for each shot
 */
export const HAPTIC_PATTERNS = {
  [SHOT_TYPES.DINK]: 'selection',
  [SHOT_TYPES.DRIVE]: 'impactMedium',
  [SHOT_TYPES.LOB]: 'impactLight',
  [SHOT_TYPES.SMASH]: 'impactHeavy',
  [SHOT_TYPES.BACKHAND]: 'selection',
};

/**
 * Sound file mappings
 */
export const SOUND_FILES = {
  [SHOT_TYPES.DINK]: 'dink.mp3',
  [SHOT_TYPES.DRIVE]: 'drive.mp3',
  [SHOT_TYPES.LOB]: 'lob.mp3',
  [SHOT_TYPES.SMASH]: 'smash.mp3',
  [SHOT_TYPES.BACKHAND]: 'backhand.mp3',
};

/**
 * UI Colors
 */
export const COLORS = {
  primary: '#7CB342',        // Pickleball court green
  primaryDark: '#558B2F',    // Darker green
  danger: '#E53935',         // Red for end game
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  lightGray: '#E0E0E0',
  powerLow: '#4CAF50',       // Green
  powerMedium: '#FFC107',    // Yellow
  powerHigh: '#F44336',      // Red
  overlay: 'rgba(0, 0, 0, 0.3)',
};

/**
 * AsyncStorage Keys
 */
export const STORAGE_KEYS = {
  HIT_COUNT: '@PicklePaddle:hitCount',
  HIGH_SCORE: '@PicklePaddle:highScore',
};

/**
 * Animation durations (ms)
 */
export const ANIMATION = {
  hitPulseDuration: 200,
  powerBarFadeDuration: 1500,
  shotTypeFadeDuration: 2000,
  loadingDuration: 2000,
};
