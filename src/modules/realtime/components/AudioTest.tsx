import React, { useState, useEffect, useRef } from 'react';
import AudioService from '../services/audioService';
import WebSocketService from '../services/websocketService';

interface AudioTestProps {
  wsUrl?: string;
  authToken?: string;
}

const AudioTest: React.FC<AudioTestProps> = ({ 
  wsUrl = 'ws://localhost:8000/ws/audio',
  authToken = 'test-token'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [transcription, setTranscription] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [latencyStats, setLatencyStats] = useState<{ first: number | null, final: number | null }>({ first: null, final: null });
  
  const audioServiceRef = useRef<AudioService | null>(null);
  const wsServiceRef = useRef<WebSocketService | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize services
    audioServiceRef.current = new AudioService({
      sampleRate: 16000,
      channelCount: 1,
      bitrate: 16000,
      chunkDurationMs: 50
    });

    wsServiceRef.current = new WebSocketService({
      url: wsUrl,
      reconnectAttempts: 3,
      reconnectDelay: 1000,
      pingInterval: 30000,
      language: 'en',
      audioFormat: 'raw_pcm'
    });

    // Set up callbacks
    audioServiceRef.current.setCallbacks({
      onAudioData: (audioData) => {
        if (wsServiceRef.current) {
          wsServiceRef.current.sendAudioData(audioData);
        }
      },
      onAudioLevel: (levelInfo) => {
        setAudioLevel(levelInfo.level);
      },
      onError: (error) => {
        console.error('Audio error:', error);
      }
    });

    wsServiceRef.current.setCallbacks({
      onTranscription: (result) => {
        const now = Date.now();
        
        if (result.text.trim() && startTimeRef.current) {
          if (latencyStats.first === null) {
            const firstLatency = now - startTimeRef.current;
            setLatencyStats(prev => ({ ...prev, first: firstLatency }));
          }
          
          if (result.is_final && startTimeRef.current) {
            const finalLatency = now - startTimeRef.current;
            setLatencyStats(prev => ({ ...prev, final: finalLatency }));
          }
        }
        
        setTranscription(result.text);
      },
      onConnectionStatus: (status) => {
        setConnectionStatus(status);
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
      }
    });

    return () => {
      if (audioServiceRef.current) {
        audioServiceRef.current.cleanup();
      }
      if (wsServiceRef.current) {
        wsServiceRef.current.disconnect();
      }
    };
  }, [wsUrl]);

  const handleStartRecording = async () => {
    try {
      if (!audioServiceRef.current || !wsServiceRef.current) return;

      // Initialize audio service
      await audioServiceRef.current.initialize();
      
      // Connect to WebSocket
      await wsServiceRef.current.connect(authToken);
      
      // Start recording
      await audioServiceRef.current.startRecording();
      
      setIsRecording(true);
      startTimeRef.current = Date.now();
      setLatencyStats({ first: null, final: null });
      setTranscription('');
      
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = () => {
    if (audioServiceRef.current) {
      audioServiceRef.current.stopRecording();
    }
    if (wsServiceRef.current) {
      wsServiceRef.current.disconnect();
    }
    
    setIsRecording(false);
    startTimeRef.current = null;
  };

  const getAudioLevelColor = () => {
    if (audioLevel > 0.8) return '#ff4444';
    if (audioLevel > 0.5) return '#ffaa00';
    return '#44ff44';
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Audio Worklet Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Status</h3>
        <p>Connection: <span style={{ color: connectionStatus === 'connected' ? 'green' : 'red' }}>
          {connectionStatus}
        </span></p>
        <p>Recording: <span style={{ color: isRecording ? 'green' : 'red' }}>
          {isRecording ? 'Active' : 'Inactive'}
        </span></p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Audio Level</h3>
        <div style={{ 
          width: '200px', 
          height: '20px', 
          backgroundColor: '#ddd', 
          position: 'relative' 
        }}>
          <div style={{
            width: `${audioLevel * 100}%`,
            height: '100%',
            backgroundColor: getAudioLevelColor(),
            transition: 'width 0.1s'
          }} />
        </div>
        <small>{(audioLevel * 100).toFixed(1)}%</small>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Latency Stats</h3>
        <p>First Partial: {latencyStats.first ? `${latencyStats.first}ms` : 'N/A'}</p>
        <p>Final Result: {latencyStats.final ? `${latencyStats.final}ms` : 'N/A'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Transcription</h3>
        <div style={{ 
          border: '1px solid #ccc', 
          padding: '10px', 
          minHeight: '100px',
          backgroundColor: '#f9f9f9'
        }}>
          {transcription || 'No transcription yet...'}
        </div>
      </div>

      <div>
        <button 
          onClick={handleStartRecording} 
          disabled={isRecording}
          style={{ 
            marginRight: '10px', 
            padding: '10px 20px',
            backgroundColor: isRecording ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRecording ? 'not-allowed' : 'pointer'
          }}
        >
          Start Recording
        </button>
        
        <button 
          onClick={handleStopRecording} 
          disabled={!isRecording}
          style={{ 
            padding: '10px 20px',
            backgroundColor: !isRecording ? '#ccc' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !isRecording ? 'not-allowed' : 'pointer'
          }}
        >
          Stop Recording
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <h4>Instructions:</h4>
        <ol>
          <li>Click "Start Recording" to begin</li>
          <li>Speak into your microphone</li>
          <li>Watch for transcription results</li>
          <li>Check latency measurements</li>
          <li>Click "Stop Recording" when done</li>
        </ol>
        
        <h4>Expected Behavior:</h4>
        <ul>
          <li>Audio level should respond to your voice</li>
          <li>First partial should appear within 300ms</li>
          <li>Final result should appear within 700ms</li>
          <li>Connection should show "connected"</li>
        </ul>
      </div>
    </div>
  );
};

export default AudioTest; 