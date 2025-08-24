import { create } from "zustand";

interface UpgradeModalStore {
  isOpen: boolean;
  reason?: string;
  action: {
    openModal: (reason?: string) => void;
    closeModal: () => void;
  };
}

export const useUpgradeModalStore = create<UpgradeModalStore>((set) => ({
  isOpen: false,
  reason: undefined,
  action: {
    openModal: (reason?: string) => set({ isOpen: true, reason }),
    closeModal: () => set({ isOpen: false, reason: undefined }),
  },
}));
