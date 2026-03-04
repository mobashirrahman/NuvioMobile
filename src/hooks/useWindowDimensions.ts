import { useState, useEffect } from 'react';
import { Dimensions, Platform, ScaledSize } from 'react-native';

/**
 * A reactive hook that returns the current window dimensions and updates
 * whenever the user resizes the window (critical for Mac Designed for iPad).
 *
 * On iOS/Android this behaves identically to Dimensions.get('window'),
 * but unlike a module-level Dimensions.get call, this re-renders components
 * when the Mac window is resized by the user.
 */
export function useWindowDimensions(): ScaledSize {
    const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
            setDimensions(window);
        });
        return () => subscription?.remove();
    }, []);

    return dimensions;
}

/**
 * A reactive hook that returns whether the current display should be treated
 * as a tablet/large-screen layout. Updates on window resize.
 *
 * - On iOS: true when Platform.isPad is true (also covers Mac Designed for iPad)
 * - On other platforms: true when smallest dimension >= 768dp
 */
export function useIsTablet(): boolean {
    const { width, height } = useWindowDimensions();

    if (Platform.OS === 'ios') {
        return (Platform as any).isPad === true;
    }
    const smallestDimension = Math.min(width, height);
    return smallestDimension >= 768;
}
