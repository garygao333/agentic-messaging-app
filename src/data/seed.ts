import type { Agent, Conversation } from '@/types/models';
import { defaultGuardrails, defaultPrompt } from '@/lib/generate';

/**
 * Initial demo content. Seeded into the store on first launch so the app
 * looks alive in Demo Mode and for TestFlight reviewers.
 */

const minsAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();

const SHOPIFY_ID = 'agent_shopify_demo';
const DTC_ID = 'agent_dtc_support';

export function seedAgents(): Agent[] {
  const shopify: Agent = {
    id: SHOPIFY_ID,
    name: 'Shopify Store Demo',
    companyName: 'Northbeam Goods',
    website: 'https://northbeam.example.com',
    businessType: 'Shopify / E-commerce',
    useCase: 'Order tracking, returns, and product questions',
    integrations: ['Shopify'],
    prompt: defaultPrompt({
      name: 'Shopify Store Demo',
      companyName: 'Northbeam Goods',
      businessType: 'Shopify / E-commerce',
      useCase: 'Order tracking, returns, and product questions',
    }),
    guardrails: defaultGuardrails(),
    handoffDestination: 'support@northbeam.example.com',
    testUsers: [
      { id: 'tu_1', name: 'Jordan Lee', phoneOrAppleId: '+15125550101', status: 'Active' },
      { id: 'tu_2', name: 'Priya Shah', phoneOrAppleId: 'priya@northbeam.example.com', status: 'Invited' },
    ],
    status: 'Deployed',
    createdAt: minsAgo(60 * 24 * 6),
    updatedAt: minsAgo(120),
    lastDeployedAt: minsAgo(180),
  };

  const dtc: Agent = {
    id: DTC_ID,
    name: 'DTC Support Agent',
    companyName: 'Quanta Audio',
    website: 'https://quanta.example.com',
    businessType: 'General Customer Support',
    useCase: 'Pre-sales questions and warranty support for keyboards & audio gear',
    integrations: ['None'],
    prompt: defaultPrompt({
      name: 'DTC Support Agent',
      companyName: 'Quanta Audio',
      businessType: 'General Customer Support',
      useCase: 'Pre-sales and warranty support',
    }),
    guardrails: defaultGuardrails(),
    handoffDestination: 'care@quanta.example.com',
    testUsers: [
      { id: 'tu_3', name: 'Sam Rivera', phoneOrAppleId: '+13105550199', status: 'Active' },
    ],
    status: 'Test Mode',
    createdAt: minsAgo(60 * 24 * 2),
    updatedAt: minsAgo(45),
    lastDeployedAt: minsAgo(60 * 5),
  };

  return [shopify, dtc];
}

export function seedConversations(): Conversation[] {
  return [
    {
      id: 'conv_1',
      agentId: DTC_ID,
      customerName: 'Carlos White',
      lastMessage: "I recently got the KB067 Lite and it's amazing…",
      status: 'Open',
      timestamp: minsAgo(8),
      messages: [
        { id: 'm1', role: 'customer', text: "I recently got the KB067 Lite and it's amazing, but one key feels loose.", timestamp: minsAgo(9) },
        { id: 'm2', role: 'agent', text: 'Glad you love it! Sorry about the loose key. Would you like to start a warranty claim or see a quick fix guide?', timestamp: minsAgo(8) },
      ],
    },
    {
      id: 'conv_2',
      agentId: DTC_ID,
      customerName: 'Mecati Koku',
      lastMessage: 'I just want something compact and quiet for both typing and gaming…',
      status: 'Needs Human',
      timestamp: minsAgo(26),
      messages: [
        { id: 'm3', role: 'customer', text: 'I just want something compact and quiet for both typing and gaming. What do you recommend?', timestamp: minsAgo(28) },
        { id: 'm4', role: 'agent', text: 'The KB067 Lite is our most compact quiet board. Want me to connect you with a product specialist for gaming-specific advice?', timestamp: minsAgo(27) },
        { id: 'm5', role: 'customer', text: 'Yes please, I have a few specific questions.', timestamp: minsAgo(26) },
      ],
    },
    {
      id: 'conv_3',
      agentId: DTC_ID,
      customerName: 'Tiago Alexandrino',
      lastMessage: 'Will do, thanks again!',
      status: 'Resolved',
      timestamp: minsAgo(95),
      messages: [
        { id: 'm6', role: 'customer', text: 'My order arrived early, appreciate it.', timestamp: minsAgo(100) },
        { id: 'm7', role: 'agent', text: "That's great to hear! Reach out anytime if you need anything else.", timestamp: minsAgo(97) },
        { id: 'm8', role: 'customer', text: 'Will do, thanks again!', timestamp: minsAgo(95) },
      ],
    },
  ];
}
