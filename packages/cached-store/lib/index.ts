import { type ToolDb, ToolDbStorageAdapter, ToolDbStorageAdapterAdapter } from "tool-db";
import { TTLCache } from "@isaacs/ttlcache";

export default class ToolDbCached extends ToolDbStorageAdapterAdapter {
  private cache

  constructor(storageAdapter: ToolDbStorageAdapter, forceStorageName?: string, maxCacheSize = 1000, maxCacheAge = 1000 * 60 * 60) {
    super(storageAdapter, forceStorageName);
    this.cache = new TTLCache({ max: maxCacheSize, ttl: maxCacheAge });
  }

  public put(key: string, data: string) {
    this.cache.set(key, data);
    return this.storage.put(key, data)
  }

  public get(key: string) {
    return new Promise<string>((resolve, reject) => {
      if (this.cache.has(key)) {
        const data: string = this.cache.get(key);
        resolve(data);
        return;
      } else {
        this.storage.get(key).then((data) => {
          this.cache.set(key, data);
          resolve(data);
          return;
        }).catch((error) => {
          reject(error);
        });
      }
    })
  }

  public query(key: string) {
    // console.warn(this.storageName, "QUERY", key);
    return this.storage.query(key)
  }
}
