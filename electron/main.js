const { app, BrowserWindow, shell, protocol, nativeTheme } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_DEV === '1';

// Force dark theme
nativeTheme.themeSource = 'dark';

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        backgroundColor: '#020404',
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
        frame: process.platform !== 'darwin',
        show: false, // Show after ready-to-show for smooth launch
        icon: path.join(__dirname, '../assets/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: true,
            // Allow media autoplay for the video player
            autoplayPolicy: 'no-user-gesture-required',
        },
    });

    // Load the Expo web build or dev server
    if (isDev) {
        const devPort = process.env.EXPO_PORT || 8081;
        mainWindow.loadURL(`http://localhost:${devPort}`);
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // Show window smoothly once ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    // Open external links in system browser, not Electron
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    mainWindow.webContents.on('will-navigate', (event, url) => {
        // Allow navigation within the app (localhost or file://)
        const parsed = new URL(url);
        if (parsed.hostname !== 'localhost' && !url.startsWith('file://')) {
            event.preventDefault();
            shell.openExternal(url);
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Handle deep links (nuvio://)
app.setAsDefaultProtocolClient('nuvio');

// Single instance lock — prevent multiple windows
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
            // Handle deep link from second instance
            const url = commandLine.find(arg => arg.startsWith('nuvio://'));
            if (url) mainWindow.webContents.send('deep-link', url);
        }
    });

    app.whenReady().then(() => {
        createWindow();

        // macOS: re-create window when dock icon clicked
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Handle deep link on macOS (open-url event)
app.on('open-url', (event, url) => {
    event.preventDefault();
    if (mainWindow) {
        mainWindow.webContents.send('deep-link', url);
    }
});
