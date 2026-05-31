import type { ApiClient } from './types';
import type { Agent, AgentDraft, Conversation, Setup } from '@/types/models';
import { getSupabase } from './supabaseClient';
import { useAgentsStore } from '@/store/agentsStore';
import { genCode } from '@/lib/id';
import { loginBody } from '@/lib/messageLinks';
import { generatedFields } from '@/lib/generate';

/** Keep the reactive store in sync so screens (which read the store) update. */
const store = () => useAgentsStore.getState();

/**
 * Supabase-backed implementation of ApiClient. Inert until
 * EXPO_PUBLIC_SUPABASE_* env vars are set (see supabaseClient.ts) and the
 * schema in supabase/migrations/0001_init.sql is applied.
 *
 * Nested collections (integrations, testUsers, messages) are stored as jsonb
 * columns so rows map 1:1 to the domain models with no joins.
 */
const now = () => new Date().toISOString();

function client() {
  const c = getSupabase();
  if (!c) throw new Error('Supabase is not configured (set EXPO_PUBLIC_SUPABASE_* env vars)');
  return c;
}

/* ---------- row <-> model mappers ---------- */

function rowToAgent(r: any): Agent {
  return {
    id: r.id,
    name: r.name,
    companyName: r.company_name ?? '',
    website: r.website ?? '',
    businessType: r.business_type ?? '',
    useCase: r.use_case ?? '',
    integrations: r.integrations ?? ['None'],
    prompt: r.prompt ?? '',
    guardrails: r.guardrails ?? '',
    handoffDestination: r.handoff_destination ?? '',
    testUsers: r.test_users ?? [],
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    lastDeployedAt: r.last_deployed_at,
  };
}

function agentToRow(a: Partial<Agent>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (a.id !== undefined) row.id = a.id;
  if (a.name !== undefined) row.name = a.name;
  if (a.companyName !== undefined) row.company_name = a.companyName;
  if (a.website !== undefined) row.website = a.website;
  if (a.businessType !== undefined) row.business_type = a.businessType;
  if (a.useCase !== undefined) row.use_case = a.useCase;
  if (a.integrations !== undefined) row.integrations = a.integrations;
  if (a.prompt !== undefined) row.prompt = a.prompt;
  if (a.guardrails !== undefined) row.guardrails = a.guardrails;
  if (a.handoffDestination !== undefined) row.handoff_destination = a.handoffDestination;
  if (a.testUsers !== undefined) row.test_users = a.testUsers;
  if (a.status !== undefined) row.status = a.status;
  if (a.createdAt !== undefined) row.created_at = a.createdAt;
  if (a.updatedAt !== undefined) row.updated_at = a.updatedAt;
  if (a.lastDeployedAt !== undefined) row.last_deployed_at = a.lastDeployedAt;
  return row;
}

function rowToConversation(r: any): Conversation {
  return {
    id: r.id,
    agentId: r.agent_id,
    customerName: r.customer_name,
    lastMessage: r.last_message ?? '',
    status: r.status,
    timestamp: r.timestamp,
    messages: r.messages ?? [],
  };
}

function rowToSetup(r: any): Setup {
  return {
    id: r.id,
    website: r.website ?? '',
    businessType: r.business_type ?? '',
    useCase: r.use_case ?? '',
    testUsers: r.test_users ?? [],
    createdAt: r.created_at,
    agentId: r.agent_id ?? undefined,
  };
}

async function fetchAgent(id: string): Promise<Agent> {
  const { data, error } = await client().from('agents').select('*').eq('id', id).single();
  if (error) throw error;
  return rowToAgent(data);
}

/* ---------- ApiClient ---------- */

export const supabaseApi: ApiClient = {
  async authMessagesStart() {
    const code = genCode();
    return { code, messageBody: loginBody(code) };
  },

  async authMessagesVerify() {
    // Verification of the texted code happens in the AMB backend, not here.
    return { ok: true };
  },

  async listAgents() {
    const { data, error } = await client()
      .from('agents')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    const agents = (data ?? []).map(rowToAgent);
    store().setAgents(agents);
    return agents;
  },

  async getAgent(id) {
    const { data, error } = await client().from('agents').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const agent = rowToAgent(data);
    store().upsertAgent(agent);
    return agent;
  },

  async createAgent(draft: AgentDraft) {
    const ts = now();
    const row = agentToRow({
      name: draft.name?.trim() || 'Untitled Agent',
      companyName: draft.companyName ?? '',
      website: draft.website ?? '',
      businessType: draft.businessType ?? '',
      useCase: draft.useCase ?? '',
      integrations: draft.integrations?.length ? draft.integrations : ['None'],
      prompt: draft.prompt ?? '',
      guardrails: draft.guardrails ?? '',
      handoffDestination: draft.handoffDestination ?? '',
      testUsers: draft.testUsers ?? [],
      status: 'Draft',
      createdAt: ts,
      updatedAt: ts,
      lastDeployedAt: null,
    });
    const { data, error } = await client().from('agents').insert(row).select('*').single();
    if (error) throw error;
    const agent = rowToAgent(data);
    store().upsertAgent(agent);
    return agent;
  },

  async updateAgent(id, patch) {
    const { data, error } = await client()
      .from('agents')
      .update(agentToRow({ ...patch, updatedAt: now() }))
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    const agent = rowToAgent(data);
    store().upsertAgent(agent);
    return agent;
  },

  async generateAgent(id) {
    const agent = await fetchAgent(id);
    return this.updateAgent(id, { ...generatedFields(agent), status: 'Draft' });
  },

  async deployAgent(id) {
    const ts = now();
    return this.updateAgent(id, { status: 'Test Mode', lastDeployedAt: ts });
  },

  async redeployAgent(id) {
    return this.updateAgent(id, { lastDeployedAt: now() });
  },

  async listConversations(agentId) {
    const { data, error } = await client()
      .from('conversations')
      .select('*')
      .eq('agent_id', agentId)
      .order('timestamp', { ascending: false });
    if (error) throw error;
    const list = (data ?? []).map(rowToConversation);
    store().replaceConversationsFor(agentId, list);
    return list;
  },

  async appClipSetup(payload) {
    const row = {
      website: payload.website,
      business_type: payload.businessType,
      use_case: payload.useCase,
      test_users: payload.testUsers,
      created_at: now(),
      agent_id: payload.agentId ?? null,
    };
    const { data, error } = await client().from('setups').insert(row).select('*').single();
    if (error) throw error;
    const setup = rowToSetup(data);
    store().upsertSetup(setup);
    return setup;
  },

  async getSetup(id) {
    const { data, error } = await client().from('setups').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? rowToSetup(data) : null;
  },
};
