import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface LockScreenProps {
  correctPasscode: string;
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ correctPasscode, onUnlock }) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === correctPasscode || enteredPin === '1234') {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-slate-900 border border-rose-500/30 rounded-3xl p-8 shadow-2xl text-center text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-flex p-4 bg-rose-500/20 text-rose-400 rounded-2xl mb-4 border border-rose-500/30 shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-rose-200 to-pink-400 bg-clip-text text-transparent mb-1">
          Let's Chat is Locked
        </h2>
        <p className="text-xs text-rose-200/70 mb-6">
          Enter your 4-digit security PIN to unlock your encrypted chats
        </p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={6}
              autoFocus
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="Enter PIN (e.g. 1234)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 text-center text-xl tracking-widest text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors shadow-inner"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-rose-400 font-medium"
            >
              Incorrect PIN. (Hint: default is 1234 or your set PIN)
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Unlock Chat
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-rose-200/50">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          End-to-End Encrypted Privacy Guard
        </div>
      </motion.div>
    </div>
  );
};
