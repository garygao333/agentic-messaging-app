/**
 * Lightweight id generator. Avoids a crypto/uuid native dependency for the
 * MVP; ids are only used as local/mock primary keys. When the Supabase
 * service is live, the DB generates real uuids on insert.
 */
let counter = 0;

export function genId(prefix = 'id'): string {
  counter += 1;
  const rand = Math.floor(Math.random() * 1e9).toString(36);
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}${rand}`;
}

/** Six-digit numeric verification code (mock 2FA). */
export function genCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
