import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userId: string | null;
  stId: string | null;
  setUserId: (id: string) => void;
  setStId: (id: string) => void;
  clearUserId: () => void;
}

const asyncStoragePersist = {
  getItem: async (key: string) => {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  },
  setItem: async (key: string, value: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
};

const useUserStore = create(
  persist<UserState>(
    (set) => ({
      stId: null,
      userId: null,
      setUserId: (id: string) => set({ userId: id }),
      setStId: (id: string) => set({ stId: id }),
      clearUserId: () => set({ userId: null, stId: null }),
    }),
    {
      name: "user-storage",
      storage: asyncStoragePersist,
    }
  )
);

export default useUserStore;
