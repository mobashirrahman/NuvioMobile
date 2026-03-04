import { Dimensions } from 'react-native';
import { useWindowDimensions } from '../hooks/useWindowDimensions';

const { width, height } = Dimensions.get('window');

// Hero section height - 85% of screen height (matching Apple TV style)
export const HERO_HEIGHT = height * 0.65;

// Screen dimensions (static — use useDimensions() hook for reactive values)
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// Tablet detection (static — use useIsTablet() hook for reactive values)
export const IS_TABLET = width >= 768;

/**
 * Reactive hook — returns live dimensions that update when the Mac window
 * is resized by the user.
 */
export { useWindowDimensions as useDimensions };
