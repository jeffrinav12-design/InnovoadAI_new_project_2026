import React, { useState } from 'react';
import { Volume2, VolumeX, Pause } from 'lucide-react';

interface AudioPlayerProps {
  textToSpeak: string;
  label?: string;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ textToSpeak, label = 'Listen', className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text to speech is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleSpeech}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
        isPlaying
          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 animate-pulse'
          : 'bg-brand/10 text-brand hover:bg-brand/20 dark:bg-slate-800 dark:text-brand dark:hover:bg-slate-700'
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <Pause className="w-3.5 h-3.5" /> Stop Voice
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5" /> {label}
        </>
      )}
    </button>
  );
};
