/**
 * MMKV shim for web — localStorage-backed with identical API surface.
 * Replaces react-native-mmkv when bundling for web/Electron.
 */

class WebMMKV {
    private prefix: string;

    constructor(id?: string) {
        this.prefix = id ? `mmkv_${id}_` : 'mmkv_';
    }

    private key(k: string): string {
        return `${this.prefix}${k}`;
    }

    set(key: string, value: string | number | boolean): void {
        try {
            localStorage.setItem(this.key(key), JSON.stringify({ v: value }));
        } catch { }
    }

    getString(key: string): string | undefined {
        try {
            const raw = localStorage.getItem(this.key(key));
            if (raw === null) return undefined;
            return JSON.parse(raw).v as string;
        } catch {
            return undefined;
        }
    }

    getNumber(key: string): number | undefined {
        try {
            const raw = localStorage.getItem(this.key(key));
            if (raw === null) return undefined;
            return JSON.parse(raw).v as number;
        } catch {
            return undefined;
        }
    }

    getBoolean(key: string): boolean | undefined {
        try {
            const raw = localStorage.getItem(this.key(key));
            if (raw === null) return undefined;
            return JSON.parse(raw).v as boolean;
        } catch {
            return undefined;
        }
    }

    contains(key: string): boolean {
        return localStorage.getItem(this.key(key)) !== null;
    }

    remove(key: string): void {
        localStorage.removeItem(this.key(key));
    }

    delete(key: string): void {
        this.remove(key);
    }

    getAllKeys(): string[] {
        const keys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(this.prefix)) {
                keys.push(k.slice(this.prefix.length));
            }
        }
        return keys;
    }

    clearAll(): void {
        const toDelete: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(this.prefix)) toDelete.push(k);
        }
        toDelete.forEach(k => localStorage.removeItem(k));
    }
}

export function createMMKV(options?: { id?: string }): WebMMKV {
    return new WebMMKV(options?.id);
}

export const MMKV = WebMMKV;
export default { createMMKV, MMKV };
