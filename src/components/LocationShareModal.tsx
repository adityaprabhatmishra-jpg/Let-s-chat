import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, ShieldAlert, X, CheckCircle2, Radio } from 'lucide-react';
import { GeofenceAlert } from '../types';

interface LocationShareModalProps {
  alerts: GeofenceAlert[];
  onClose: () => void;
  onSendLocation: (locationData: { lat: number; lng: number; address: string }) => void;
}

export const LocationShareModal: React.FC<LocationShareModalProps> = ({ alerts, onClose, onSendLocation }) => {
  const popularSpots = [
    { name: 'Central Park Conservatory Water', lat: 40.7851, lng: -73.9683, distance: '350m away' },
    { name: 'Downtown Artisan Coffee Roasters', lat: 40.7211, lng: -74.0022, distance: '1.2 km away' },
    { name: 'Metropolitan Art Gallery', lat: 40.7794, lng: -73.9632, distance: '850m away' },
    { name: 'Riverside Sunset Pier', lat: 40.8012, lng: -73.9715, distance: '2.1 km away' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-slate-900 border border-rose-500/30 rounded-3xl p-6 md:p-8 shadow-2xl text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Location Sharing & Geofencing</h3>
              <p className="text-xs text-rose-200/70">Real-time tracking for easy and safe meetups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Geofencing Alerts Section */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-300/80 mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Active Geofencing Alerts ({alerts.length})
          </h4>
          <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start gap-3"
              >
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl mt-0.5">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-semibold text-white">{alert.title}</h5>
                    <span className="text-[10px] text-slate-500">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Meetup Spot */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-300/80 mb-3 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-emerald-400" />
            Share Meetup Location Spot
          </h4>
          <div className="space-y-2">
            {popularSpots.map((spot, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSendLocation({
                    lat: spot.lat,
                    lng: spot.lng,
                    address: spot.name
                  });
                  onClose();
                }}
                className="w-full p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 rounded-2xl flex items-center justify-between transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-600/20 text-rose-400 rounded-xl group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-rose-200 transition-colors">
                      {spot.name}
                    </div>
                    <div className="text-xs text-slate-400">{spot.distance} • Verified Safe Zone</div>
                  </div>
                </div>
                <span className="text-xs font-medium text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
                  Share Spot
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
