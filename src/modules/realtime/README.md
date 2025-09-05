# Realtime Transcription Module

## Overview

This module provides real-time speech transcription using WhisperLive backend. The interface has been completely rewritten to focus on simplicity and performance while maintaining the beautiful gradient design.

## Features

### 🎙️ Core Functionality

- **Real-time Speech Transcription**: Powered by WhisperLive with large-v3-turbo model
- **Voice Activity Detection (VAD)**: Automatically enabled for optimal performance
- **Language Support**: Auto-detection + 12 supported languages
- **Partial & Final Transcripts**: Visual distinction with animations

### 🎨 User Interface

- **Simplified Language Selection**: Single dropdown for language selection
- **Audio Monitor**: Real-time waveform visualization
- **Live Metrics Dashboard**:
  - Input Words per Minute
  - Latency (ms)
  - Spoken Words Count
  - Session Duration
- **Modern Design**: Maintained original gradient styling with enhanced UX

### ⚙️ Configuration

- **Fixed Backend Settings**:
  - Server: `ws://localhost:8000` (configurable via `REACT_APP_WS_URL`)
  - Task: Transcribe only
  - Model: large-v3-turbo
  - VAD: Enabled
- **Audio Processing**: 16kHz, Float32Array format optimized for WhisperLive

## Components

### Core Components

- `RealtimePage.tsx` - Main interface (completely rewritten)
- `LanguageSelector.tsx` - Simplified language selection
- `SimpleTranscriptView.tsx` - Streamlined transcript display
- `AudioMonitor.tsx` - Real-time audio visualization
- `MetricsPanel.tsx` - Live performance metrics

### Services

- `audioService.ts` - Enhanced with WhisperLive compatibility
- `websocketService.ts` - Full WhisperLive protocol support

## Usage

1. **Start WhisperLive Backend**:

   ```bash
   cd Reatime-Whisper-BE
   python3 run_server.py --port 8000 --backend faster_whisper
   ```

2. **Configure Environment** (optional):

   ```env
   REACT_APP_WS_URL=ws://localhost:8000
   ```

3. **Use Interface**:
   - Select language (defaults to English)
   - Click microphone to start recording
   - View real-time transcription with metrics
   - Export transcripts as needed

## Technical Details

### WhisperLive Integration

- **Protocol**: Binary audio streaming + JSON config/responses
- **Audio Format**: Float32Array, 16kHz, normalized to [-1,1]
- **Message Handling**: Partial/final segment detection with stable IDs
- **Connection Management**: Auto-reconnection with error handling

### Performance Metrics

- **Input WPM**: Calculated from received transcript data over elapsed time
- **Latency**: Reported directly from WhisperLive backend
- **Spoken Words**: Count of finalized words in completed segments
- **Real-time Updates**: Metrics refresh continuously during recording

### Visual Design

- **Consistent Styling**: Preserved original purple/blue gradient theme
- **Responsive Layout**: Grid-based layout adapting to screen sizes
- **Animation States**:
  - Partial segments: Blue background with pulse animation
  - Final segments: Gray background, stable appearance
  - Recording indicator: Red pulse effect
  - Audio visualization: Real-time frequency bars

## Dependencies

- React 18+
- Lucide React (icons)
- Tailwind CSS (styling)
- Web Audio API (audio processing)
- WebSocket API (communication)

## Browser Support

- Chrome/Edge 88+ (recommended)
- Firefox 84+
- Safari 14.1+
- Requires: AudioWorklet, WebSocket, getUserMedia support
