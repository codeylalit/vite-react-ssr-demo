import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AudioMonitorProps {
  audioLevel: number;
  isRecording: boolean;
  analyser?: AnalyserNode;
}

export const AudioMonitor: React.FC<AudioMonitorProps> = ({
  audioLevel,
  isRecording,
  analyser,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser || !isRecording) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Clear canvas
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      if (!isRecording) return;

      analyser.getByteFrequencyData(dataArray);

      // Clear canvas with background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / dataArray.length) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(0.5, '#764ba2');
        gradient.addColorStop(1, '#2d4cc8');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, isRecording]);

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-purple-200/30 shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]"></div>
        Audio Monitor
      </h3>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className={cn(
            'w-full h-24 rounded-lg border-2 transition-all duration-300',
            isRecording ? 'border-blue-300 shadow-lg shadow-blue-100' : 'border-gray-200'
          )}
          style={{ backgroundColor: '#f8fafc' }}
        />

        {!isRecording && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-gray-500 text-center px-4">
              Start recording to see audio visualization
            </p>
          </div>
        )}

        {/* Audio level indicator */}
        {isRecording && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-600">Level:</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-100"
                style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 w-10">{Math.round(audioLevel * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
