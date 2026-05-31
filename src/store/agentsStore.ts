import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Agent, Conversation, Setup } from '@/types/models';
import { seedAgents, seedConversations } from '@/data/seed';
import { useSupabaseBackend } from '@/lib/runtime';

/**
 * Reactive source of truth for the UI. The mock service layer
 * (src/services/mockApi.ts) reads and writes this store so screens update
 * automatically. When the Supabase service is live it hydrates this same
 * store on app start, keeping screens unchanged.
 */
interface AgentsState {
  agents: Agent[];
  conversations: Conversation[];
  setups: Setup[];
  hydrated: boolean;

  seedIfEmpty: () => void;
  setAgents: (agents: Agent[]) => void;
  upsertAgent: (agent: Agent) => void;
  removeAgent: (id: string) => void;
  setConversations: (c: Conversation[]) => void;
  replaceConversationsFor: (agentId: string, list: Conversation[]) => void;
  upsertSetup: (s: Setup) => void;
}

export const useAgentsStore = create<AgentsState>()(
  persist(
    (set, get) => ({
      agents: [],
      conversations: [],
      setups: [],
      hydrated: false,

      seedIfEmpty: () => {
        // Live Supabase mode loads real data on startup; don't inject demo rows.
        if (useSupabaseBackend) return;
        if (get().agents.length === 0) {
          set({ agents: seedAgents(), conversations: seedConversations() });
        }
      },
      replaceConversationsFor: (agentId, list) =>
        set((state) => ({
          conversations: [
            ...state.conversations.filter((c) => c.agentId !== agentId),
            ...list,
          ],
        })),
      setAgents: (agents) => set({ agents }),
      upsertAgent: (agent) =>
        set((state) => {
          const idx = state.agents.findIndex((a) => a.id === agent.id);
          if (idx === -1) return { agents: [agent, ...state.agents] };
          const next = state.agents.slice();
          next[idx] = agent;
          return { agents: next };
        }),
      removeAgent: (id) =>
        set((state) => ({
          agents: state.agents.filter((a) => a.id !== id),
          conversations: state.conversations.filter((c) => c.agentId !== id),
        })),
      setConversations: (conversations) => set({ conversations }),
      upsertSetup: (s) =>
        set((state) => {
          const idx = state.setups.findIndex((x) => x.id === s.id);
          if (idx === -1) return { setups: [s, ...state.setups] };
          const next = state.setups.slice();
          next[idx] = s;
          return { setups: next };
        }),
    }),
    {
      name: 'agentic-agents-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ agents, conversations, setups }) => ({ agents, conversations, setups }),
      onRehydrateStorage: () => (state) => {
        state?.seedIfEmpty();
        useAgentsStore.setState({ hydrated: true });
      },
    },
  ),
);

// Selectors
export const selectAgent = (id: string) => (s: AgentsState) =>
  s.agents.find((a) => a.id === id);
export const selectConversationsFor = (agentId: string) => (s: AgentsState) =>
  s.conversations.filter((c) => c.agentId === agentId);
