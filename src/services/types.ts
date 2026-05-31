import type { Agent, AgentDraft, Conversation, Setup } from '@/types/models';

/**
 * The single seam between the app and its backend. Methods map 1:1 to the
 * planned REST endpoints, so going live = swapping the mock implementation
 * for the Supabase/HTTP one (see src/services/index.ts).
 *
 *   POST /auth/messages/start        -> authMessagesStart
 *   POST /auth/messages/verify       -> authMessagesVerify
 *   GET  /agents                     -> listAgents
 *   GET  /agents/:id                 -> getAgent
 *   POST /agents                     -> createAgent
 *   PATCH /agents/:id                -> updateAgent
 *   POST /agents/:id/generate        -> generateAgent
 *   POST /agents/:id/deploy          -> deployAgent
 *   POST /agents/:id/redeploy        -> redeployAgent
 *   GET  /agents/:id/conversations   -> listConversations
 *   POST /app-clip/setup             -> appClipSetup
 *   GET  /setups/:id                 -> getSetup
 */
export interface ApiClient {
  // Auth (mock 2FA via Messages)
  authMessagesStart(handle?: string): Promise<{ code: string; messageBody: string }>;
  authMessagesVerify(handle: string, code: string): Promise<{ ok: boolean }>;

  // Agents
  listAgents(): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | null>;
  createAgent(draft: AgentDraft): Promise<Agent>;
  updateAgent(id: string, patch: Partial<Agent>): Promise<Agent>;
  generateAgent(id: string): Promise<Agent>;
  deployAgent(id: string): Promise<Agent>;
  redeployAgent(id: string): Promise<Agent>;

  // Conversations
  listConversations(agentId: string): Promise<Conversation[]>;

  // App Clip setup
  appClipSetup(payload: Omit<Setup, 'id' | 'createdAt'>): Promise<Setup>;
  getSetup(id: string): Promise<Setup | null>;
}
