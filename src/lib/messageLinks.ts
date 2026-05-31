import { Linking } from 'react-native';
import { AMB_TEST_URL } from './constants';

/**
 * Builders for the prefilled message bodies the AMB agent listens for, plus
 * helpers to construct + open the Messages deep link with proper URL encoding.
 *
 * Example: openMessages(loginBody('123456'))
 *   -> https://bcrw.apple.com/urn:biz:<id>?body=LOGIN%20123456
 */

export const loginBody = (code: string) => `LOGIN ${code}`;
export const startSetupBody = () => `START_AGENT_SETUP`;
export const setupCompleteBody = (setupId: string) => `AGENT_SETUP_COMPLETE ${setupId}`;
export const testAgentBody = (agentId: string) => `TEST_AGENT ${agentId}`;
export const redeployBody = (agentId: string) => `REDEPLOY ${agentId}`;

/** Construct the full Messages URL for a given prefilled body. */
export function buildMessagesUrl(body: string): string {
  return `${AMB_TEST_URL}?body=${encodeURIComponent(body)}`;
}

/** Open Messages with the given prefilled body. Returns the URL it attempted. */
export async function openMessages(body: string): Promise<string> {
  const url = buildMessagesUrl(body);
  try {
    await Linking.openURL(url);
  } catch (err) {
    // Simulators / web won't have Messages — surface for debugging but don't crash.
    console.warn('[messageLinks] could not open Messages:', url, err);
  }
  return url;
}
