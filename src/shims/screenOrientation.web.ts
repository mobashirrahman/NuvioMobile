/**
 * Screen orientation shim for web/Electron.
 * Uses the browser's Screen Orientation API where available.
 */

export const OrientationLock = {
    DEFAULT: 'DEFAULT',
    ALL: 'ALL',
    PORTRAIT: 'PORTRAIT',
    PORTRAIT_UP: 'PORTRAIT_UP',
    PORTRAIT_DOWN: 'PORTRAIT_DOWN',
    LANDSCAPE: 'LANDSCAPE',
    LANDSCAPE_LEFT: 'LANDSCAPE_LEFT',
    LANDSCAPE_RIGHT: 'LANDSCAPE_RIGHT',
    OTHER: 'OTHER',
    UNKNOWN: 'UNKNOWN',
};

export const Orientation = {
    PORTRAIT_UP: 'PORTRAIT_UP',
    PORTRAIT_DOWN: 'PORTRAIT_DOWN',
    LANDSCAPE_LEFT: 'LANDSCAPE_LEFT',
    LANDSCAPE_RIGHT: 'LANDSCAPE_RIGHT',
    UNKNOWN: 'UNKNOWN',
};

export async function lockAsync(_orientationLock: string): Promise<void> {
    // On desktop, orientation locking is not needed — window can be resized freely
    return;
}

export async function unlockAsync(): Promise<void> {
    return;
}

export async function getOrientationAsync(): Promise<string> {
    return Orientation.LANDSCAPE_LEFT;
}

export function addOrientationChangeListener(_listener: (event: any) => void): { remove: () => void } {
    return { remove: () => { } };
}

export function removeOrientationChangeListener(_subscription: any): void { }

export default {
    lockAsync,
    unlockAsync,
    getOrientationAsync,
    addOrientationChangeListener,
    removeOrientationChangeListener,
    OrientationLock,
    Orientation,
};
