/**
 * Apple Messages for Business (AMB) deep-link configuration.
 *
 * The biz id points at the MSP test account. Override via
 * EXPO_PUBLIC_AMB_BIZ_ID without touching code.
 */
const DEFAULT_BIZ_ID = '914e49f4-2b03-4e2b-987f-8c8f45e40294';

export const AMB_BIZ_ID = process.env.EXPO_PUBLIC_AMB_BIZ_ID ?? DEFAULT_BIZ_ID;

/** Base "open in Messages" URL for the business account. */
export const AMB_TEST_URL = `https://bcrw.apple.com/urn:biz:${AMB_BIZ_ID}`;
