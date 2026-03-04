module.exports = {
    appId: 'com.nuvio.hub',
    productName: 'Nuvio',
    copyright: 'Copyright © 2024 Nuvio',

    // Source files for Electron
    files: [
        'electron/**/*',
        'dist/**/*',
        'assets/icon.png',
        'assets/icon.icns',
        'assets/icon.ico',
        'node_modules/**/*',
        '!node_modules/**/{test,tests,__tests__}/**',
        '!**/ios/**',
        '!**/android/**',
        '!**/src/**',
    ],

    // Output dir
    directories: {
        output: 'release',
    },

    // Linux targets
    linux: {
        target: [
            { target: 'AppImage', arch: ['x64', 'arm64'] },
            { target: 'deb', arch: ['x64', 'arm64'] },
        ],
        category: 'Video',
        icon: 'assets/icon.png',
        desktop: {
            Name: 'Nuvio',
            Comment: 'Your streaming hub',
            Categories: 'Video;AudioVideo;Player;',
        },
    },

    // Windows targets
    win: {
        target: [
            { target: 'nsis', arch: ['x64'] },
        ],
        icon: 'assets/icon.ico',
    },

    // macOS targets (for future use)
    mac: {
        target: [
            { target: 'dmg', arch: ['x64', 'arm64'] },
        ],
        icon: 'assets/icon.icns',
        category: 'public.app-category.entertainment',
    },

    // NSIS installer config (Windows)
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
    },

    // Auto-updater (uses GitHub releases)
    publish: {
        provider: 'github',
        owner: 'mobashirrahman',
        repo: 'NuvioMobile',
        releaseType: 'release',
    },
};
