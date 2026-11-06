import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { INITIAL_REPORTS, INITIAL_THREADS } from '../data/mockData';
import { ChatMessage, ChatThread, FortuneReport } from '../types';

interface UserProfile {
  isSignedIn: boolean;
  name: string;
  email: string;
  avatar: string;
}

interface AppState {
  // Economy & User
  hearts: number;
  batteries: number;
  coupons: number;
  user: UserProfile;

  // Bookmarks, Follows & Unlocks
  bookmarkedSkillIds: string[];
  unlockedSkillIds: string[];
  followedCounselorIds: string[];
  recentlyViewedSkillId: string;

  // Chat & Reports
  chatThreads: ChatThread[];
  chatMessagesById: Record<string, ChatMessage[]>;
  currentStepById: Record<string, string>;
  savedReports: FortuneReport[];
  autoReplyEnabled: boolean;
  dismissedAutoTooltip: boolean;

  // Actions
  addHearts: (amount: number) => void;
  spendHearts: (amount: number) => boolean;
  unlockSkill: (skillId: string, cost: number) => boolean;
  toggleBookmarkSkill: (skillId: string) => void;
  toggleFollowCounselor: (counselorId: string) => void;
  setRecentlyViewedSkill: (skillId: string) => void;
  appendChatMessages: (roomId: string, messages: ChatMessage[], nextStepId?: string) => void;
  resetChatRoom: (roomId: string) => void;
  setAutoReplyEnabled: (enabled: boolean) => void;
  dismissAutoTooltip: () => void;
  toggleSignIn: () => void;
  saveReport: (report: FortuneReport) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hearts: 15, // Starts with 15 Hearts so the user can test buying skills immediately or top up
      batteries: 0,
      coupons: 1,
      user: {
        isSignedIn: false,
        name: 'Guest',
        email: 'guest@hellobot.ai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      },

      bookmarkedSkillIds: ['skill-solo-love'],
      unlockedSkillIds: [],
      followedCounselorIds: ['llamama'],
      recentlyViewedSkillId: 'skill-solo-love',

      chatThreads: INITIAL_THREADS,
      chatMessagesById: {},
      currentStepById: {},
      savedReports: INITIAL_REPORTS,
      autoReplyEnabled: false,
      dismissedAutoTooltip: false,

      addHearts: (amount) =>
        set((state) => ({
          hearts: state.hearts + amount,
        })),

      spendHearts: (amount) => {
        const current = get().hearts;
        if (current < amount) {
          return false;
        }
        set({ hearts: current - amount });
        return true;
      },

      unlockSkill: (skillId, cost) => {
        const state = get();
        if (state.unlockedSkillIds.includes(skillId)) {
          return true;
        }
        if (state.hearts < cost) {
          return false;
        }
        set({
          hearts: state.hearts - cost,
          unlockedSkillIds: [...state.unlockedSkillIds, skillId],
        });
        return true;
      },

      toggleBookmarkSkill: (skillId) =>
        set((state) => {
          const exists = state.bookmarkedSkillIds.includes(skillId);
          return {
            bookmarkedSkillIds: exists
              ? state.bookmarkedSkillIds.filter((id) => id !== skillId)
              : [...state.bookmarkedSkillIds, skillId],
          };
        }),

      toggleFollowCounselor: (counselorId) =>
        set((state) => {
          const exists = state.followedCounselorIds.includes(counselorId);
          return {
            followedCounselorIds: exists
              ? state.followedCounselorIds.filter((id) => id !== counselorId)
              : [...state.followedCounselorIds, counselorId],
          };
        }),

      setRecentlyViewedSkill: (skillId) => set({ recentlyViewedSkillId: skillId }),

      appendChatMessages: (roomId, messages, nextStepId) =>
        set((state) => {
          const existing = state.chatMessagesById[roomId] || [];
          const updatedMessages = [...existing, ...messages];
          const lastMsg = updatedMessages[updatedMessages.length - 1];
          const updatedThreads = state.chatThreads.map((t) =>
            t.id === roomId
              ? {
                  ...t,
                  lastMessage: lastMsg?.text || ' Drew a mystic Tarot card',
                  timestamp: 'Just now',
                  unreadCount: 0,
                }
              : t
          );

          return {
            chatMessagesById: {
              ...state.chatMessagesById,
              [roomId]: updatedMessages,
            },
            currentStepById: nextStepId
              ? { ...state.currentStepById, [roomId]: nextStepId }
              : state.currentStepById,
            chatThreads: updatedThreads,
          };
        }),

      resetChatRoom: (roomId) =>
        set((state) => {
          const nextMessages = { ...state.chatMessagesById };
          const nextSteps = { ...state.currentStepById };
          delete nextMessages[roomId];
          delete nextSteps[roomId];
          return {
            chatMessagesById: nextMessages,
            currentStepById: nextSteps,
          };
        }),

      setAutoReplyEnabled: (enabled) => set({ autoReplyEnabled: enabled }),

      dismissAutoTooltip: () => set({ dismissedAutoTooltip: true }),

      toggleSignIn: () =>
        set((state) => ({
          user: state.user.isSignedIn
            ? {
                isSignedIn: false,
                name: 'Guest',
                email: 'guest@hellobot.ai',
                avatar:
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
              }
            : {
                isSignedIn: true,
                name: 'Jisoo Kim',
                email: 'jisoo.kim@hellobot.kr',
                avatar:
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
              },
        })),

      saveReport: (report) =>
        set((state) => {
          const exists = state.savedReports.some((r) => r.id === report.id);
          if (exists) return state;
          return {
            savedReports: [report, ...state.savedReports],
          };
        }),
    }),
    {
      name: 'hellobot-storage-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
