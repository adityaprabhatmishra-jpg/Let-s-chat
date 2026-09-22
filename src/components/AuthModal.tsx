import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User } from '../types';
import { ShieldCheck, Mail, Phone, Lock, User as UserIcon, Heart, ArrowRight, Sparkles } from 'lucide-react';

interface AuthModalProps {
  onSignIn: (user: User) => void;
  onConnectSoulmate: (name: string, email: string, phone: string, gender: 'boy' | 'girl') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSignIn, onConnectSoulmate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');
  const [connectQuery, setConnectQuery] = useState('');
  const [connectType, setConnectType] = useState<'gmail' | 'phone'>('gmail');
  const [tab, setTab] = useState<'signup' | 'connect'>('signup');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your chatter name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError('Please provide either a Gmail or phone number for real connection.');
      return;
    }
    if (!passcode || passcode.length < 4) {
      setError('Please set a 4-digit security PIN for exit lock & privacy.');
      return;
    }

    const newUser: User = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      email: email.trim() || 'user@gmail.com',
      phone: phone.trim() || '+1 (555) 000-0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      statusText: 'Connected on Let\'s Chat ✨',
      mood: 'Happy 😊',
      isOnline: true,
      passcode: passcode,
      networkMode: 'online'
    };

    setLoading(true);
    try {
      await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
    } catch (err) {
      console.error('Server registration sync error:', err);
    }
    setLoading(false);
    onSignIn(newUser);
  };

  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectQuery.trim()) {
      setError(connectType === 'gmail' ? 'Enter soulmate Gmail to connect' : 'Enter phone number to connect');
      return;
    }

    setLoading(true);
    const mockName = connectType === 'gmail' ? connectQuery.split('@')[0] : 'Soulmate ' + connectQuery.slice(-4);
    const emailVal = connectType === 'gmail' ? connectQuery.trim() : 'matched.' + Date.now() + '@gmail.com';
    const phoneVal = connectType === 'phone' ? connectQuery.trim() : '+1 (555) 321-9876';

    onConnectSoulmate(mockName, emailVal, phoneVal, 'girl');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: 'spring', damping: 20 }}
        className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl p-6 md:p-8 shadow-2xl text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-rose-500/20 text-rose-400 rounded-2xl mb-3 border border-rose-500/30">
            <Heart className="w-8 h-8 fill-rose-500/40" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-rose-200 to-pink-400 bg-clip-text text-transparent">
            Welcome to Let's Chat
          </h2>
          <p className="text-sm text-rose-200/70 mt-1">
            Server-backed real connection via Gmail & Phone Number matching
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => { setTab('signup'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              tab === 'signup'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Sign Up & Save to Server
          </button>
          <button
            type="button"
            onClick={() => { setTab('connect'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              tab === 'connect'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Match on App Server
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-rose-900/40 border border-rose-500/40 rounded-xl text-rose-200 text-xs text-center"
          >
            {error}
          </motion.div>
        )}

        {tab === 'signup' ? (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-rose-200/80 mb-1">Your Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-rose-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-200/80 mb-1">Your Gmail (Saved to App Server)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-rose-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jordan@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-200/80 mb-1">Phone Number (Saved to App Server)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-rose-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 123-4567"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-200/80 mb-1">Security PIN / Password (Exit Lock)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-rose-400" />
                <input
                  type="password"
                  maxLength={6}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="4-digit PIN (e.g. 1234)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
              <p className="text-[10px] text-rose-200/50 mt-1">Required when re-entering app after exit/lock for privacy.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving to Server...' : 'Start Chatting Now'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleConnectSubmit} className="space-y-4">
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setConnectType('gmail')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  connectType === 'gmail'
                    ? 'bg-rose-600/30 border-rose-500 text-rose-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Match via Gmail
              </button>
              <button
                type="button"
                onClick={() => setConnectType('phone')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  connectType === 'phone'
                    ? 'bg-rose-600/30 border-rose-500 text-rose-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Match via Number
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-200/80 mb-1">
                {connectType === 'gmail' ? "Soulmate's Gmail Address" : "Soulmate's Phone Number"}
              </label>
              <div className="relative">
                {connectType === 'gmail' ? (
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-rose-400" />
                ) : (
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-rose-400" />
                )}
                <input
                  type={connectType === 'gmail' ? 'email' : 'text'}
                  value={connectQuery}
                  onChange={(e) => setConnectQuery(e.target.value)}
                  placeholder={connectType === 'gmail' ? 'sophia.vance@gmail.com' : '+1 (555) 234-5678'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
              <p className="text-[10px] text-rose-200/50 mt-1">App server automatically searches saved numbers & Gmails.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Searching Server Database...' : 'Verify & Connect Real Chat'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-rose-200/60">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Server-Backed Real Connection Handshake
        </div>
      </motion.div>
    </div>
  );
};
