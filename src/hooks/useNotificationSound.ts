import { useCallback, useRef } from 'react';

// Simple notification sound using Web Audio API
const useNotificationSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playNotificationSound = useCallback(() => {
    try {
      // Create audio context on first use (requires user interaction first)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const context = audioContextRef.current;
      
      // Resume context if suspended
      if (context.state === 'suspended') {
        context.resume();
      }

      // Create a pleasant notification sound
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Pleasant bell-like sound
      oscillator.frequency.setValueAtTime(880, context.currentTime); // A5
      oscillator.frequency.setValueAtTime(1100, context.currentTime + 0.1); // C#6
      oscillator.frequency.setValueAtTime(880, context.currentTime + 0.2); // A5

      oscillator.type = 'sine';

      // Fade in and out
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.15);
      gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.25);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.4);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.4);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }, []);

  return { playNotificationSound };
};

export default useNotificationSound;
