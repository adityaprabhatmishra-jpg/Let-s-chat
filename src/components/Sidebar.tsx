import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChatContact, User, GeofenceAlert } from '../types';
import {
  MessageCircle, Search, ShieldCheck, MapPin, Palette, Lock,
  Smile, Plus, Phone, Mail, Sparkles, Radio, Check, Circle, LogOut, ShieldAlert, KeyRound, Wifi, WifiOff
} from 'lucide-react';

interface SidebarProps {
  currentUser: User;
  contacts: ChatContact[];
  activeContactId: string | null;
  geofenceAlerts: GeofenceAlert[];
  onSelectContact: (id: string) => void;
  onOpenThemes: () => void;
  onOpenLocation: () => void;
  onOpenLocationRadar: () => void;
  onOpenSOS: () => void;
  onOpenChangePasscode: () => void;
  onLockApp: () => void;
  onLogout: () => void;
  onUpdateStatus: (newStatus: string, newMood: string) => void;
  onAddContactByMatch: (name: string, email: string, phone: string, gender: 'boy' | 'girl') => void;
  onToggleNetworkMode: (mode: 'online' | 'offline') => void;
  onToggleArchive: (contactId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  contacts,
  activeContactId,
  geofenceAlerts,
  onSelectContact,
  onOpenThemes,
  onOpenLocation,
  onOpenLocationRadar,
  onOpenSOS,
  onOpenChangePasscode,
  onLockApp,
  onLogout,
  onUpdateStatus,
  onAddContactByMatch,
  onToggleNetworkMode,
  onToggleArchive
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchivedSection, setShowArchivedSection] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusInput, setStatusInput] = useState(currentUser.statusText);
  const [moodInput, setMoodInput] = useState(currentUser.mood);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [soulmateName, setSoulmateName] = useState('');
  const [soulmateEmail, setSoulmateEmail] = useState('');
  const [soulmatePhone, setSoulmatePhone] = useState('');
  const [soulmateGender, setSoulmateGender] = useState<'boy' | 'girl'>('girl');
  const [matchError, setMatchError] = useState('');

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const unreadAlertsCount = geofenceAlerts.filter((a) => !a.read).length;

  const handleMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!soulmateName.trim() || !soulmateEmail.trim() || !soulmatePhone.trim()) {
      setMatchError('Name, Gmail and Phone number are all compulsory!');
      return;
    }
    if (!soulmateEmail.includes('@gmail.com')) {
      setMatchError('Please enter a valid Gmail address (@gmail.com)');
      return;
    }
    
    // Server validation check simulating database match
    onAddContactByMatch(soulmateName.trim(), soulmateEmail.trim(), soulmatePhone.trim(), soulmateGender);
    setSoulmateName('');
    setSoulmateEmail('');
    setSoulmatePhone('');
    setMatchError('');
    setShowAddModal(false);
  };

  return (
    <div className="w-full md:w-80 lg:w-96 bg-slate-950 border-r border-slate-800 flex flex-col h-full text-white relative">
      {/* Top Header / Profile Info */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-rose-500/50 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-base tracking-tight text-white">{currentUser.name}</h2>
              <p className="text-xs text-rose-200/70 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> End-to-End Encrypted
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenChangePasscode}
              className="p-2 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-800 transition-colors"
              title="Change PIN / Password"
            >
              <KeyRound className="w-4 h-4" />
            </button>
            <button
              onClick={onLockApp}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Lock App with PIN"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenThemes}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
              title="Change Chat Themes"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 transition-colors"
              title="Log out / Switch Account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status & Mood update banner */}
        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
          {isEditingStatus ? (
            <div className="space-y-2">
              <input
                type="text"
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                placeholder="Current activity status..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
              <input
                type="text"
                value={moodInput}
                onChange={(e) => setMoodInput(e.target.value)}
                placeholder="Mood (e.g. Happy 😊)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditingStatus(false)}
                  className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(statusInput, moodInput);
                    setIsEditingStatus(false);
                  }}
                  className="px-2.5 py-1 bg-rose-600 font-semibold rounded-lg text-white hover:bg-rose-500"
                >
                  Save Status
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingStatus(true)}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-rose-400" />
                <span className="text-slate-200 font-medium">{currentUser.statusText}</span>
                <span className="text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-500/20">{currentUser.mood}</span>
              </div>
              <span className="text-[10px] text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                Edit
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Search & Add Real Connection button */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search soulmates, email, number..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-semibold rounded-xl shadow-md hover:from-rose-500 hover:to-pink-500 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="Add Soulmate via Gmail or Number Match"
          >
            <Plus className="w-4 h-4" />
            <span>Add Soulmate</span>
          </button>
        </div>

        {/* Location Radar & Google Maps Live Status Button */}
        <button
          onClick={onOpenLocationRadar}
          className="w-full p-2.5 bg-gradient-to-r from-slate-900 to-rose-950/40 hover:bg-slate-800 border border-rose-500/30 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer group shadow-sm"
        >
          <div className="flex items-center gap-2 text-rose-200 group-hover:text-white">
            <MapPin className="w-4 h-4 text-rose-400 animate-bounce" />
            <span className="font-semibold">📍 Location Radar (24hr Live)</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-rose-600/30 text-rose-300 rounded-full border border-rose-500/30">
            Google Maps
          </span>
        </button>

        {/* Online / Offline Mode Toggle */}
        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-200 flex items-center gap-1.5">
              {currentUser.networkMode === 'online' ? (
                <Wifi className="w-4 h-4 text-emerald-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-amber-400" />
              )}
              Network Server Mode:
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              currentUser.networkMode === 'online' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {currentUser.networkMode}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onToggleNetworkMode('online')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentUser.networkMode === 'online'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Real Online Server
            </button>
            <button
              onClick={() => onToggleNetworkMode('offline')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentUser.networkMode === 'offline'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Real Offline Mesh
            </button>
          </div>
        </div>

        {/* Location & Geofencing Radar Button */}
        <button
          onClick={onOpenLocation}
          className="w-full p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2 text-rose-300 group-hover:text-rose-200">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-semibold">Geofence Safe Radius</span>
          </div>
          {unreadAlertsCount > 0 && (
            <span className="px-2 py-0.5 bg-rose-600 text-white rounded-full text-[10px] font-bold">
              {unreadAlertsCount} alerts
            </span>
          )}
        </button>

        {/* Emergency SOS Offline Mode Button */}
        <button
          onClick={onOpenSOS}
          className="w-full p-2.5 bg-gradient-to-r from-red-950/80 to-rose-950/80 hover:from-red-900/80 hover:to-rose-900/80 border border-red-500/40 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer group shadow-sm shadow-red-950/50"
        >
          <div className="flex items-center gap-2 text-red-200 group-hover:text-white">
            <ShieldAlert className="w-4 h-4 text-red-400 animate-bounce" />
            <span className="font-bold tracking-wide">🚨 SOS Offline Safety Mode</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-red-600/30 text-red-300 rounded-full border border-red-500/30 font-semibold">
            No Internet OK
          </span>
        </button>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {/* Active / Unarchived Contacts */}
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-300/60 flex items-center justify-between">
          <span>Real Connections ({filteredContacts.filter(c => !c.isArchived).length})</span>
        </div>

        {filteredContacts.filter(c => !c.isArchived).map((contact) => {
          const isActive = contact.id === activeContactId;
          return (
            <motion.div
              key={contact.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectContact(contact.id)}
              className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 relative group ${
                isActive
                  ? 'bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-500/40 shadow-md'
                  : 'hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                    contact.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="font-semibold text-sm text-white truncate">{contact.name}</h4>
                  <span className="text-[10px] text-slate-400">{contact.lastSeen}</span>
                </div>
                <p className="text-xs text-rose-200/60 truncate">{contact.statusText}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-900 rounded text-slate-400 border border-slate-800">
                    {contact.connectionType === 'gmail' ? '✉️ Gmail Match' : '📱 Number Match'}
                  </span>
                </div>
              </div>

              {contact.unreadCount > 0 && (
                <div className="w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow">
                  {contact.unreadCount}
                </div>
              )}

              {/* Archive Button on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleArchive(contact.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 bg-slate-800 hover:bg-rose-900 text-rose-300 hover:text-white rounded-lg transition-all text-[10px]"
                title="Archive Chat"
              >
                Archive
              </button>
            </motion.div>
          );
        })}

        {/* Archived Chats Section */}
        {contacts.filter(c => c.isArchived).length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => setShowArchivedSection(!showArchivedSection)}
              className="w-full flex items-center justify-between px-3 py-2 bg-slate-900 hover:bg-slate-800/80 rounded-xl text-xs font-semibold text-rose-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                📦 Archived Chats ({contacts.filter(c => c.isArchived).length})
              </span>
              <span>{showArchivedSection ? '▲' : '▼'}</span>
            </button>

            {showArchivedSection && (
              <div className="mt-2 space-y-1.5 pl-2">
                {contacts.filter(c => c.isArchived).map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => onSelectContact(contact.id)}
                    className="p-2.5 bg-slate-900/60 hover:bg-slate-900 rounded-xl flex items-center justify-between cursor-pointer border border-slate-800/80 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={contact.avatar} alt={contact.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-white truncate">{contact.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">Archived conversation</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleArchive(contact.id);
                      }}
                      className="px-2 py-1 bg-slate-800 hover:bg-rose-600 text-rose-200 hover:text-white rounded-lg text-[10px] transition-colors"
                      title="Unarchive Chat"
                    >
                      Unarchive
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Real Connection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-2xl text-white"
          >
            <h3 className="text-lg font-bold mb-1">Add Soulmate</h3>
            <p className="text-xs text-rose-200/70 mb-4">
              Enter name, Gmail, and phone number. The server will verify and match!
            </p>

            {matchError && (
              <div className="mb-3 p-2 bg-rose-900/40 text-rose-200 text-xs rounded-xl border border-rose-500/30">
                {matchError}
              </div>
            )}

            <form onSubmit={handleMatchSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-rose-200 mb-1">Soulmate Name (e.g. Mahek):</label>
                <input
                  type="text"
                  value={soulmateName}
                  onChange={(e) => setSoulmateName(e.target.value)}
                  placeholder="Mahek"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-rose-200 mb-1">Gmail (Compulsory):</label>
                <input
                  type="email"
                  value={soulmateEmail}
                  onChange={(e) => setSoulmateEmail(e.target.value)}
                  placeholder="mahek@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-rose-200 mb-1">Phone Number (Compulsory):</label>
                <input
                  type="text"
                  value={soulmatePhone}
                  onChange={(e) => setSoulmatePhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-rose-200 mb-1">Character Select:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSoulmateGender('girl')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      soulmateGender === 'girl' ? 'bg-rose-600/30 border-rose-500 text-rose-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    👧 Girl Character
                  </button>
                  <button
                    type="button"
                    onClick={() => setSoulmateGender('boy')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      soulmateGender === 'boy' ? 'bg-rose-600/30 border-rose-500 text-rose-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    👦 Boy Character
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-xs font-semibold rounded-xl text-white shadow-md hover:from-rose-500 hover:to-pink-500"
                >
                  Match & Start Chat
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
