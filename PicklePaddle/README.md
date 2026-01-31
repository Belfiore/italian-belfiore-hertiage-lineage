# PicklePaddle 🏓

A React Native iOS application that transforms your iPhone into a virtual pickleball paddle using motion sensors. Swing your phone to play different shots with realistic sounds and haptic feedback!

## Features

- **Real-time Motion Detection:** Uses accelerometer and gyroscope at 60Hz for responsive swing detection
- **5 Distinct Shot Types:**
  - 🎯 **Dink** - Soft touch shots with gentle motion
  - 💨 **Drive** - Fast horizontal power shots
  - 🌈 **Lob** - High arcing upward swings
  - 💥 **Smash** - Powerful overhead slams
  - ↩️ **Backhand** - Reverse swing detection
- **Haptic Feedback:** Different vibration patterns for each shot type
- **Sound Effects:** Unique audio for every shot
- **Hit Counter:** Tracks your total hits with persistence
- **Power Meter:** Visual feedback showing swing intensity
- **Polished Animations:** Smooth UI transitions using Reanimated

## Requirements

- iOS 13.0+
- iPhone with motion sensors (accelerometer + gyroscope)
- Node.js 16+
- Xcode 14+
- CocoaPods

## Installation

1. **Clone the repository:**
   ```bash
   cd PicklePaddle
   ```

2. **Install JavaScript dependencies:**
   ```bash
   npm install
   ```

3. **Install iOS dependencies:**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Add sound assets:**
   - Add the 5 MP3 sound files to `assets/sounds/`
   - See `assets/sounds/README.md` for specifications

5. **Run on iOS:**
   ```bash
   npm run ios
   ```

## Project Structure

```
PicklePaddle/
├── App.js                          # Main application component
├── index.js                        # App entry point
├── package.json                    # Dependencies
├── src/
│   ├── components/
│   │   ├── LoadingScreen.js        # Animated splash screen
│   │   ├── HitCounter.js           # Animated hit count display
│   │   ├── PowerMeter.js           # Swing power visualization
│   │   ├── ShotTypeIndicator.js    # Shot type feedback
│   │   └── GameButton.js           # Start/Stop game button
│   ├── hooks/
│   │   └── useMotionDetection.js   # Motion sensor hook
│   ├── utils/
│   │   ├── SoundManager.js         # Audio playback manager
│   │   ├── HapticManager.js        # Haptic feedback manager
│   │   └── StorageManager.js       # AsyncStorage wrapper
│   └── constants/
│       └── SwingConfig.js          # Thresholds and settings
├── assets/
│   └── sounds/                     # Audio files (5 MP3s)
└── ios/
    ├── Podfile                     # iOS dependencies
    └── PicklePaddle/
        ├── Info.plist              # iOS app configuration
        └── LaunchScreen.storyboard # Launch screen
```

## Motion Detection Algorithm

The swing detection uses a state machine approach:

1. **Idle State:** Monitor acceleration magnitude
2. **Swing Start:** Triggered when magnitude exceeds threshold (15 m/s²)
3. **Swing Tracking:** Collect peak acceleration and motion vectors
4. **Swing End:** Detect when motion subsides or timeout (800ms)
5. **Shot Classification:** Analyze acceleration + angle for shot type
6. **Cooldown:** Prevent double-detection (500ms)

### Shot Classification Logic

| Shot Type | Acceleration | Motion Angle | Rotation |
|-----------|--------------|--------------|----------|
| Dink | 10-20 m/s² | Any | - |
| Drive | 25-40 m/s² | Horizontal | - |
| Lob | 15-30 m/s² | Upward (Z+) | - |
| Smash | 40+ m/s² | Downward (Z-) | - |
| Backhand | Any | Any | Negative X |

## Configuration

Adjust detection sensitivity in `src/constants/SwingConfig.js`:

```javascript
const SWING_CONFIG = {
  minAcceleration: 15,    // Threshold to trigger swing
  cooldownMs: 500,        // Time between valid swings
  swingWindowMs: 800,     // Max swing duration
  sensorUpdateHz: 60,     // Sensor sample rate
};
```

## Dependencies

| Package | Purpose |
|---------|---------|
| react-native-sensors | Accelerometer/Gyroscope access |
| react-native-sound | Audio playback |
| react-native-haptic-feedback | iOS haptic patterns |
| react-native-reanimated | Smooth animations |
| @react-native-async-storage/async-storage | Persistent storage |
| react-native-keep-awake | Prevent screen sleep |

## Troubleshooting

### Motion sensors not working
- Ensure `NSMotionUsageDescription` is in Info.plist
- Test on a real device (simulators don't have sensors)

### No sound
- Check that MP3 files are in `assets/sounds/`
- Verify files are added to Xcode "Copy Bundle Resources"
- Ensure device is not in silent mode

### High battery usage
- Motion sensors at 60Hz can drain battery
- Consider reducing `sensorUpdateHz` for longer sessions

## License

MIT License - See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Made with ❤️ for pickleball enthusiasts everywhere!
