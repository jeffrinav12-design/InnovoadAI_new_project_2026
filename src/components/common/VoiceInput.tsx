import React, { useState } from 'react';
import { Mic, MicOff, Loader2, Volume2, Sparkles, Check, X } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
  placeholder?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [manualText, setManualText] = useState('');
  const [statusMsg, setStatusMsg] = useState('Click to start microphone recording...');

  const sampleVoiceQueries = [
    'Generate unit 3 notes for Computer Networks',
    'Question paper for AI & Machine Learning 100 marks',
    'Explain A* search algorithm with example',
    'Show at-risk students with low attendance',
  ];

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setShowModal(true);
      setStatusMsg('Browser Speech API restricted in sandbox. Speak or select query below:');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMsg('Listening now... Speak into microphone');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition warning:', err);
        setIsListening(false);
        setShowModal(true);
        setStatusMsg('Microphone access unavailable. Select or type voice command:');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition start failed:', err);
      setIsListening(false);
      setShowModal(true);
    }
  };

  const handleSelectSample = (query: string) => {
    onTranscript(query);
    setShowModal(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualText.trim()) {
      onTranscript(manualText.trim());
      setManualText('');
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={startListening}
        title={isListening ? 'Listening...' : 'Voice Search (Click to Speak)'}
        className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-200 cursor-pointer ${
          isListening
            ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
            : 'bg-brand/10 text-brand hover:bg-brand/20 dark:bg-slate-800 dark:text-brand dark:hover:bg-slate-700'
        } ${className}`}
      >
        {isListening ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
      </button>

      {/* Voice Assistant Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand text-white shadow-md">
                <Volume2 className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">EduGen Voice Assistant</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{statusMsg}</p>
            </div>

            {/* Quick Sample Voice Prompts */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Voice Queries:</p>
              <div className="space-y-1.5">
                {sampleVoiceQueries.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(q)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-brand/10 dark:hover:bg-brand/20 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>"{q}"</span>
                    <Sparkles className="w-3.5 h-3.5 text-brand" />
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Speak Input */}
            <form onSubmit={handleManualSubmit} className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="block text-[11px] font-bold text-slate-500">Or type voice query manually:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="e.g., Search syllabus unit 2..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-md cursor-pointer transition-all"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

