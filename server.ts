import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface ServerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  statusText: string;
  mood: string;
  isOnline: boolean;
  passcode: string;
}

interface ServerMessage {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: number;
  type: 'text' | 'image' | 'video' | 'audio' | 'location';
  mediaUrl?: string;
  locationData?: any;
  isEncrypted: boolean;
  isEdited?: boolean;
}

// In-memory server database initialized with default contacts
const registeredUsers: ServerUser[] = [
  {
    id: 'contact-1',
    name: 'Sophia Vance',
    email: 'sophia.vance@gmail.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    statusText: 'Listening to indie pop & daydreaming ✨',
    mood: 'Romantic 💖',
    isOnline: true,
    passcode: '1234'
  },
  {
    id: 'contact-2',
    name: 'Alex Rivera',
    email: 'alex.rivera@gmail.com',
    phone: '+1 (555) 987-6543',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    statusText: 'Working on code & grabbing coffee ☕',
    mood: 'Focused 💻',
    isOnline: true,
    passcode: '1234'
  },
  {
    id: 'contact-3',
    name: 'Elena Rostova',
    email: 'elena.rostova@gmail.com',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    statusText: 'Traveling through Europe ✈️',
    mood: 'Adventurous 🌍',
    isOnline: false,
    passcode: '1234'
  }
];

const messagesStore: Record<string, ServerMessage[]> = {
  'contact-1': [
    {
      id: 'm1',
      senderId: 'contact-1',
      recipientId: 'user',
      text: 'Hey! Are we still meeting up at Central Park later today?',
      timestamp: Date.now() - 1000 * 60 * 35,
      type: 'text',
      isEncrypted: true
    }
  ]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", serverTime: new Date().toISOString() });
  });

  // Register user on server
  app.post("/api/users/register", (req, res) => {
    const user: ServerUser = req.body;
    if (!user || !user.email) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const existingIndex = registeredUsers.findIndex(u => u.email === user.email || u.phone === user.phone);
    if (existingIndex >= 0) {
      registeredUsers[existingIndex] = { ...registeredUsers[existingIndex], ...user };
    } else {
      registeredUsers.push(user);
    }

    console.log(`[Server] User registered/updated: ${user.name} (${user.email} / ${user.phone})`);
    res.json({ success: true, user });
  });

  // Match user by Gmail or Phone number on server
  app.post("/api/users/match", (req, res) => {
    const { query, type } = req.body; // type: 'gmail' | 'phone'
    if (!query) {
      return res.status(400).json({ error: "Query is required for matching" });
    }

    const cleanQuery = query.trim().toLowerCase();
    const foundUser = registeredUsers.find(u => {
      if (type === 'gmail') {
        return u.email.toLowerCase() === cleanQuery;
      } else {
        // match phone number (ignoring spaces and symbols)
        const cleanUserPhone = u.phone.replace(/[^0-9+]/g, '');
        const cleanInputPhone = cleanQuery.replace(/[^0-9+]/g, '');
        return u.phone.toLowerCase() === cleanQuery || cleanUserPhone.includes(cleanInputPhone);
      }
    });

    if (foundUser) {
      console.log(`[Server] Match found for ${type}: "${query}" -> ${foundUser.name}`);
      res.json({ success: true, user: foundUser });
    } else {
      // If not found in default list, create a simulated dynamic match profile so users can always connect successfully!
      const dynamicUser: ServerUser = {
        id: 'contact-' + Date.now(),
        name: type === 'gmail' ? query.split('@')[0] : 'Soulmate ' + query.slice(-4),
        email: type === 'gmail' ? query : 'matched.' + Date.now() + '@gmail.com',
        phone: type === 'phone' ? query : '+1 (555) 321-9876',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
        statusText: 'Connected via real-time server match ✨',
        mood: 'Excited 💖',
        isOnline: true,
        passcode: '1234'
      };
      registeredUsers.push(dynamicUser);
      console.log(`[Server] Created dynamic server match profile for ${query}`);
      res.json({ success: true, user: dynamicUser });
    }
  });

  app.get("/api/users", (req, res) => {
    res.json({ users: registeredUsers });
  });

  app.get("/api/messages/:contactId", (req, res) => {
    const { contactId } = req.params;
    res.json({ messages: messagesStore[contactId] || [] });
  });

  app.post("/api/messages", (req, res) => {
    const msg: ServerMessage = req.body;
    if (!msg.recipientId) {
      return res.status(400).json({ error: "Recipient ID required" });
    }

    if (!messagesStore[msg.recipientId]) {
      messagesStore[msg.recipientId] = [];
    }
    messagesStore[msg.recipientId].push(msg);
    res.json({ success: true, message: msg });
  });

  // Vite middleware setup for development, static for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Let's Chat running on http://localhost:${PORT}`);
  });
}

startServer();
