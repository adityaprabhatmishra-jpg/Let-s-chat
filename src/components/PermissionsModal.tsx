import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, MapPin, Video, Mic, Bell, CheckCircle2, Sparkles } from 'lucide-react';

interface PermissionsModalProps {
  onAllowAll: () => void;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({ onAllowAll }) => {
  const [granted, setGranted] = useState(false);

  const handleAllow = async () => {
    setGranted(true);
    // Request browser native push notification permission if supported
    if ('Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch (e) {
        console.log('Notification permission request error:', e);
      }
    }
    try {
      localStorage.setItem('lets_chat_permissions_granted', 'true');
    } catch {}
    setTimeout(() => {
      onAllowAll();
    }, 600);
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
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-rose-200 to-pink-400 bg-clip-text text-transparent">
            App Permissions & Safety
          </h2>
          <p className="text-xs text-rose-200/70 mt-1">
            Let's Chat requests permissions one time only and saves your preferences securely on the server.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
              <Bell className="w-5 h-5 text-rose-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">Push Notifications</div>
              <div className="text-[11px] text-slate-400">Real-time alerts when soulmates message you, just like WhatsApp</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">Real-Time Location & Geofencing</div>
              <div className="text-[11px] text-slate-400">Allows friends to easily meet up with safe radius alerts</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
              <Video className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">Camera & Video Chat</div>
              <div className="text-[11px] text-slate-400">High-quality encrypted video calls with soulmates</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
              <Mic className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">Microphone & Audio Notes</div>
              <div className="text-[11px] text-slate-400">Send fast audio messages and high-quality voice calls</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <button
          onClick={handleAllow}
          disabled={granted}
          className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {granted ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              Saving to Server...
            </>
          ) : (
            <>
              Allow All & Save to Server (One Time)
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};
