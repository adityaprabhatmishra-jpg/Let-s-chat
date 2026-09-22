import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, KeyRound, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ChangePasscodeModalProps {
  currentPasscode: string;
  onClose: () => void;
  onUpdatePasscode: (newPasscode: string) => void;
}

export const ChangePasscodeModal: React.FC<ChangePasscodeModalProps> = ({ currentPasscode, onClose, onUpdatePasscode }) => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPass !== currentPasscode) {
      setError('Current PIN / Passcode is incorrect.');
      return;
    }
    if (newPass.length < 4) {
      setError('New PIN must be at least 4 digits.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('New PIN and confirmation do not match.');
      return;
    }

    onUpdatePasscode(newPass);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl p-6 md:p-8 shadow-2xl text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-rose-500/20 text-rose-400 rounded-2xl mb-3 border border-rose-500/30">
            <KeyRound className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-rose-200 to-pink-400 bg-clip-text text-transparent">
            Change Security PIN
          </h2>
          <p className="text-xs text-rose-200/70 mt-1">
            Update your 4-digit passcode used for app lock and privacy.
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-emerald-300">Passcode Changed Successfully!</h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-rose-200 text-xs text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-rose-200/80 mb-1">Current PIN</label>
              <input
                type="password"
                maxLength={6}
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="Enter current PIN"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-200/80 mb-1">New PIN</label>
              <input
                type="password"
                maxLength={6}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Enter new 4-digit PIN"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-200/80 mb-1">Confirm New PIN</label>
              <input
                type="password"
                maxLength={6}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm new PIN"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-900/40 transition-all text-xs"
              >
                Update PIN
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
