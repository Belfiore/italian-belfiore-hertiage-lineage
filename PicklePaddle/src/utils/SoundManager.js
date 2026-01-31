/**
 * SoundManager
 * Handles preloading and playing sound effects for each shot type
 */

import Sound from 'react-native-sound';
import { SHOT_TYPES, SOUND_FILES } from '../constants/SwingConfig';

// Enable playback in silence mode (iOS)
Sound.setCategory('Playback');

class SoundManager {
  constructor() {
    this.sounds = {};
    this.isLoaded = false;
  }

  /**
   * Preload all sound files at app startup
   * @returns {Promise} Resolves when all sounds are loaded
   */
  async preloadSounds() {
    const loadPromises = Object.entries(SOUND_FILES).map(
      ([shotType, fileName]) => {
        return new Promise((resolve, reject) => {
          const sound = new Sound(
            fileName,
            Sound.MAIN_BUNDLE,
            error => {
              if (error) {
                console.error(`Failed to load sound ${fileName}:`, error);
                // Resolve anyway to not block app startup
                resolve(null);
              } else {
                // Pre-set volume for instant playback
                sound.setVolume(1.0);
                this.sounds[shotType] = sound;
                resolve(sound);
              }
            }
          );
        });
      }
    );

    try {
      await Promise.all(loadPromises);
      this.isLoaded = true;
      console.log('All sounds preloaded successfully');
    } catch (error) {
      console.error('Error preloading sounds:', error);
    }
  }

  /**
   * Play the sound for a specific shot type
   * @param {string} shotType - The type of shot (from SHOT_TYPES)
   */
  playSound(shotType) {
    const sound = this.sounds[shotType];

    if (!sound) {
      console.warn(`Sound not loaded for shot type: ${shotType}`);
      return;
    }

    // Reset to beginning and play
    sound.stop(() => {
      sound.setCurrentTime(0);
      sound.play(success => {
        if (!success) {
          console.warn(`Sound playback failed for: ${shotType}`);
        }
      });
    });
  }

  /**
   * Set volume for all sounds
   * @param {number} volume - Volume level (0-1)
   */
  setVolume(volume) {
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        sound.setVolume(volume);
      }
    });
  }

  /**
   * Release all sound resources
   */
  release() {
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        sound.release();
      }
    });
    this.sounds = {};
    this.isLoaded = false;
  }
}

// Export singleton instance
export default new SoundManager();
