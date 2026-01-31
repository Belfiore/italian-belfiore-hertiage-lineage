/**
 * StorageManager
 * Handles persistent storage for game data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/SwingConfig';

class StorageManager {
  /**
   * Save the current hit count
   * @param {number} count - The hit count to save
   */
  async saveHitCount(count) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HIT_COUNT, count.toString());
    } catch (error) {
      console.error('Error saving hit count:', error);
    }
  }

  /**
   * Load the saved hit count
   * @returns {Promise<number>} The saved hit count, or 0 if not found
   */
  async loadHitCount() {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.HIT_COUNT);
      return value !== null ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error('Error loading hit count:', error);
      return 0;
    }
  }

  /**
   * Save the high score
   * @param {number} score - The high score to save
   */
  async saveHighScore(score) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  }

  /**
   * Load the high score
   * @returns {Promise<number>} The saved high score, or 0 if not found
   */
  async loadHighScore() {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
      return value !== null ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error('Error loading high score:', error);
      return 0;
    }
  }

  /**
   * Reset all game data
   */
  async resetAllData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.HIT_COUNT,
        STORAGE_KEYS.HIGH_SCORE,
      ]);
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  }

  /**
   * Clear only the current session hit count
   */
  async clearHitCount() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.HIT_COUNT);
    } catch (error) {
      console.error('Error clearing hit count:', error);
    }
  }
}

// Export singleton instance
export default new StorageManager();
