import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { colors, spacing, typography } from '@/theme';
import type { Agent } from '@/types/models';

export function AgentCard({
  agent,
  onManage,
  onDeploy,
}: {
  agent: Agent;
  onManage: () => void;
  onDeploy: () => void;
}) {
  const deployLabel = agent.status === 'Draft' ? 'Deploy' : 'Redeploy';
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text style={styles.name}>{agent.name}</Text>
          {agent.companyName ? (
            <Text style={styles.company}>{agent.companyName}</Text>
          ) : null}
        </View>
        <Badge label={agent.status} />
      </View>
      <View style={styles.actions}>
        <Button title="Manage" variant="secondary" onPress={onManage} style={styles.flex} />
        <Button title={deployLabel} variant="primary" onPress={onDeploy} style={styles.flex} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md },
  titleCol: { flex: 1, gap: 2 },
  name: { ...typography.headline, color: colors.navy },
  company: { ...typography.subhead, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  flex: { flex: 1 },
});
