const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");
const path = require('path');

const config = getSentryExpoConfig(__dirname);

// Enable tree shaking and better minification
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  minifierConfig: {
    ecma: 8,
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ['console.log', 'console.info', 'console.debug'],
    },
  },
};

// Web platform shims — map native-only modules to web-compatible alternatives
const WEB_SHIMS = {
  // Native storage → localStorage shim
  'react-native-mmkv': path.resolve(__dirname, 'src/shims/mmkv.web.ts'),
  // Native image cache → plain <img>
  '@d11/react-native-fast-image': path.resolve(__dirname, 'src/shims/fastImage.web.tsx'),
  // No-op shims for mobile-only modules
  'expo-haptics': path.resolve(__dirname, 'src/shims/noop.web.ts'),
  'expo-brightness': path.resolve(__dirname, 'src/shims/noop.web.ts'),
  'expo-glass-effect': path.resolve(__dirname, 'src/shims/noop.web.ts'),
  'expo-live-activity': path.resolve(__dirname, 'src/shims/noop.web.ts'),
  'expo-screen-orientation': path.resolve(__dirname, 'src/shims/screenOrientation.web.ts'),
  'expo-keep-awake': path.resolve(__dirname, 'src/shims/noop.web.ts'),
  'expo-navigation-bar': path.resolve(__dirname, 'src/shims/noop.web.ts'),
  'react-native-immersive-mode': path.resolve(__dirname, 'src/shims/noop.web.ts'),
  'react-native-google-cast': path.resolve(__dirname, 'src/shims/noop.web.ts'),
  'react-native-boost': path.resolve(__dirname, 'src/shims/noop.web.ts'),
  '@kesha-antonov/react-native-background-downloader': path.resolve(__dirname, 'src/shims/noop.web.ts'),
  '@adrianso/react-native-device-brightness': path.resolve(__dirname, 'src/shims/noop.web.ts'),
  'expo-sharing': path.resolve(__dirname, 'src/shims/noop.web.ts'),
  'expo-intent-launcher': path.resolve(__dirname, 'src/shims/noop.web.ts'),
  // Blur → CSS backdrop-filter
  '@react-native-community/blur': path.resolve(__dirname, 'src/shims/blur.web.tsx'),
  'expo-blur': path.resolve(__dirname, 'src/shims/blur.web.tsx'),
  // Video → HLS.js + HTML5
  'react-native-video': path.resolve(__dirname, 'src/shims/video.web.tsx'),
};

// Optimize resolver for better tree shaking and SVG support
config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts.filter((ext) => ext !== 'svg'), 'zip'],
  sourceExts: [...config.resolver.sourceExts, 'svg'],
  resolverMainFields: ['react-native', 'browser', 'main'],
  // Apply web shims when bundling for web platform
  resolveRequest: (context, moduleName, platform) => {
    if (platform === 'web' && WEB_SHIMS[moduleName]) {
      return {
        filePath: WEB_SHIMS[moduleName],
        type: 'sourceFile',
      };
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;