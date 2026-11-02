interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  retrievedAt: string;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<any>>();
  private hits = 0;
  private misses = 0;
  private evictions = 0;

  get<T>(key: string): { data: T; isCached: true; retrievedAt: string } | null {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.evictions++;
      this.misses++;
      return null;
    }
    this.hits++;
    return { data: entry.data, isCached: true, retrievedAt: entry.retrievedAt };
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    // Prevent unbounded memory growth in long sessions
    if (this.store.size > 200) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) {
        this.store.delete(oldestKey);
        this.evictions++;
      }
    }

    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
      retrievedAt: new Date().toISOString(),
    });
  }

  getStats() {
    const totalRequests = this.hits + this.misses;
    const hitRatePercent = totalRequests > 0 ? ((this.hits / totalRequests) * 100).toFixed(1) : "0.0";
    return {
      entriesCount: this.store.size,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      totalRequests,
      hitRatePercent: `${hitRatePercent}%`,
    };
  }
}

// Global singleton across serverless invocations if supported
const globalCache = new MemoryCache();

export default globalCache;
