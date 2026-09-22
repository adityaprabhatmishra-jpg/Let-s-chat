import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Heart, Sparkles, ShieldCheck } from 'lucide-react';

interface SplashLoaderProps {
  onComplete: () => void;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 4000; // 4 seconds loading time as requested

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(currentProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        onComplete();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-rose-950 to-neutral-950 text-white p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.15)_0,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
        className="relative mb-8"
      >
        <div className="absolute -inset-4 bg-gradient-to-r from-rose-600 to-pink-500 rounded-3xl blur-xl opacity-50 animate-pulse" />
        <div className="relative w-28 h-28 bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-950/50 border border-rose-400/30">
          <MessageCircle className="w-14 h-14 text-white drop-shadow-md" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-2 -right-2 bg-rose-500 text-white p-2 rounded-full shadow-lg border-2 border-slate-950"
          >
            <Heart className="w-5 h-5 fill-white" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-rose-200 to-pink-400 bg-clip-text text-transparent mb-3">
          Let's Chat
        </h1>
        <p className="text-rose-200/70 text-sm md:text-base font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-400 animate-spin" />
          Real Connection & End-to-End Encrypted Messaging
        </p>
      </motion.div>

      {/* Loading Progress Bar */}
      <div className="w-72 md:w-80 bg-slate-950/80 rounded-full h-3 p-0.5 border border-rose-500/30 shadow-inner mb-6 relative overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 h-full rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-rose-300/60 uppercase tracking-widest font-semibold">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        Secure Global Handshake • {progress}%
      </div>
    </motion.div>
  );
};
