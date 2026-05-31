import type { Agent, BusinessType } from '@/types/models';

/**
 * Mock agent generation. Stands in for the real backend
 * POST /agents/:id/generate. Produces a system prompt, guardrails, and a
 * sample preview conversation tailored to the business type.
 */

const PREVIEW_BY_TYPE: Record<string, { agent: string; actions: string[] }> = {
  'Shopify / E-commerce': {
    agent: 'I can help with that. Would you like to track an order, start a return, or talk to a human?',
    actions: ['Track order', 'Start return', 'Talk to an agent'],
  },
  'Home Services': {
    agent: 'Happy to help. Want to book a visit, get a quote, or reschedule an appointment?',
    actions: ['Book a visit', 'Get a quote', 'Reschedule'],
  },
  Hospitality: {
    agent: 'Welcome! Would you like to make a reservation, check availability, or ask about amenities?',
    actions: ['Reservation', 'Availability', 'Amenities'],
  },
  'Healthcare Intake': {
    agent: 'I can help you get started. Would you like to schedule an appointment or complete intake?',
    actions: ['Schedule', 'Start intake', 'Talk to staff'],
  },
};

const DEFAULT_PREVIEW = {
  agent: 'I can help with that. Would you like to track an order, start a return, or talk to a human?',
  actions: ['Track order', 'Start return', 'Talk to an agent'],
};

export function previewFor(businessType: BusinessType) {
  return PREVIEW_BY_TYPE[businessType] ?? DEFAULT_PREVIEW;
}

export function defaultPrompt(a: {
  name?: string;
  companyName?: string;
  businessType?: BusinessType;
  useCase?: string;
}): string {
  const company = a.companyName || 'the company';
  const type = a.businessType || 'customer support';
  const useCase = a.useCase ? ` Focus area: ${a.useCase}.` : '';
  return (
    `You are ${a.name || 'a helpful assistant'}, the Apple Messages for Business agent for ${company} ` +
    `(${type}).${useCase} Greet customers warmly, understand their request, and offer clear ` +
    `suggested actions. Keep replies short and friendly. Escalate to a human when the customer ` +
    `asks, is frustrated, or the request is outside your scope.`
  );
}

export function defaultGuardrails(): string {
  return (
    '• Never share internal pricing, discounts, or refunds beyond published policy.\n' +
    '• Do not collect payment card numbers in chat.\n' +
    '• Hand off to a human for legal, medical, or billing disputes.\n' +
    '• Stay on topic; politely decline unrelated requests.'
  );
}

/** Fields the generator fills in on an agent draft. */
export function generatedFields(agent: Agent): Partial<Agent> {
  return {
    prompt: agent.prompt || defaultPrompt(agent),
    guardrails: agent.guardrails || defaultGuardrails(),
    handoffDestination: agent.handoffDestination || 'support@company.com',
  };
}

/** Steps shown on the Generating screen. */
export const GENERATION_STEPS = [
  'Creating welcome flow',
  'Generating suggested actions',
  'Adding guardrails',
  'Configuring human handoff',
  'Preparing test deployment',
] as const;
