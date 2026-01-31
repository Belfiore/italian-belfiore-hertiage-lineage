# Sound Assets

This directory contains the audio files for different shot types in the PicklePaddle app.

## Required Sound Files

Create or obtain the following 5 sound files:

### 1. `dink.mp3`
- **Description:** Soft, gentle pop (like dropping ping pong ball)
- **Character:** Light, airy, subtle
- **Duration:** 50-100ms
- **Volume:** Low-medium

### 2. `drive.mp3`
- **Description:** Sharp, quick crack (like hitting wood)
- **Character:** Crisp, punchy, authoritative
- **Duration:** 75-125ms
- **Volume:** Medium-high

### 3. `lob.mp3`
- **Description:** Medium thwack (hollow sound)
- **Character:** Hollow, ascending quality
- **Duration:** 100-150ms
- **Volume:** Medium

### 4. `smash.mp3`
- **Description:** Loud bang (powerful hit)
- **Character:** Deep, impactful, resonant
- **Duration:** 100-150ms
- **Volume:** High

### 5. `backhand.mp3`
- **Description:** Distinct pock (different tone)
- **Character:** Slightly different pitch/timbre than drive
- **Duration:** 75-125ms
- **Volume:** Medium

## Audio Specifications

All files should meet these requirements:
- **Format:** MP3
- **Sample Rate:** 44.1kHz
- **Bit Rate:** 128-192 kbps (balance quality/size)
- **Channels:** Mono (stereo unnecessary for short SFX)
- **File Size:** < 50KB each
- **Duration:** 50-150ms

## Sources for Sound Effects

You can obtain suitable sounds from:
1. **Freesound.org** - Free creative commons sounds
2. **ZapSplat.com** - Free with attribution
3. **Record your own** - Best for authentic paddle sounds
4. **Generate with audio software** - Audacity, GarageBand

## iOS Integration

These files must be added to the Xcode project:
1. Drag files into Xcode project
2. Ensure "Copy items if needed" is checked
3. Add to PicklePaddle target
4. Files should appear in "Copy Bundle Resources" build phase

## Testing

Test each sound for:
- Instant playback (no latency)
- Clear, recognizable difference between shot types
- Appropriate volume levels
- No clipping or distortion
