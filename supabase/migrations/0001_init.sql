-- Agentic Messaging — initial schema
--
-- Mirrors src/types/models.ts. Nested collections (integrations, test_users,
-- messages) are stored as jsonb so rows map 1:1 to the domain models with no
-- joins, keeping the mock and Supabase service implementations interchangeable.
--
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL editor.

-- ---------- enums ----------
do $$ begin
  create type agent_status as enum ('Draft', 'Generating', 'Test Mode', 'Deployed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type conversation_status as enum ('Open', 'Needs Human', 'Resolved');
exception when duplicate_object then null; end $$;

-- ---------- agents ----------
create table if not exists public.agents (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  company_name        text not null default '',
  website             text not null default '',
  business_type       text not null default '',
  use_case            text not null default '',
  integrations        jsonb not null default '["None"]'::jsonb,
  prompt              text not null default '',
  guardrails          text not null default '',
  handoff_destination text not null default '',
  test_users          jsonb not null default '[]'::jsonb,
  status              agent_status not null default 'Draft',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  last_deployed_at    timestamptz
);

-- ---------- conversations ----------
create table if not exists public.conversations (
  id            uuid primary key default gen_random_uuid(),
  agent_id      uuid not null references public.agents(id) on delete cascade,
  customer_name text not null,
  last_message  text not null default '',
  status        conversation_status not null default 'Open',
  timestamp     timestamptz not null default now(),
  messages      jsonb not null default '[]'::jsonb
);
create index if not exists conversations_agent_id_idx on public.conversations (agent_id);

-- ---------- app clip setups ----------
create table if not exists public.setups (
  id            uuid primary key default gen_random_uuid(),
  website       text not null default '',
  business_type text not null default '',
  use_case      text not null default '',
  test_users    jsonb not null default '[]'::jsonb,
  created_at    timestamptz not null default now(),
  agent_id      uuid references public.agents(id) on delete set null
);

-- ---------- RLS ----------
-- Permissive for the MVP (single-tenant demo). Tighten to per-user / per-org
-- policies once Supabase Auth is wired in (see authStore.ts).
alter table public.agents        enable row level security;
alter table public.conversations enable row level security;
alter table public.setups        enable row level security;

do $$ begin
  create policy "mvp_all_agents"        on public.agents        for all using (true) with check (true);
  create policy "mvp_all_conversations" on public.conversations for all using (true) with check (true);
  create policy "mvp_all_setups"        on public.setups        for all using (true) with check (true);
exception when duplicate_object then null; end $$;
