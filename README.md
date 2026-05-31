# Agentic Messaging — Expo MVP

"Lovable for Apple Messages for Business (AMB)." A mobile control plane for creating,
previewing, deploying, and managing AMB agents.

This repo is **only the Expo app side**. The AMB agent/backend (MSP test account, inbound
webhooks, outbound AMB sends, App Clip link generation) is a separate deployment, wired in later.
For now the app runs on a built-in **mock backend** with a **Supabase-backed** implementation
ready to swap in.

## Run it

```bash
npm install
npx expo start          # then press i (iOS simulator) or scan the QR in Expo Go
```

The app runs with **zero configuration** — no env vars needed. Use **Try Demo Mode** on the
welcome screen to skip auth.

## Primary journey

`Messages → App Clip quick setup → full-app review/manage → deploy to test users → test in Messages`

The app makes clear that most agent creation starts inside Apple Messages for Business; once an
agent exists, the app becomes the management console.

## Screens (`src/app/`)

| Route | Screen |
|---|---|
| `index` | Welcome / Sign Up (Continue with Messages, Try Demo Mode) |
| `verify` | Mock 2FA continue/simulate |
| `(app)/agents` | My Agents |
| `(app)/agents/create` | Create Agent |
| `(app)/agents/[id]/generating` | Generating ("magic moment") |
| `(app)/agents/[id]/preview` | Preview (iMessage mockup, edit prompt) |
| `(app)/agents/[id]/review` | Review & Deploy |
| `(app)/agents/[id]/manage` | Manage Agent (control plane) |
| `(app)/agents/[id]/settings` | Edit prompt / guardrails / handoff / integrations / test users |
| `(app)/agents/[id]/conversations` | Conversations (+ `/[cid]` detail) |
| `appclip` | App Clip "Quick Setup" (lightweight internal route) |

## Architecture

- **State:** Zustand + AsyncStorage (`src/store/`) — the reactive source of truth; persists per device.
- **Service layer (`src/services/`):** an `ApiClient` interface (`types.ts`) with two implementations —
  `mockApi.ts` (writes to the store) and `supabaseApi.ts` (Supabase). `index.ts` picks between them.
  Methods map 1:1 to the planned REST endpoints (`POST /agents`, `POST /agents/:id/generate`,
  `POST /agents/:id/deploy`, `POST /app-clip/setup`, …).
- **Deep links (`src/lib/messageLinks.ts`):** builds + opens the AMB Messages URL with prefilled,
  URL-encoded bodies — `LOGIN {code}`, `START_AGENT_SETUP`, `AGENT_SETUP_COMPLETE {id}`,
  `TEST_AGENT {id}`, `REDEPLOY {id}`. Business account constant in `src/lib/constants.ts`.
- **UI (`src/components/`):** Button, Card, Input, Select, Badge, ChatBubble, ProgressSteps,
  AgentCard, ListRow, Screen, Logo. Theme in `src/theme/`.

## Going live on Supabase

1. Create a Supabase project; apply `supabase/migrations/0001_init.sql` (CLI `supabase db push`
   or the SQL editor).
2. Copy `.env.example` → `.env` and set:
   ```
   EXPO_PUBLIC_USE_SUPABASE=true
   EXPO_PUBLIC_SUPABASE_URL=...
   EXPO_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Restart Metro. `src/services/index.ts` now routes through `supabaseApi`.

(RLS is permissive for the single-tenant MVP; tighten once Supabase Auth replaces the mock session.)

## What's mocked

Agent generation, Shopify detection, Apple Pay, CRM integrations, human handoff, analytics,
production deploy, AMB approval status, and conversation data. Real today: navigation, form
capture, local/mock agent CRUD, Messages deep links, and a full demoable flow.

## Next steps

- Wire the separate AMB agent backend to the `ApiClient` endpoints.
- Add a real iOS **App Clip** target via EAS / config plugin (the `appclip` route is the stub).
- TestFlight: add `eas-cli`, run `eas build:configure` (bundle id `com.agenticmessaging.app`),
  build for iOS.
