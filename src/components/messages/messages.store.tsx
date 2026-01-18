import { create } from "zustand";

export interface MessagesStore {
  activeConversationId: string | null;
  unreadCounts: Map<string, number>;

  setActiveConversation: (conversationId: string | null) => void;
  incrementUnreadCount: (conversationId: string) => void;
  clearUnreadCount: (conversationId: string) => void;
  getTotalUnreadCount: () => number;
}

export const useMessagesStore = create<MessagesStore>((set, get) => ({
  activeConversationId: null,
  unreadCounts: new Map(),

  setActiveConversation: (conversationId) => {
    set({ activeConversationId: conversationId });
    if (conversationId) {
      get().clearUnreadCount(conversationId);
    }
  },

  incrementUnreadCount: (conversationId) => {
    const { activeConversationId } = get();
    if (conversationId === activeConversationId) return;

    set((state) => {
      const newCounts = new Map(state.unreadCounts);
      const current = newCounts.get(conversationId) ?? 0;
      newCounts.set(conversationId, current + 1);
      return { unreadCounts: newCounts };
    });
  },

  clearUnreadCount: (conversationId) => {
    set((state) => {
      const newCounts = new Map(state.unreadCounts);
      newCounts.delete(conversationId);
      return { unreadCounts: newCounts };
    });
  },

  getTotalUnreadCount: () => {
    const { unreadCounts } = get();
    let total = 0;
    for (const count of unreadCounts.values()) {
      total += count;
    }
    return total;
  },
}));
