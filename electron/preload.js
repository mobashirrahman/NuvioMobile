const { contextBridge, ipcRenderer } = require('electron');

// Expose a safe subset of Electron APIs to the renderer (web app)
contextBridge.exposeInMainWorld('electron', {
    // Receive deep links from main process
    onDeepLink: (callback) => {
        ipcRenderer.on('deep-link', (event, url) => callback(url));
    },
    // Platform info
    platform: process.platform,
    isElectron: true,
});
