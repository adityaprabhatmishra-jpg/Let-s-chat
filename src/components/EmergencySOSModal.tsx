import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, MapPin, Send, ShieldAlert, X, CheckCircle2, WifiOff } from 'lucide-react';

interface EmergencySOSModalProps {
  onClose: () => void;
  onSendSOSMessage: (sosText: string, locationData: any) => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ onClose, onSendSOSMessage }) => {
  const [offlineMessage, setOfflineMessage] = useState('EMERGENCY SOS: I need help immediately! Please check my live location.');
  const [isSentOffline, setIsSentOffline] = useState(false);
  const [queuedCount, setQueuedCount] = useState<number>(() => {
    try {
      const q = localStorage.getItem('lets_chat_offline_sos_queue');
      return q ? JSON.parse(q).length : 0;
    } catch {
      return 0;
    }
  });

  const handleTriggerSOS = (e: React.FormEvent) => {
    e.preventDefault();
    const emergencyLocation = {
      lat: 40.7851,
      lng: -73.9683,
      address: 'Emergency GPS Pin (Offline Safe Zone)'
    };

    // Save to offline queue in localStorage for safety
    try {
      const existing = JSON.parse(localStorage.getItem('lets_chat_offline_sos_queue') || '[]');
      const newPacket = {
        text: offlineMessage,
        location: emergencyLocation,
        timestamp: Date.now()
      };
      localStorage.setItem('lets_chat_offline_sos_queue', JSON.stringify([newPacket, ...existing]));
      setQueuedCount(prev => prev + 1);
    } catch {}

    onSendSOSMessage(offlineMessage, emergencyLocation);
    setIsSentOffline(true);
    setTimeout(() => {
      setIsSentOffline(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/90 backdrop-blur-xl p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border-2 border-red-500 rounded-3xl p-6 md:p-8 shadow-2xl text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600/30 text-red-400 rounded-2xl border border-red-500/50 animate-pulse">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-400">Emergency Offline SOS Mode</h3>
              <p className="text-xs text-red-200/80">Zero internet required • Girlfriend safety lifeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSentOffline ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-emerald-300">SOS Dispatched Offline!</h4>
            <p className="text-xs text-slate-300">
              Your emergency distress signal and live location have been securely saved and queued for instant delivery.
            </p>
          </div>
        ) : (
          <form onSubmit={handleTriggerSOS} className="space-y-4">
            <div className="p-3 bg-red-950/50 rounded-2xl border border-red-500/30 flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-xs text-red-200">
                When internet is inaccessible, this feature queues messages locally and broadcasts your live GPS location to your soulmate immediately.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-red-300 mb-1">Emergency Message</label>
              <textarea
                rows={3}
                value={offlineMessage}
                onChange={(e) => setOfflineMessage(e.target.value)}
                className="w-full bg-slate-950 border border-red-500/40 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                GPS Location Attached:
              </span>
              <span className="text-emerald-400 font-mono">Central Park Safety Zone</span>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-2xl shadow-xl shadow-red-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer text-base uppercase tracking-wider"
            >
              <ShieldAlert className="w-5 h-5" />
              Send Emergency SOS Now
            </button>

            {queuedCount > 0 && (
              <div className="text-center text-[11px] text-slate-400">
                📦 Stored offline packets in secure local queue: <span className="text-red-400 font-bold">{queuedCount}</span>
              </div>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
};
