import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { registerRootComponent } from 'expo';
import App from './App';

// Web entry point — Expo uses this instead of index.js when bundling for web
registerRootComponent(App);
