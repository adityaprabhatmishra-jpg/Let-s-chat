import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatContact, ChatThemeId, GeofenceAlert, Message, User } from './types';
import { CHAT_THEMES, INITIAL_CONTACTS, INITIAL_GEOFENCES, INITIAL_MESSAGES } from './data/mockData';
import { SplashLoader } from './components/SplashLoader';
import { AuthModal } from './components/AuthModal';
import { LockScreen } from './components/LockScreen';
import { Sidebar } from './components/Sidebar';
import { ChatRoom } from './components/ChatRoom';
import { CallModal } from './components/CallModal';
import { LocationShareModal } from './components/LocationShareModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { PermissionsModal } from './components/PermissionsModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { ChangePasscodeModal } from './components/ChangePasscodeModal';
import { LocationRadarModal } from './components/LocationRadarModal';
import { ShieldCheck, Smartphone, Monitor, Heart } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('lets_chat_user');
      if (saved) {
        const u = JSON.parse(saved);
        return { ...u, networkMode: u.networkMode || 'online' };
      }
      return null;
    } catch {
      return null;
    }
  });
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lets_chat_user');
      return !!saved;
    } catch {
      return false;
    }
  });
  const [showPermissionsModal, setShowPermissionsModal] = useState<boolean>(() => {
    try {
      const granted = localStorage.getItem('lets_chat_permissions_granted');
      return !granted;
    } catch {
      return true;
    }
  });
  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);
  const [showChangePassModal, setShowChangePassModal] = useState<boolean>(false);
  const [showLocationRadarModal, setShowLocationRadarModal] = useState<boolean>(false);

  const [contacts, setContacts] = useState<ChatContact[]>(INITIAL_CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [themeId, setThemeId] = useState<ChatThemeId>('love-blossom');
  const [geofenceAlerts, setGeofenceAlerts] = useState<GeofenceAlert[]>(INITIAL_GEOFENCES);
  const [activeCall, setActiveCall] = useState<'voice' | 'video' | null>(null);
  const [showThemesModal, setShowThemesModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [deviceFrameMode, setDeviceFrameMode] = useState<'responsive' | 'mobile'>('mobile');

  const currentTheme = CHAT_THEMES.find((t) => t.id === themeId) || CHAT_THEMES[0];
  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];
  const currentMessages = activeContactId ? messagesMap[activeContactId] || [] : [];

  // Automatically mark peer messages as seen after 1.5 seconds (Green dot read receipt)
  useEffect(() => {
    if (!activeContactId) return;
    const timer = setTimeout(() => {
      setMessagesMap((prev) => {
        const msgs = prev[activeContactId] || [];
        let updated = false;
        const newMsgs = msgs.map((m) => {
          if (m.senderId !== currentUser?.id && !m.isSeen) {
            updated = true;
            return { ...m, isSeen: true, seenAt: Date.now() };
          }
          return m;
        });
        if (!updated) return prev;
        return { ...prev, [activeContactId]: newMsgs };
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [activeContactId, messagesMap, currentUser]);

  const handleSignIn = (user: User) => {
    const fullUser: User = { ...user, networkMode: 'online' };
    setCurrentUser(fullUser);
    try {
      localStorage.setItem('lets_chat_user', JSON.stringify(fullUser));
    } catch {}
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('lets_chat_user');
    } catch {}
    setCurrentUser(null);
    setIsLocked(false);
  };

  const handleToggleNetworkMode = (mode: 'online' | 'offline') => {
    if (!currentUser) return;
    const updated = { ...currentUser, networkMode: mode };
    setCurrentUser(updated);
    try {
      localStorage.setItem('lets_chat_user', JSON.stringify(updated));
    } catch {}
  };

  const handleUpdatePasscode = (newPass: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, passcode: newPass };
    setCurrentUser(updated);
    try {
      localStorage.setItem('lets_chat_user', JSON.stringify(updated));
    } catch {}
  };

  const handleConnectSoulmate = (name: string, email: string, phone: string, gender: 'boy' | 'girl') => {
    const avatar = gender === 'girl' 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' 
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250';

    const newContact: ChatContact = {
      id: 'contact-' + Date.now(),
      name: name,
      email: email,
      phone: phone,
      avatar: avatar,
      statusText: `Connected securely on Let's Chat (${gender === 'girl' ? 'Girl 👧' : 'Boy 👦'}) ✨`,
      mood: 'In Love 💖',
      isOnline: true,
      lastSeen: 'Just now',
      unreadCount: 1,
      connectionType: 'gmail'
    };

    setContacts([newContact, ...contacts]);
    setActiveContactId(newContact.id);

    setMessagesMap((prev) => ({
      ...prev,
      [newContact.id]: [
        {
          id: 'm-welcome-' + Date.now(),
          senderId: newContact.id,
          recipientId: currentUser?.id || 'user',
          text: `Hi ${currentUser?.name || 'there'}! Server matched our Gmail (${email}) and phone (${phone}) successfully. Let's start chatting! 💖`,
          timestamp: Date.now(),
          type: 'text',
          isEncrypted: true,
          isSeen: true
        }
      ]
    }));
  };

  const handleSendMessage = (
    text: string,
    type: 'text' | 'image' | 'video' | 'audio' | 'location' = 'text',
    mediaUrl?: string,
    locationData?: any
  ) => {
    if (!activeContactId || !currentUser) return;

    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      senderId: currentUser.id,
      recipientId: activeContactId,
      text,
      timestamp: Date.now(),
      type,
      mediaUrl,
      locationData,
      isEncrypted: true,
      isSeen: false
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));

    // Auto send instant reply for online or offline mesh mode
    const delay = currentUser.networkMode === 'offline' ? 1200 : 2000;
    setTimeout(() => {
      const autoReply: Message = {
        id: 'reply-' + Date.now(),
        senderId: activeContactId,
        recipientId: currentUser.id,
        text: type === 'location'
          ? 'Got your live location! I am viewing your status on Google Maps 🚀'
          : `Received your message in ${currentUser.networkMode.toUpperCase()} mode: "${text}". ❤️`,
        timestamp: Date.now(),
        type: 'text',
        isEncrypted: true,
        isSeen: true
      };
      setMessagesMap((prev) => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), autoReply]
      }));
    }, delay);
  };

  const handleEditMessage = (messageId: string, newText: string) => {
    if (!activeContactId) return;
    setMessagesMap((prev) => ({
      ...prev,
      [activeContactId]: (prev[activeContactId] || []).map((m) =>
        m.id === messageId ? { ...m, text: newText, isEdited: true, editedAt: Date.now() } : m
      )
    }));
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!activeContactId) return;
    setMessagesMap((prev) => ({
      ...prev,
      [activeContactId]: (prev[activeContactId] || []).filter((m) => m.id !== messageId)
    }));
  };

  const handleReactMessage = (messageId: string, emoji: string) => {
    if (!activeContactId) return;
    setMessagesMap((prev) => ({
      ...prev,
      [activeContactId]: (prev[activeContactId] || []).map((m) =>
        m.id === messageId ? { ...m, reaction: m.reaction === emoji ? undefined : emoji } : m
      )
    }));
  };

  const handleUpdateStatus = (newStatus: string, newMood: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      statusText: newStatus,
      mood: newMood
    });
  };

  const handleToggleArchive = (contactId: string) => {
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, isArchived: !c.isArchived } : c));
  };

  return (
    <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* 4-Second Splash Loader on initial boot */}
      <AnimatePresence>
        {isLoading && (
          <SplashLoader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Permissions Modal asked one time */}
      {!isLoading && currentUser && showPermissionsModal && (
        <PermissionsModal onAllowAll={() => setShowPermissionsModal(false)} />
      )}

      {/* Auth Modal if user is not signed in */}
      {!isLoading && !currentUser && (
        <AuthModal
          onSignIn={handleSignIn}
          onConnectSoulmate={handleConnectSoulmate}
        />
      )}

      {/* Lock Screen if app is locked / exited */}
      {!isLoading && currentUser && isLocked && (
        <LockScreen
          correctPasscode={currentUser.passcode}
          onUnlock={() => setIsLocked(false)}
        />
      )}

      {/* Device Frame Viewport Toggle Bar */}
      <div className="w-full bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-rose-200 z-30">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
          <span className="bg-gradient-to-r from-white via-rose-200 to-pink-400 bg-clip-text text-transparent text-sm">
            Let's Chat
          </span>
          <span className="hidden sm:inline text-rose-300/60 font-normal">| Real Connection & Server Matching</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-rose-300 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-rose-400" /> Android App Edition
          </div>

          {currentUser && (
            <button
              onClick={() => setIsLocked(true)}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-rose-300 hover:text-white transition-colors text-xs"
            >
              Lock App
            </button>
          )}
        </div>
      </div>

      {/* Main App Canvas */}
      <div className="flex-1 w-full flex items-center justify-center p-0 md:p-4 overflow-hidden bg-slate-950">
        <motion.div
          layout
          className="w-full h-full max-w-[420px] max-h-[850px] bg-slate-900 shadow-2xl overflow-hidden flex flex-col rounded-[40px] border-4 border-slate-800 my-auto"
        >
          {currentUser && (
            <>
              {/* Sidebar */}
              <div className={`w-full md:w-80 lg:w-96 bg-slate-950 border-r border-slate-800 flex flex-col h-full text-white relative ${activeContactId ? 'hidden md:flex' : 'flex'}`}>
                <Sidebar
                  currentUser={currentUser}
                  contacts={contacts}
                  activeContactId={activeContactId}
                  geofenceAlerts={geofenceAlerts}
                  onSelectContact={setActiveContactId}
                  onOpenThemes={() => setShowThemesModal(true)}
                  onOpenLocation={() => setShowLocationModal(true)}
                  onOpenLocationRadar={() => setShowLocationRadarModal(true)}
                  onOpenSOS={() => setShowSOSModal(true)}
                  onOpenChangePasscode={() => setShowChangePassModal(true)}
                  onLockApp={() => setIsLocked(true)}
                  onLogout={handleLogout}
                  onUpdateStatus={handleUpdateStatus}
                  onAddContactByMatch={handleConnectSoulmate}
                  onToggleNetworkMode={handleToggleNetworkMode}
                  onToggleArchive={handleToggleArchive}
                />
              </div>

              {/* Chat Room */}
              <div className={`flex-1 h-full flex flex-col overflow-hidden bg-slate-950 ${!activeContactId ? 'hidden md:flex' : 'flex'}`}>
                {activeContact ? (
                  <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    className="flex-1 h-full flex flex-col overflow-hidden"
                  >
                    <ChatRoom
                      contact={activeContact}
                      theme={currentTheme}
                      messages={currentMessages}
                      currentUserId={currentUser.id}
                      onBack={() => setActiveContactId(null)}
                      onSendMessage={handleSendMessage}
                      onEditMessage={handleEditMessage}
                      onDeleteMessage={handleDeleteMessage}
                      onReactMessage={handleReactMessage}
                      onStartCall={(type) => setActiveCall(type)}
                      onOpenLocation={() => setShowLocationModal(true)}
                      onOpenThemes={() => setShowThemesModal(true)}
                    />
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
                    <div className="w-20 h-20 bg-rose-500/20 rounded-3xl flex items-center justify-center mb-4 border border-rose-500/30">
                      <Heart className="w-10 h-10 fill-rose-500/40 text-rose-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">Select a Chat or Soulmate</h3>
                    <p className="text-xs text-rose-200/70 max-w-sm">
                      Choose an active real connection from the left sidebar or connect with a new soulmate via server Gmail or phone number matching.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Call Modal */}
      <AnimatePresence>
        {activeCall && activeContact && (
          <CallModal
            contact={activeContact}
            type={activeCall}
            onEndCall={() => setActiveCall(null)}
          />
        )}
      </AnimatePresence>

      {/* Location & Geofencing Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <LocationShareModal
            alerts={geofenceAlerts}
            onClose={() => setShowLocationModal(false)}
            onSendLocation={(loc) => handleSendMessage('Shared Meetup Spot 📍', 'location', undefined, loc)}
          />
        )}
      </AnimatePresence>

      {/* Theme Selector Modal */}
      <AnimatePresence>
        {showThemesModal && (
          <ThemeSelectorModal
            currentThemeId={themeId}
            onSelectTheme={setThemeId}
            onClose={() => setShowThemesModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Emergency SOS Offline Safety Modal */}
      <AnimatePresence>
        {showSOSModal && (
          <EmergencySOSModal
            onClose={() => setShowSOSModal(false)}
            onSendSOSMessage={(sosText, loc) => {
              if (activeContactId) {
                handleSendMessage(sosText, 'location', undefined, loc);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Change Passcode Modal */}
      <AnimatePresence>
        {showChangePassModal && currentUser && (
          <ChangePasscodeModal
            currentPasscode={currentUser.passcode || '1234'}
            onClose={() => setShowChangePassModal(false)}
            onUpdatePasscode={handleUpdatePasscode}
          />
        )}
      </AnimatePresence>

      {/* Location Radar (24hr Google Maps Live Status) Modal */}
      <AnimatePresence>
        {showLocationRadarModal && (
          <LocationRadarModal
            onClose={() => setShowLocationRadarModal(false)}
            onShareLocation={(loc) => handleSendMessage('Shared 24hr Live Location Pin 📍', 'location', undefined, loc)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
