import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatContact, ChatTheme, Message } from '../types';
import {
  ArrowLeft, Phone, Video, Send, Image, Mic, MapPin, ShieldCheck,
  MoreVertical, Smile, Edit3, Trash2, Check, X, Sparkles, Radio, Play, Square
} from 'lucide-react';

interface ChatRoomProps {
  contact: ChatContact;
  theme: ChatTheme;
  messages: Message[];
  currentUserId: string;
  onBack: () => void;
  onSendMessage: (text: string, type?: 'text' | 'image' | 'video' | 'audio' | 'location', mediaUrl?: string, locationData?: any) => void;
  onEditMessage: (messageId: string, newText: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactMessage: (messageId: string, emoji: string) => void;
  onStartCall: (type: 'voice' | 'video') => void;
  onOpenLocation: () => void;
  onOpenThemes: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  contact,
  theme,
  messages,
  currentUserId,
  onBack,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onReactMessage,
  onStartCall,
  onOpenLocation,
  onOpenThemes
}) => {
  const [inputText, setInputText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioTimer, setAudioTimer] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);
  const longPressTimerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate real partner typing whenever user types
  useEffect(() => {
    if (inputText.length > 0) {
      setIsPartnerTyping(true);
      const timer = setTimeout(() => {
        setIsPartnerTyping(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsPartnerTyping(false);
    }
  }, [inputText]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Audio recording timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isRecordingAudio) {
      interval = setInterval(() => {
        setAudioTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setAudioTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingAudio]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), 'text');
    setInputText('');
  };

  const handleSendPhotoSample = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522748925119-e70628c2ffc0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
    ];
    const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    onSendMessage('Shared a photo 📸', 'image', randomPhoto);
    setShowAttachMenu(false);
  };

  const handleSendAudioNote = () => {
    setIsRecordingAudio(false);
    onSendMessage('Voice note (0:12) 🎤', 'audio');
  };

  const isWithin15Minutes = (timestamp: number) => {
    const diffMins = (Date.now() - timestamp) / (1000 * 60);
    return diffMins <= 15;
  };

  return (
    <div className={`flex flex-col h-full bg-gradient-to-br ${theme.bgGradient} text-white relative overflow-hidden`}>
      {/* Background glow elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Chat Header */}
      <div className="px-4 py-3.5 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-rose-500/40 shadow-md"
            />
            {/* Active green dot or offline red dot */}
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                contact.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base tracking-tight text-white">{contact.name}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3" /> E2EE
              </span>
            </div>
            <p className="text-xs text-rose-200/70 truncate max-w-[200px] sm:max-w-xs">
              {contact.isOnline ? <span className="text-emerald-400 font-medium">Active now</span> : <span className="text-red-400 font-medium">Offline</span>} • {contact.statusText}
            </p>
          </div>
        </div>

        {/* Clearly visible Video Call, Voice Call, and Chat Options at the top for both chatters */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onStartCall('video')}
            className="p-2.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-200 hover:text-white rounded-xl border border-rose-500/30 transition-all flex items-center gap-1.5 px-3 shadow-sm"
            title="Start Video Call"
          >
            <Video className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-semibold hidden sm:inline">Video Call</span>
          </button>

          <button
            onClick={() => onStartCall('voice')}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-rose-200 hover:text-white rounded-xl border border-white/10 transition-all flex items-center gap-1.5 px-3 shadow-sm"
            title="Start Voice Call"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold hidden sm:inline">Voice</span>
          </button>

          <button
            onClick={onOpenLocation}
            className="p-2.5 text-rose-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            title="Location & Meetup Radar"
          >
            <MapPin className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenThemes}
            className="p-2.5 text-rose-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            title="Select Chat Themes"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Encryption Security Badge */}
        <div className="flex justify-center my-2">
          <div className="px-4 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-full border border-rose-500/20 text-xs text-rose-200/70 flex items-center gap-2 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Messages are end-to-end encrypted. No one outside of this chat can read them.
          </div>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId || msg.senderId === 'user';
          const canEdit = isMe && isWithin15Minutes(msg.timestamp);

          const handleTouchStart = () => {
            longPressTimerRef.current = setTimeout(() => {
              setActiveReactionMsgId(msg.id);
            }, 600); // 600ms long press
          };

          const handleTouchEnd = () => {
            if (longPressTimerRef.current) {
              clearTimeout(longPressTimerRef.current);
            }
          };

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative`}
            >
              <div
                onMouseDown={handleTouchStart}
                onMouseUp={handleTouchEnd}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setActiveReactionMsgId(msg.id);
                }}
                className={`max-w-[80%] sm:max-w-md rounded-3xl p-4 shadow-xl relative cursor-pointer select-none ${
                  isMe ? theme.bubbleUser : theme.bubblePeer
                }`}
              >
                {/* Reaction Emoji Floating Picker on Long Press */}
                {activeReactionMsgId === msg.id && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 border border-rose-500/40 rounded-full px-3 py-1.5 shadow-2xl flex items-center gap-2 z-30 animate-in fade-in zoom-in">
                    {['❤️', '👍', '😂', '🔥', '😍', '✨', '🙏'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={(e) => {
                          e.stopPropagation();
                          onReactMessage(msg.id, emoji);
                          setActiveReactionMsgId(null);
                        }}
                        className="hover:scale-125 transition-transform text-lg p-1"
                      >
                        {emoji}
                      </button>
                    ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveReactionMsgId(null);
                      }}
                      className="text-slate-400 hover:text-white text-xs ml-1 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {/* Media message type */}
                {msg.type === 'image' && msg.mediaUrl && (
                  <div className="mb-2.5 rounded-2xl overflow-hidden shadow-inner border border-white/10">
                    <img src={msg.mediaUrl} alt="Shared attachment" className="w-full h-48 object-cover" />
                  </div>
                )}

                {/* Audio message type */}
                {msg.type === 'audio' && (
                  <div className="flex items-center gap-3 py-1 mb-2">
                    <button className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                    </button>
                    <div className="flex-1">
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden w-36">
                        <div className="bg-white h-full w-2/3 rounded-full" />
                      </div>
                      <span className="text-[10px] opacity-75 mt-0.5 block">Voice Message • 0:12</span>
                    </div>
                  </div>
                )}

                {/* Location message type */}
                {msg.type === 'location' && msg.locationData && (
                  <div className="mb-2 p-3 bg-slate-900/60 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs mb-1">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      Meetup Location Spot
                    </div>
                    <p className="text-xs text-slate-200">{msg.locationData.address}</p>
                    <div className="mt-2 text-[10px] text-rose-200/70 font-mono bg-slate-950 px-2 py-1 rounded-lg">
                      Lat: {msg.locationData.lat}, Lng: {msg.locationData.lng}
                    </div>
                  </div>
                )}

                {/* Editing view vs normal text view */}
                {editingMessageId === msg.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-slate-950/80 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingMessageId(null)}
                        className="px-2.5 py-1 bg-slate-800 text-xs rounded-lg hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (editText.trim()) {
                            onEditMessage(msg.id, editText.trim());
                            setEditingMessageId(null);
                          }
                        }}
                        className="px-2.5 py-1 bg-rose-600 text-xs rounded-lg hover:bg-rose-500 font-semibold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                )}

                {/* Message footer timestamp, seen read receipt dot & actions */}
                <div className={`flex items-center justify-end gap-2 mt-1.5 text-[10px] opacity-70`}>
                  {msg.isEdited && <span className="italic">(edited)</span>}
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    <div className="flex items-center gap-1" title={msg.isSeen ? 'Seen by partner (Green dot)' : 'Sent / Not seen yet (White dot)'}>
                      <span className={`w-2.5 h-2.5 rounded-full ${msg.isSeen ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-white/80'}`} />
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                  )}
                </div>

                {/* Selected Reaction Badge beneath message */}
                {msg.reaction && (
                  <div className={`absolute -bottom-3 ${isMe ? 'right-3' : 'left-3'} bg-slate-900 border border-rose-500/40 text-xs px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 z-10 select-none animate-in fade-in`}>
                    <span>{msg.reaction}</span>
                  </div>
                )}

                {/* Action delete button on hover/always for easy chat deletion */}
                <div className="absolute -top-3 right-2 hidden group-hover:flex items-center gap-1 bg-slate-900 border border-slate-700 shadow-lg rounded-xl p-1 z-20">
                  {isMe && canEdit && (
                    <button
                      onClick={() => { setEditingMessageId(msg.id); setEditText(msg.text); }}
                      className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
                      title="Edit message (within 15 min)"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteMessage(msg.id)}
                    className="p-1 hover:bg-rose-900/50 rounded-lg text-rose-400 hover:text-rose-300"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Real-time typing animation indicator when chatter is typing */}
        {isPartnerTyping && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start items-center gap-2 py-1"
          >
            <div className={`px-4 py-2.5 rounded-2xl ${theme.bubblePeer} flex items-center gap-1.5 shadow-md`}>
              <span className="text-xs text-rose-200 font-medium mr-1">{contact.name} is typing</span>
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachment popover menu */}
      {showAttachMenu && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-20 left-4 bg-slate-900 border border-rose-500/30 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 z-30"
        >
          <button
            onClick={handleSendPhotoSample}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-rose-600/20 text-xs font-semibold text-rose-200 transition-colors text-left"
          >
            <Image className="w-4 h-4 text-rose-400" />
            Send Photo / Video
          </button>
          <button
            onClick={() => { onOpenLocation(); setShowAttachMenu(false); }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-rose-600/20 text-xs font-semibold text-rose-200 transition-colors text-left"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            Share Meetup Location
          </button>
        </motion.div>
      )}

      {/* Audio recording bar overlay */}
      {isRecordingAudio && (
        <div className="px-4 py-3 bg-slate-950/90 border-t border-rose-500/30 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
            <span className="text-xs font-mono text-rose-300">Recording Audio Note... {audioTimer}s</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRecordingAudio(false)}
              className="px-3 py-1.5 bg-slate-800 text-xs rounded-xl hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSendAudioNote}
              className="px-4 py-1.5 bg-gradient-to-r from-rose-600 to-pink-600 text-xs font-semibold rounded-xl text-white shadow-md"
            >
              Send Audio
            </button>
          </div>
        </div>
      )}

      {/* Input Footer */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 flex items-center gap-2 sm:gap-3 z-10">
        <button
          type="button"
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          className="p-3 bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-white rounded-2xl border border-white/10 transition-colors shadow-sm"
          title="Attach photo or location"
        >
          <Image className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type encrypted message..."
            className="w-full bg-slate-900 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors shadow-inner"
          />
          <button
            type="button"
            onClick={() => setIsRecordingAudio(true)}
            className="absolute right-3 top-2.5 p-1.5 text-slate-400 hover:text-rose-400 rounded-xl transition-colors"
            title="Send Fast Audio Note"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        <button
          type="submit"
          className="p-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl shadow-lg shadow-rose-900/40 transition-all cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
