export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  statusText: string;
  mood: string;
  isOnline: boolean;
  passcode: string;
  networkMode: 'online' | 'offline'; // real online server or offline peer mesh
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: number;
  type: 'text' | 'image' | 'video' | 'audio' | 'location';
  mediaUrl?: string;
  audioDuration?: number;
  isEncrypted: boolean;
  isEdited?: boolean;
  editedAt?: number;
  isSeen?: boolean; // Green dot if seen, white dot if not seen
  seenAt?: number;
  locationData?: {
    lat: number;
    lng: number;
    address: string;
  };
  reactions?: string[];
  reaction?: string;
}

export interface ChatContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  statusText: string;
  mood: string;
  isOnline: boolean;
  lastSeen: string;
  unreadCount: number;
  connectionType: 'gmail' | 'phone';
  isArchived?: boolean;
}

export type ChatThemeId = 'love-blossom' | 'sakura-blossom' | 'rose-gold' | 'velvet-heart' | 'neon-pulse' | 'midnight-velvet' | 'royal-amethyst' | 'emerald-aura' | 'golden-sunset' | 'cosmic-starlight' | 'mystic-aurora' | 'crimson-passion';

export interface ChatTheme {
  id: ChatThemeId;
  name: string;
  bgGradient: string;
  bubbleUser: string;
  bubblePeer: string;
  textColor: string;
  accentColor: string;
  previewColor: string;
}

export interface GeofenceAlert {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  read: boolean;
}
