import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChatContact } from '../types';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, ShieldCheck, Maximize2 } from 'lucide-react';

interface CallModalProps {
  contact: ChatContact;
  type: 'voice' | 'video';
  onEndCall: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ contact, type, onEndCall }) => {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(type === 'voice');

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl bg-slate-900 border border-rose-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center text-white relative"
      >
        {/* Top bar info */}
        <div className="w-full px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> High-Quality Encrypted {type === 'video' ? 'Video' : 'Voice'} Call
            </span>
          </div>
          <span className="text-sm font-mono bg-slate-900 px-3 py-1 rounded-full border border-slate-800 text-rose-200">
            {formatTime(duration)}
          </span>
        </div>

        {/* Main call stage */}
        <div className="w-full h-96 bg-slate-950 relative flex items-center justify-center overflow-hidden">
          {type === 'video' && !isVideoOff ? (
            <div className="absolute inset-0">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-full h-full object-cover filter brightness-90 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
              {/* Picture-in-picture self view */}
              <div className="absolute bottom-4 right-4 w-28 h-40 bg-slate-900 rounded-2xl border-2 border-rose-500/50 overflow-hidden shadow-2xl flex items-center justify-center">
                <div className="text-xs text-rose-200/70 font-medium">You</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center relative">
              <div className="absolute -inset-8 bg-rose-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-r from-rose-500 to-pink-500 shadow-2xl mb-4">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-full h-full rounded-full object-cover border-4 border-slate-900"
                />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{contact.name}</h3>
              <p className="text-sm text-rose-300/80 mb-6">{contact.statusText}</p>

              {/* Simulated audio waveform */}
              <div className="flex items-center gap-1.5 h-8">
                {[40, 70, 30, 90, 60, 80, 45, 100, 65, 35, 75, 50].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${h}%`, `${Math.max(20, h * 0.4)}%`, `${h}%`] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.08 }}
                    className="w-1.5 bg-gradient-to-t from-rose-500 to-pink-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-medium text-rose-200">
            {contact.name} • {contact.mood}
          </div>
        </div>

        {/* Call control buttons */}
        <div className="w-full p-6 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-2xl transition-all shadow-lg ${
              isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {type === 'video' && (
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-4 rounded-2xl transition-all shadow-lg ${
                isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>
          )}

          <button
            onClick={onEndCall}
            className="p-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl transition-all shadow-lg shadow-red-900/40"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
