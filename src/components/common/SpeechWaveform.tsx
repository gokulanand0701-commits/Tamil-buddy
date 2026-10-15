import React from 'react';
import { motion } from 'framer-motion';

interface SpeechWaveformProps {
  isRecording: boolean;
  barCount?: number;
  className?: string;
}

export const SpeechWaveform: React.FC<SpeechWaveformProps> = ({
  isRecording,
  barCount = 14,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center gap-1.5 h-12 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-coral-500"
          animate={
            isRecording
              ? {
                  height: [8, Math.max(12, ((i * 7) % 36) + 10), 6],
                  opacity: [0.6, 1, 0.6],
                }
              : { height: 6, opacity: 0.3 }
          }
          transition={
            isRecording
              ? {
                  repeat: Infinity,
                  duration: 0.4 + (i % 5) * 0.1,
                  ease: 'easeInOut',
                  delay: (i * 0.05) % 0.3,
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
};
