import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { AgentCard } from '@/components/AgentCard';
import { Button } from '@/components/Button';
import { LogoMark } from '@/components/Logo';
import { useAgentsStore } from '@/store/agentsStore';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, typography } from '@/theme';

export default function MyAgentsScreen() {
  const router = useRouter();
  const agents = useAgentsStore((s) => s.agents);
  const demo = useAuthStore((s) => s.session?.demo);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <Screen
      footer={<Button title="Create New Agent" onPress={() => router.push('/(app)/agents/create')} />}
    >
      <ScreenHeader
        title="My Agents"
        subtitle={demo ? 'Demo Mode' : undefined}
        right={
          <Pressable hitSlop={10} onPress={signOut}>
            <LogoMark size={30} />
          </Pressable>
        }
      />

      {agents.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No agents yet</Text>
          <Text style={styles.emptyBody}>
            Create your first Apple Messages for Business agent to get started.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {agents.map((a) => (
            <AgentCard
              key={a.id}
              agent={a}
              onManage={() => router.push(`/(app)/agents/${a.id}/manage`)}
              onDeploy={() => router.push(`/(app)/agents/${a.id}/review`)}
            />
          ))}
        </View>
      )}

      <Pressable style={styles.quickSetup} onPress={() => router.push('/appclip')}>
        <Text style={styles.quickText}>⚡ Try the App Clip quick-setup flow</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  empty: { backgroundColor: colors.card, borderRadius: 16, padding: spacing.xl, gap: spacing.sm },
  emptyTitle: { ...typography.headline, color: colors.navy },
  emptyBody: { ...typography.subhead, color: colors.textSecondary },
  quickSetup: { alignItems: 'center', paddingVertical: spacing.sm },
  quickText: { ...typography.subhead, color: colors.blue, fontWeight: '600' },
});
