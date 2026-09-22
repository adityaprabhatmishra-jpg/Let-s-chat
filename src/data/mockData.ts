import { ChatContact, ChatTheme, GeofenceAlert, Message } from '../types';

export const CHAT_THEMES: ChatTheme[] = [
  {
    id: 'love-blossom',
    name: '❤️ Love Blossom',
    bgGradient: 'from-rose-950 via-pink-950 to-slate-950',
    bubbleUser: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-900/30',
    bubblePeer: 'bg-slate-800/90 text-rose-100 border border-rose-500/20',
    textColor: 'text-rose-100',
    accentColor: 'bg-rose-500',
    previewColor: '#e11d48'
  },
  {
    id: 'sakura-blossom',
    name: '🌸 Sakura Cherry Blossom',
    bgGradient: 'from-pink-950 via-rose-950 to-purple-950',
    bubbleUser: 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg shadow-pink-900/30',
    bubblePeer: 'bg-slate-900/90 text-pink-100 border border-pink-400/20',
    textColor: 'text-pink-100',
    accentColor: 'bg-pink-400',
    previewColor: '#f472b6'
  },
  {
    id: 'rose-gold',
    name: '✨ Rose Gold Elegance',
    bgGradient: 'from-stone-950 via-amber-950/40 to-neutral-950',
    bubbleUser: 'bg-gradient-to-r from-amber-600 to-rose-500 text-white shadow-lg shadow-amber-900/30',
    bubblePeer: 'bg-stone-900 text-amber-100 border border-amber-500/20',
    textColor: 'text-amber-100',
    accentColor: 'bg-amber-500',
    previewColor: '#d97706'
  },
  {
    id: 'velvet-heart',
    name: '💖 Velvet Heart',
    bgGradient: 'from-red-950 via-rose-950 to-zinc-950',
    bubbleUser: 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-900/30',
    bubblePeer: 'bg-slate-900 text-red-100 border border-red-500/20',
    textColor: 'text-red-100',
    accentColor: 'bg-red-500',
    previewColor: '#dc2626'
  },
  {
    id: 'neon-pulse',
    name: '⚡ Neon Cyberpunk',
    bgGradient: 'from-purple-950 via-slate-950 to-cyan-950',
    bubbleUser: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20',
    bubblePeer: 'bg-slate-900/90 text-cyan-200 border border-cyan-500/30',
    textColor: 'text-cyan-100',
    accentColor: 'bg-cyan-400',
    previewColor: '#06b6d4'
  },
  {
    id: 'midnight-velvet',
    name: '🌙 Midnight Velvet',
    bgGradient: 'from-slate-950 via-indigo-950 to-zinc-950',
    bubbleUser: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/30',
    bubblePeer: 'bg-slate-900 text-indigo-100 border border-indigo-500/20',
    textColor: 'text-indigo-100',
    accentColor: 'bg-indigo-500',
    previewColor: '#6366f1'
  },
  {
    id: 'royal-amethyst',
    name: '🔮 Royal Amethyst',
    bgGradient: 'from-fuchsia-950 via-purple-950 to-slate-950',
    bubbleUser: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-900/30',
    bubblePeer: 'bg-slate-900 text-purple-100 border border-purple-500/20',
    textColor: 'text-purple-100',
    accentColor: 'bg-purple-500',
    previewColor: '#a855f7'
  },
  {
    id: 'emerald-aura',
    name: '🌿 Emerald Aura',
    bgGradient: 'from-emerald-950 via-teal-950 to-slate-950',
    bubbleUser: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30',
    bubblePeer: 'bg-slate-900 text-emerald-100 border border-emerald-500/20',
    textColor: 'text-emerald-100',
    accentColor: 'bg-emerald-500',
    previewColor: '#10b981'
  },
  {
    id: 'golden-sunset',
    name: '🌅 Golden Sunset',
    bgGradient: 'from-orange-950 via-red-950 to-slate-950',
    bubbleUser: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-900/30',
    bubblePeer: 'bg-slate-900 text-amber-100 border border-orange-500/20',
    textColor: 'text-amber-100',
    accentColor: 'bg-orange-500',
    previewColor: '#f97316'
  },
  {
    id: 'cosmic-starlight',
    name: '🌌 Cosmic Starlight',
    bgGradient: 'from-blue-950 via-indigo-950 to-slate-950',
    bubbleUser: 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-900/30',
    bubblePeer: 'bg-slate-900 text-blue-100 border border-blue-500/20',
    textColor: 'text-blue-100',
    accentColor: 'bg-blue-500',
    previewColor: '#3b82f6'
  },
  {
    id: 'mystic-aurora',
    name: '✨ Mystic Aurora',
    bgGradient: 'from-teal-950 via-cyan-950 to-emerald-950',
    bubbleUser: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-900/30',
    bubblePeer: 'bg-slate-900 text-teal-100 border border-teal-500/20',
    textColor: 'text-teal-100',
    accentColor: 'bg-teal-400',
    previewColor: '#14b8a6'
  },
  {
    id: 'crimson-passion',
    name: '❤️‍🔥 Crimson Passion',
    bgGradient: 'from-rose-950 via-red-950 to-black',
    bubbleUser: 'bg-gradient-to-r from-rose-700 to-red-600 text-white shadow-lg shadow-rose-900/40',
    bubblePeer: 'bg-slate-900 text-rose-100 border border-rose-600/30',
    textColor: 'text-rose-100',
    accentColor: 'bg-rose-600',
    previewColor: '#9f1239'
  }
];

export const INITIAL_CONTACTS: ChatContact[] = [];

export const INITIAL_MESSAGES: Record<string, Message[]> = {};

export const INITIAL_GEOFENCES: GeofenceAlert[] = [];
