import { query } from "./db";

/**
 * Server-side, cookieless product analytics. No consent banner needed because
 * nothing identifies a visitor: we only record our own product events.
 * Replaced by product #3 (factory analytics) once it exists.
 */
export async function track(
  app: string,
  name: string,
  opts: { userId?: number; meta?: Record<string, unknown> } = {}
): Promise<void> {
  try {
    await query(`insert into events (app, name, user_id, meta) values ($1, $2, $3, $4)`, [
      app,
      name,
      opts.userId ?? null,
      JSON.stringify(opts.meta ?? {}),
    ]);
  } catch (e) {
    // Analytics must never take down a request path.
    console.error("track failed", e);
  }
}
