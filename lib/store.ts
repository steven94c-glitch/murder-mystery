// Uses Upstash Redis if UPSTASH_REDIS_REST_URL is set, else in-memory Map.
// In-memory works for one-evening active use (function stays warm with 3s polling).
// For guaranteed persistence, set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.

import type { GameState } from './types';

const STATE_KEY = 'murder-mystery:state';

const INITIAL_STATE: GameState = {
  phase: 0,
  votes: {},
  votesRevealed: false,
  notes: [],
  activeCharacters: [],
};

// ─── In-memory fallback ──────────────────────────────────────────────────────
// Module-level map persists for the lifetime of the Node process.
const memStore = new Map<string, string>();

// ─── Redis client (lazy) ─────────────────────────────────────────────────────
let redisClient: import('@upstash/redis').Redis | null = null;

async function getRedis(): Promise<import('@upstash/redis').Redis | null> {
  if (!process.env.UPSTASH_REDIS_REST_URL) return null;
  if (redisClient) return redisClient;
  try {
    const { Redis } = await import('@upstash/redis');
    redisClient = Redis.fromEnv();
    return redisClient;
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getState(): Promise<GameState> {
  const redis = await getRedis();
  if (redis) {
    const raw = await redis.get<GameState>(STATE_KEY);
    return raw ?? { ...INITIAL_STATE };
  }
  const raw = memStore.get(STATE_KEY);
  if (!raw) return { ...INITIAL_STATE };
  try {
    return JSON.parse(raw) as GameState;
  } catch {
    return { ...INITIAL_STATE };
  }
}

export async function setState(state: GameState): Promise<void> {
  const redis = await getRedis();
  if (redis) {
    await redis.set(STATE_KEY, JSON.stringify(state));
    return;
  }
  memStore.set(STATE_KEY, JSON.stringify(state));
}

export async function resetState(): Promise<GameState> {
  const fresh: GameState = { ...INITIAL_STATE, notes: [], votes: {} };
  await setState(fresh);
  return fresh;
}
