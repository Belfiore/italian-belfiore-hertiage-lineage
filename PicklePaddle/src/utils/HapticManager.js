/**
 * HapticManager
 * Handles haptic feedback for different shot types
 */

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { HAPTIC_PATTERNS, SHOT_TYPES } from '../constants/SwingConfig';

// Haptic feedback options
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

class HapticManager {
  constructor() {
    this.isEnabled = true;
  }

  /**
   * Trigger haptic feedback for a specific shot type
   * @param {string} shotType - The type of shot (from SHOT_TYPES)
   */
  triggerFeedback(shotType) {
    if (!this.isEnabled) {
      return;
    }

    const pattern = HAPTIC_PATTERNS[shotType];

    if (!pattern) {
      console.warn(`No haptic pattern defined for shot type: ${shotType}`);
      return;
    }

    try {
      ReactNativeHapticFeedback.trigger(pattern, hapticOptions);
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }

  /**
   * Trigger a custom haptic pattern
   * @param {string} pattern - The haptic pattern type
   */
  trigger(pattern) {
    if (!this.isEnabled) {
      return;
    }

    try {
      ReactNativeHapticFeedback.trigger(pattern, hapticOptions);
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }

  /**
   * Enable or disable haptic feedback
   * @param {boolean} enabled - Whether haptics should be enabled
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  /**
   * Available haptic patterns for iOS:
   * - 'selection' - Light tap
   * - 'impactLight' - Light impact
   * - 'impactMedium' - Medium impact
   * - 'impactHeavy' - Heavy impact
   * - 'notificationSuccess' - Success notification
   * - 'notificationWarning' - Warning notification
   * - 'notificationError' - Error notification
   */
}

// Export singleton instance
export default new HapticManager();
