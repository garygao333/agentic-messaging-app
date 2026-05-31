import type { ApiClient } from './types';
import type { Agent, AgentDraft, Setup } from '@/types/models';
import { useAgentsStore } from '@/store/agentsStore';
import { genCode, genId } from '@/lib/id';
import { loginBody } from '@/lib/messageLinks';
import { generatedFields } from '@/lib/generate';

/** Artificial latency so loading states feel real. */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

const store = () => useAgentsStore.getState();

function buildAgent(draft: AgentDraft): Agent {
  const ts = now();
  return {
    id: genId('agent'),
    name: draft.name?.trim() || 'Untitled Agent',
    companyName: draft.companyName?.trim() || '',
    website: draft.website?.trim() || '',
    businessType: draft.businessType || '',
    useCase: draft.useCase?.trim() || '',
    integrations: draft.integrations?.length ? draft.integrations : ['None'],
    prompt: draft.prompt || '',
    guardrails: draft.guardrails || '',
    handoffDestination: draft.handoffDestination || '',
    testUsers: draft.testUsers || [],
    status: 'Draft',
    createdAt: ts,
    updatedAt: ts,
    lastDeployedAt: null,
  };
}

function requireAgent(id: string): Agent {
  const a = store().agents.find((x) => x.id === id);
  if (!a) throw new Error(`Agent ${id} not found`);
  return a;
}

export const mockApi: ApiClient = {
  async authMessagesStart(handle) {
    await delay(200);
    const code = genCode();
    return { code, messageBody: loginBody(code) };
  },

  async authMessagesVerify(_handle, _code) {
    await delay(400);
    // Mock: any code is accepted. Real impl verifies the code was texted to AMB.
    return { ok: true };
  },

  async listAgents() {
    await delay(150);
    return store().agents;
  },

  async getAgent(id) {
    await delay(120);
    return store().agents.find((a) => a.id === id) ?? null;
  },

  async createAgent(draft) {
    await delay(300);
    const agent = buildAgent(draft);
    store().upsertAgent(agent);
    return agent;
  },

  async updateAgent(id, patch) {
    await delay(200);
    const updated: Agent = { ...requireAgent(id), ...patch, id, updatedAt: now() };
    store().upsertAgent(updated);
    return updated;
  },

  async generateAgent(id) {
    await delay(2400);
    const agent = requireAgent(id);
    const updated: Agent = {
      ...agent,
      ...generatedFields(agent),
      status: 'Draft',
      updatedAt: now(),
    };
    store().upsertAgent(updated);
    return updated;
  },

  async deployAgent(id) {
    await delay(1200);
    const ts = now();
    const updated: Agent = {
      ...requireAgent(id),
      status: 'Test Mode',
      lastDeployedAt: ts,
      updatedAt: ts,
    };
    store().upsertAgent(updated);
    return updated;
  },

  async redeployAgent(id) {
    await delay(1200);
    const ts = now();
    const updated: Agent = { ...requireAgent(id), lastDeployedAt: ts, updatedAt: ts };
    store().upsertAgent(updated);
    return updated;
  },

  async listConversations(agentId) {
    await delay(200);
    return store().conversations.filter((c) => c.agentId === agentId);
  },

  async appClipSetup(payload) {
    await delay(300);
    const setup: Setup = { ...payload, id: genId('setup'), createdAt: now() };
    store().upsertSetup(setup);
    return setup;
  },

  async getSetup(id) {
    await delay(120);
    return store().setups.find((s) => s.id === id) ?? null;
  },
};
