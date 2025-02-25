import {
  type ToolDb,
  type ToolDbStorageAdapter,
  ToolDbStorageAdapterAdapter
} from 'tool-db'
import TTLCache from '@isaacs/ttlcache'

export default class ToolDbCached extends ToolDbStorageAdapterAdapter {
  private getCache: TTLCache<string, string>
  private queryCacheKeysToRemove: Set<string> = new Set()
  private queryCache: TTLCache<string, string[]>

  constructor(
    storageAdapter: ToolDbStorageAdapter,
    forceStorageName?: string,
    maxCacheSize = 1000,
    maxCacheAge = 1000 * 60 * 60
  ) {
    super(storageAdapter, forceStorageName)
    this.getCache = new TTLCache({ max: maxCacheSize, ttl: maxCacheAge })
    this.queryCache = new TTLCache({ max: maxCacheSize, ttl: maxCacheAge })
  }

  public async put(key: string, data: string): Promise<void> {
    this.getCache.set(key, data)
    this.queryCacheKeysToRemove.add(key)
    return this.storage.put(key, data) as Promise<void>
  }

  public async get(key: string): Promise<string> {
    if (this.getCache.has(key)) {
      return this.getCache.get(key) || ''
    }
    const data = await this.storage.get(key)
    this.getCache.set(key, data)
    return data
  }

  public async query(key: string): Promise<string[]> {
    if (this.removeStaleQueryCacheKeys(key) && this.queryCache.has(key)) {
      return this.queryCache.get(key) || []
    }
    const data = await this.storage.query(key)
    this.queryCache.set(key, data)
    return data
  }

  private removeStaleQueryCacheKeys(keyPrefix: string): boolean {
    const keysToDelete: string[] = Array.from(
      this.queryCacheKeysToRemove
    ).filter((aKey) => aKey.startsWith(keyPrefix))
    if (keysToDelete.length > 0) {
      for (const aKey of keysToDelete) {
        this.queryCacheKeysToRemove.delete(aKey)
      }
      this.queryCache.delete(keyPrefix)
    }
    return keysToDelete.length <= 0
  }
}
