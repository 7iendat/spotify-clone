import { axiosInstance } from "@/lib/axois";
import { create } from "zustand";

interface AuthStore {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;

  checkAdminStats: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: false,
  isLoading: false,
  error: null,

  checkAdminStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/check");

      set({ isAdmin: response.data.isAdmin });
    } catch (error: any) {
      set({ isAdmin: error.response.data.message });
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  reset: async () => {},
}));
