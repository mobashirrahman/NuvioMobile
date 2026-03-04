/**
 * localStorage-backed MMKVStorage for web/Electron.
 * Drop-in replacement for src/services/mmkvStorage.ts when platform === 'web'.
 * 
 * Metro picks this file automatically via the .web.ts extension.
 */

import { logger } from '../utils/logger';

const PREFIX = 'nuvio_';

class WebMMKVStorage {
    private static instance: WebMMKVStorage;
    private cache = new Map<string, { value: any; timestamp: number }>();
    private readonly CACHE_TTL = 30000;
    private readonly MAX_CACHE_SIZE = 100;

    private constructor() { }

    public static getInstance(): WebMMKVStorage {
        if (!WebMMKVStorage.instance) {
            WebMMKVStorage.instance = new WebMMKVStorage();
        }
        return WebMMKVStorage.instance;
    }

    private k(key: string): string {
        return `${PREFIX}${key}`;
    }

    private getCached(key: string): string | null {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            return cached.value;
        }
        if (cached) this.cache.delete(key);
        return null;
    }

    private setCached(key: string, value: any): void {
        if (this.cache.size >= this.MAX_CACHE_SIZE) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) this.cache.delete(firstKey);
        }
        this.cache.set(key, { value, timestamp: Date.now() });
    }

    async getItem(key: string): Promise<string | null> {
        try {
            const cached = this.getCached(key);
            if (cached !== null) return cached;
            const value = localStorage.getItem(this.k(key));
            if (value !== null) this.setCached(key, value);
            return value;
        } catch (error) {
            logger.error(`[WebStorage] Error getting ${key}:`, error);
            return null;
        }
    }

    async setItem(key: string, value: string): Promise<void> {
        try {
            localStorage.setItem(this.k(key), value);
            this.setCached(key, value);
        } catch (error) {
            logger.error(`[WebStorage] Error setting ${key}:`, error);
        }
    }

    async removeItem(key: string): Promise<void> {
        try {
            localStorage.removeItem(this.k(key));
            this.cache.delete(key);
        } catch (error) {
            logger.error(`[WebStorage] Error removing ${key}:`, error);
        }
    }

    async getAllKeys(): Promise<string[]> {
        try {
            return Object.keys(localStorage)
                .filter(k => k.startsWith(PREFIX))
                .map(k => k.slice(PREFIX.length));
        } catch {
            return [];
        }
    }

    async multiGet(keys: string[]): Promise<[string, string | null][]> {
        return Promise.all(keys.map(async k => [k, await this.getItem(k)] as [string, string | null]));
    }

    async multiSet(pairs: [string, string][]): Promise<void> {
        for (const [k, v] of pairs) await this.setItem(k, v);
    }

    async multiRemove(keys: string[]): Promise<void> {
        for (const k of keys) await this.removeItem(k);
    }

    async clear(): Promise<void> {
        try {
            const keys = await this.getAllKeys();
            keys.forEach(k => localStorage.removeItem(this.k(k)));
            this.cache.clear();
        } catch (error) {
            logger.error('[WebStorage] Error clearing:', error);
        }
    }

    // Direct access methods (matching MMKV API)
    getString(key: string): string | undefined {
        return localStorage.getItem(this.k(key)) ?? undefined;
    }

    setString(key: string, value: string): void {
        localStorage.setItem(this.k(key), value);
    }

    getNumber(key: string): number | undefined {
        const v = localStorage.getItem(this.k(key));
        return v !== null ? Number(v) : undefined;
    }

    setNumber(key: string, value: number): void {
        localStorage.setItem(this.k(key), String(value));
    }

    getBoolean(key: string): boolean | undefined {
        const v = localStorage.getItem(this.k(key));
        return v !== null ? v === 'true' : undefined;
    }

    setBoolean(key: string, value: boolean): void {
        localStorage.setItem(this.k(key), String(value));
    }

    contains(key: string): boolean {
        return localStorage.getItem(this.k(key)) !== null;
    }

    delete(key: string): void {
        localStorage.removeItem(this.k(key));
    }
}

export const mmkvStorage = WebMMKVStorage.getInstance();
