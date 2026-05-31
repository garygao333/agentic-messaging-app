import { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { api, useSupabase } from '@/services';
import { useAgentsStore } from '@/store/agentsStore';

export default function AppLayout() {
  const loaded = useRef(false);

  useEffect(() => {
    if (!useSupabase || loaded.current) return;
    loaded.current = true;
    (async () => {
      try {
        const agents = await api.listAgents(); // syncs the store
        // Load conversations so Manage counts / Conversations screens are populated.
        await Promise.all(agents.map((a) => api.listConversations(a.id).catch(() => [])));
      } catch (err) {
        console.warn('[bootstrap] Supabase load failed — is the migration applied?', err);
        useAgentsStore.getState().setAgents([]);
      }
    })();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    />
  );
}
