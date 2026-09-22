import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, ShieldCheck, Sparkles, X, CheckCircle2, Navigation } from 'lucide-react';

interface LocationRadarModalProps {
  onClose: () => void;
  onShareLocation: (loc: any) => void;
}

export const LocationRadarModal: React.FC<LocationRadarModalProps> = ({ onClose, onShareLocation }) => {
  const [sharingAllowed, setSharingAllowed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('lets_chat_24hr_location_allowed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSharing = (allow: boolean) => {
    setSharingAllowed(allow);
    try {
      localStorage.setItem('lets_chat_24hr_location_allowed', allow ? 'true' : 'false');
    } catch {}
  };

  const handleSendLivePin = () => {
    const livePin = {
      lat: 40.7851,
      lng: -73.9683,
      address: 'Central Park Conservatory Water Live GPS (24Hr Shared)'
    };
    onShareLocation(livePin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-slate-900 border border-rose-500/30 rounded-3xl p-6 md:p-8 shadow-2xl text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-600/20 text-rose-400 rounded-2xl border border-rose-500/30">
              <Navigation className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white via-rose-200 to-pink-400 bg-clip-text text-transparent">
                Live 24-Hour Location Radar
              </h3>
              <p className="text-xs text-rose-200/70">Google Maps live status & partner tracking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map simulation frame */}
        <div className="w-full h-48 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden mb-6 flex items-center justify-center">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-12 h-12 bg-rose-600/30 rounded-full animate-ping absolute" />
            <div className="w-10 h-10 bg-gradient-to-tr from-rose-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white relative z-10">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="mt-2 px-3 py-1 bg-slate-900/90 border border-rose-500/40 rounded-full text-[11px] font-semibold text-rose-200 shadow-md">
              Girlfriend Live Status: Central Park 💖 (Online)
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <div>
                <div className="text-sm font-semibold text-white">24-Hour Location Permission</div>
                <div className="text-xs text-slate-400">Allow partner to view live location anytime for safety</div>
              </div>
            </div>
            <button
              onClick={() => handleToggleSharing(!sharingAllowed)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                sharingAllowed
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sharingAllowed ? 'Allowed (24 Hrs)' : 'Tap to Allow'}
            </button>
          </div>
        </div>

        <button
          onClick={handleSendLivePin}
          className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Share Live GPS Location Pin in Chat
        </button>
      </motion.div>
    </div>
  );
};
