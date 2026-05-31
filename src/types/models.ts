/**
 * Core domain models. These mirror the Supabase table shapes in
 * supabase/migrations/0001_init.sql so the mock and Supabase service
 * implementations stay interchangeable.
 */

export type AgentStatus = 'Draft' | 'Generating' | 'Test Mode' | 'Deployed';
export type ConversationStatus = 'Open' | 'Needs Human' | 'Resolved';
export type TestUserStatus = 'Invited' | 'Active';
export type MessageRole = 'customer' | 'agent';

export const BUSINESS_TYPES = [
  'Shopify / E-commerce',
  'Home Services',
  'Hospitality',
  'Healthcare Intake',
  'General Customer Support',
  'Other',
] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number] | '';

export const INTEGRATIONS = ['None', 'Shopify', 'Apple Pay Demo / Coming Soon'] as const;
export type Integration = (typeof INTEGRATIONS)[number];

export interface TestUser {
  id: string;
  name: string;
  phoneOrAppleId: string;
  status: TestUserStatus;
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: string; // ISO
}

export interface Conversation {
  id: string;
  agentId: string;
  customerName: string;
  lastMessage: string;
  status: ConversationStatus;
  timestamp: string; // ISO
  messages: Message[];
}

export interface Agent {
  id: string;
  name: string;
  companyName: string;
  website: string;
  businessType: BusinessType;
  useCase: string;
  integrations: Integration[];
  prompt: string;
  guardrails: string;
  handoffDestination: string;
  testUsers: TestUser[];
  status: AgentStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  lastDeployedAt: string | null; // ISO
}

/** Draft payload captured by the Create Agent / App Clip forms. */
export type AgentDraft = Partial<
  Pick<
    Agent,
    | 'name'
    | 'companyName'
    | 'website'
    | 'businessType'
    | 'useCase'
    | 'integrations'
    | 'prompt'
    | 'guardrails'
    | 'handoffDestination'
    | 'testUsers'
  >
>;

/** App Clip "Quick Setup" record (POST /app-clip/setup, GET /setups/:id). */
export interface Setup {
  id: string;
  website: string;
  businessType: BusinessType;
  useCase: string;
  testUsers: TestUser[];
  createdAt: string;
  agentId?: string; // set once a draft agent is generated from it
}
