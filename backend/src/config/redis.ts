// Redis is optional for SQLite version
// Using in-memory cache as fallback

import { logger } from '../utils/logger';

class MemoryCache {
  private cache: Map<string, { value: any; expiry?: number }> = new Map();

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  async set(key: string, value: string, expirySeconds?: number): Promise<void> {
    const expiry = expirySeconds ? Date.now() + expirySeconds * 1000 : undefined;
    this.cache.set(key, { value, expiry });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async quit(): Promise<void> {
    this.cache.clear();
  }
}

let cacheClient: MemoryCache;

export async function initializeRedis(): Promise<MemoryCache> {
  if (cacheClient) {
    return cacheClient;
  }

  cacheClient = new MemoryCache();
  logger.info('In-memory cache initialized (Redis not required for SQLite version)');

  return cacheClient;
}

export function getRedis(): MemoryCache {
  if (!cacheClient) {
    throw new Error('Cache not initialized. Call initializeRedis() first.');
  }
  return cacheClient;
}

export async function closeRedis(): Promise<void> {
  if (cacheClient) {
    await cacheClient.quit();
    logger.info('Cache cleared');
  }
}
