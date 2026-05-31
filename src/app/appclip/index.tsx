import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Input } from '@/components/Input';
import { ChipSelect } from '@/components/Select';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { ChatBubble, SuggestedActions } from '@/components/ChatBubble';
import { LogoMark } from '@/components/Logo';
import { api } from '@/services';
import { useAuthStore } from '@/store/authStore';
import { BUSINESS_TYPES, type BusinessType, type TestUser, type Agent } from '@/types/models';
import { previewFor } from '@/lib/generate';
import { genId } from '@/lib/id';
import { setupCompleteBody, openMessages } from '@/lib/messageLinks';
import { colors, radius, spacing, typography } from '@/theme';

type Step = 'welcome' | 'website' | 'usecase' | 'testers' | 'preview';
const ORDER: Step[] = ['welcome', 'website', 'usecase', 'testers', 'preview'];

export default function AppClipSetup() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const signInDemo = useAuthStore((s) => s.signInDemo);

  const [step, setStep] = useState<Step>('welcome');
  const [website, setWebsite] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('');
  const [useCase, setUseCase] = useState('');
  const [testers, setTesters] = useState<TestUser[]>([]);
  const [testerName, setTesterName] = useState('');
  const [testerHandle, setTesterHandle] = useState('');

  const [generating, setGenerating] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [setupId, setSetupId] = useState<string | null>(null);

  const idx = ORDER.indexOf(step);
  const next = () => setStep(ORDER[Math.min(idx + 1, ORDER.length - 1)]);
  const back = () => (idx === 0 ? router.back() : setStep(ORDER[idx - 1]));

  function addTester() {
    if (!testerName.trim()) return;
    setTesters((t) => [
      ...t,
      { id: genId('tu'), name: testerName.trim(), phoneOrAppleId: testerHandle.trim(), status: 'Invited' },
    ]);
    setTesterName('');
    setTesterHandle('');
  }

  async function generate() {
    setGenerating(true);
    try {
      const setup = await api.appClipSetup({ website, businessType, useCase, testUsers: testers });
      setSetupId(setup.id);
      const draft = await api.createAgent({
        name: businessType ? `${businessType.split(' ')[0]} Agent` : 'Test Agent',
        website,
        businessType,
        useCase,
        testUsers: testers,
      });
      const generated = await api.generateAgent(draft.id);
      await api.appClipSetup({ ...setup, agentId: generated.id }); // record linkage
      setAgent(generated);
      setStep('preview');
    } finally {
      setGenerating(false);
    }
  }

  function continueInApp() {
    if (!agent) return;
    if (!session) signInDemo(); // App Clip users land in the app without full auth
    router.replace(`/(app)/agents/${agent.id}/preview`);
  }

  const preview = previewFor(businessType);

  return (
    <Screen footer={renderFooter()}>
      <View style={styles.clipTag}>
        <LogoMark size={20} />
        <Text style={styles.clipTagText}>App Clip · Quick Setup</Text>
      </View>

      {step === 'welcome' && (
        <View style={styles.center}>
          <ScreenHeader title="Create a test Messages for Business agent" />
          <Text style={styles.body}>
            Answer a few quick questions and we’ll generate a working test agent you can preview in
            seconds — no install required.
          </Text>
        </View>
      )}

      {step === 'website' && (
        <>
          <ScreenHeader title="Your website" subtitle="Step 2 of 4" showBack />
          <Input
            label="Company website"
            value={website}
            onChangeText={setWebsite}
            placeholder="https://acme.com"
            autoCapitalize="none"
            keyboardType="url"
          />
        </>
      )}

      {step === 'usecase' && (
        <>
          <ScreenHeader title="What should it do?" subtitle="Step 3 of 4" showBack />
          <ChipSelect
            label="Business type"
            options={[...BUSINESS_TYPES]}
            value={businessType}
            onChange={(v) => setBusinessType(v as BusinessType)}
          />
          <Input
            label="Use case"
            value={useCase}
            onChangeText={setUseCase}
            placeholder="Order tracking, returns, product questions…"
            multiline
          />
        </>
      )}

      {step === 'testers' && (
        <>
          <ScreenHeader title="Add test users" subtitle="Step 4 of 4" showBack />
          <Input label="Name" value={testerName} onChangeText={setTesterName} placeholder="Jordan Lee" />
          <Input
            label="Phone or Apple ID"
            value={testerHandle}
            onChangeText={setTesterHandle}
            placeholder="+1… or name@email.com"
            autoCapitalize="none"
          />
          <Button title="Add test user" variant="secondary" onPress={addTester} />
          <View style={styles.testerList}>
            {testers.map((t) => (
              <View key={t.id} style={styles.testerRow}>
                <Text style={styles.testerName}>{t.name || t.phoneOrAppleId}</Text>
                <Badge label={t.status} />
              </View>
            ))}
          </View>
        </>
      )}

      {step === 'preview' && agent && (
        <>
          <ScreenHeader title="Preview" subtitle={agent.name} />
          <View style={styles.phone}>
            <View style={styles.phoneBar}>
              <Text style={styles.phoneTitle}>{agent.name}</Text>
              <Text style={styles.phoneSub}>Apple Messages for Business</Text>
            </View>
            <View style={styles.thread}>
              <ChatBubble role="customer" text="Hi, I need help with an order." />
              <ChatBubble role="agent" text={preview.agent} />
              <SuggestedActions actions={preview.actions} />
            </View>
          </View>
          <Text style={styles.body}>
            Your test agent is ready. Continue in the Agentic Messaging app to review, customize,
            and deploy it.
          </Text>
        </>
      )}
    </Screen>
  );

  function renderFooter() {
    if (step === 'welcome')
      return (
        <>
          <Button title="Get started" onPress={next} />
          <Button title="Return to Messages" variant="ghost" onPress={() => router.back()} />
        </>
      );
    if (step === 'website') return <Button title="Continue" onPress={next} disabled={!website.trim()} />;
    if (step === 'usecase') return <Button title="Continue" onPress={next} disabled={!businessType} />;
    if (step === 'testers')
      return <Button title="Generate preview" onPress={generate} loading={generating} />;
    // preview
    return (
      <>
        <Button title="Continue in Agentic Messaging App" onPress={continueInApp} />
        <Button
          title="Return to Messages"
          variant="ghost"
          onPress={() => openMessages(setupCompleteBody(setupId ?? 'setup'))}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  clipTag: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'center' },
  clipTagText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  center: { gap: spacing.md },
  body: { ...typography.body, color: colors.textSecondary },
  testerList: { gap: spacing.sm },
  testerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  testerName: { ...typography.body, color: colors.text },
  phone: {
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  phoneBar: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardBorder,
    gap: 2,
  },
  phoneTitle: { ...typography.headline, color: colors.navy },
  phoneSub: { ...typography.caption, color: colors.textSecondary },
  thread: { padding: spacing.md, gap: 2 },
});
