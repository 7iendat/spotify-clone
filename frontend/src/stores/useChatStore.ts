import { axiosInstance } from "@/lib/axois";
import { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
  users: [];
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];
  selectedUser: User | null;

  initSocket: (userId: string) => void;
  disconnectedSocket: () => void;
  sendMessage: (senderId: string, receiverId: string, content: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  fetchUsers: () => Promise<void>;

  setSelectedUser: (user: User | null) => void;
}

const baseUrl = "http://localhost:5000";
const socket = io(baseUrl, {
  autoConnect: false,
  withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,

  initSocket: (userId: string) => {
    if (!get().isConnected) {
      socket.auth = { userId };
      socket.connect();
      socket.emit("user_connected", userId);

      socket.on("user_online", (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      });

      socket.on("activities", (activities: [string, string][]) => {
        set({ userActivities: new Map(activities) });
      });

      socket.on("user_connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });

      socket.on("user_disconnected", (userId: string) => {
        set((state) => {
          const newOnlineUser = new Set(state.onlineUsers);
          newOnlineUser.delete(userId);
          return { onlineUsers: newOnlineUser };
        });
      });

      socket.on("receive_message", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on("message_sent", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on("activity_updated", ({ userId, activity }) => {
        set((state) => {
          const newActivities = new Map(state.userActivities);
          newActivities.set(userId, activity);
          return { userActivities: newActivities };
        });
      });
    }
  },
  disconnectedSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },
  sendMessage: (senderId: string, receiverId: string, content: string) => {
    const socket = get().socket;
    if (!socket) return;

    socket.emit("send_message", { senderId, receiverId, content });
  },

  fetchMessages: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get(`/users/messages/${userId}`);
      set({ messages: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await axiosInstance.get("/users");
      set({ users: users.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user });
  },
}));
