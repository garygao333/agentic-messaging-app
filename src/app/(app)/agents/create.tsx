import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Input } from '@/components/Input';
import { ChipSelect } from '@/components/Select';
import { Button } from '@/components/Button';
import { api } from '@/services';
import { BUSINESS_TYPES, INTEGRATIONS, type BusinessType, type Integration } from '@/types/models';
import { spacing } from '@/theme';

export default function CreateAgentScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('');
  const [useCase, setUseCase] = useState('');
  const [integrations, setIntegrations] = useState<Integration[]>(['None']);
  const [handoff, setHandoff] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = name.trim().length > 0 && !loading;

  async function generate() {
    setLoading(true);
    try {
      const agent = await api.createAgent({
        name,
        companyName,
        website,
        businessType,
        useCase,
        integrations,
        handoffDestination: handoff,
      });
      router.replace(`/(app)/agents/${agent.id}/generating`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen
      footer={<Button title="Generate Agent" onPress={generate} disabled={!canSubmit} loading={loading} />}
    >
      <ScreenHeader title="Create Agent" subtitle="Tell us about your business." showBack />
      <View style={{ gap: spacing.lg }}>
        <Input label="Agent name" value={name} onChangeText={setName} placeholder="Support Concierge" />
        <Input label="Company name" value={companyName} onChangeText={setCompanyName} placeholder="Acme Inc." />
        <Input
          label="Website"
          value={website}
          onChangeText={setWebsite}
          placeholder="https://acme.com"
          autoCapitalize="none"
          keyboardType="url"
        />
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
        <ChipSelect
          label="Integrations"
          options={[...INTEGRATIONS]}
          value={integrations}
          onChange={(v) => setIntegrations(v as Integration[])}
          multi
        />
        <Input
          label="Human handoff destination"
          value={handoff}
          onChangeText={setHandoff}
          placeholder="support@acme.com or +1…"
          autoCapitalize="none"
        />
      </View>
    </Screen>
  );
}
