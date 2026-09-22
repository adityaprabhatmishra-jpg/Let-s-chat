import React from 'react';
import { motion } from 'motion/react';
import { Palette, X, Check, Heart } from 'lucide-react';
import { CHAT_THEMES } from '../data/mockData';
import { ChatThemeId } from '../types';

interface ThemeSelectorModalProps {
  currentThemeId: ChatThemeId;
  onSelectTheme: (themeId: ChatThemeId) => void;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ currentThemeId, onSelectTheme, onClose }) => {
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
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Select Chat Theme</h3>
              <p className="text-xs text-rose-200/70">Personalize your chat experience with gorgeous love themes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {CHAT_THEMES.map((theme) => {
            const isSelected = theme.id === currentThemeId;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-rose-500 bg-rose-950/40 shadow-lg shadow-rose-950/50 ring-2 ring-rose-500/50'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl shadow-md flex items-center justify-center border border-white/10"
                    style={{ backgroundColor: theme.previewColor }}
                  >
                    <Heart className="w-5 h-5 fill-white text-white drop-shadow" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-white">{theme.name}</h5>
                    <p className="text-[10px] text-rose-200/60 mt-0.5">End-to-End Encrypted</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="p-1.5 bg-rose-600 text-white rounded-full shadow-md">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
