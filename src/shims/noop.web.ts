/**
 * Generic no-op shim for mobile-only modules on web.
 * All exports are stubs that do nothing and return safe defaults.
 */

export default {};

// Common export patterns from mobile modules
export const activate = () => { };
export const deactivate = () => { };
export const hide = () => { };
export const show = () => { };
export const setActive = () => { };
export const setBrightness = () => { };
export const getBrightness = async () => 1.0;
export const useKeepAwake = () => { };
export const setString = () => { };
export const getString = () => undefined;
export const setNavigationBarColor = () => { };
export const setImmersiveModeOn = () => { };
export const setImmersiveModeOff = () => { };
export const startActivity = () => { };
export const shareAsync = async () => { };
export const isAvailableAsync = async () => false;
export const GestureStateChangeEvent = {};
export const impactAsync = async () => { };
export const notificationAsync = async () => { };
export const selectionAsync = async () => { };
export const ImpactFeedbackStyle = { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' };
export const NotificationFeedbackType = { Success: 'success', Warning: 'warning', Error: 'error' };
