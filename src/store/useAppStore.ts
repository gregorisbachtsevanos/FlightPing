import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppState = {
  contacts: string[];
  message: string;
  autoSend: boolean;
  trackingActive: boolean;
  smsSent: boolean;
  smsError: string | null;
  lastSmsTimestamp: number | null;
};

export type AppActions = {
  setContacts: (contacts: string[]) => void;
  addContact: (phone: string) => void;
  removeContact: (phone: string) => void;
  setMessage: (message: string) => void;
  setAutoSend: (autoSend: boolean) => void;
  setTrackingActive: (active: boolean) => void;
  setSmsSent: (sent: boolean) => void;
  setSmsError: (error: string | null) => void;
  setLastSmsTimestamp: (timestamp: number | null) => void;
  resetSmsState: () => void;
};

const DEFAULT_STATE: AppState = {
  contacts: [],
  message: "I've landed safely ✈️",
  autoSend: true,
  trackingActive: false,
  smsSent: false,
  smsError: null,
  lastSmsTimestamp: null,
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      setContacts: (contacts) => set({ contacts }),

      addContact: (phone) =>
        set((state) => ({
          contacts: state.contacts.includes(phone)
            ? state.contacts
            : [...state.contacts, phone],
        })),

      removeContact: (phone) =>
        set((state) => ({
          contacts: state.contacts.filter((c) => c !== phone),
        })),

      setMessage: (message) => set({ message }),

      setAutoSend: (autoSend) => set({ autoSend }),

      setTrackingActive: (active) => set({ trackingActive: active }),

      setSmsSent: (sent) => set({ smsSent: sent }),

      setSmsError: (error) => set({ smsError: error }),

      setLastSmsTimestamp: (timestamp) => set({ lastSmsTimestamp: timestamp }),

      resetSmsState: () =>
        set({
          smsSent: false,
          smsError: null,
          lastSmsTimestamp: null,
        }),
    }),
    {
      name: 'flightping-storage',
      storage: AsyncStorage,
    }
  )
);
