import { app, BrowserWindow, protocol, shell } from 'electron';
import { join } from 'path';
import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { db } from './Repository';
import { ipcHandler } from './IpcHandler';
import contextMenu from 'electron-context-menu';
import { ROUTES } from '../renderer/src/Routes';
import { Channel } from '../constants/appConstants';

function createWindow(): void {
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    });

    ipcHandler(mainWindow);

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron');

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    db.close();
});

// Register the 'file' protocol to allow loading local resources
app.whenReady().then(() => {
    protocol.registerFileProtocol('file', (request, callback) => {
        const url = decodeURIComponent(request.url.replace('file://', ''));
        try {
            return callback(url);
        } catch (e) {
            console.error(e);
            return callback('404');
        }
    });
});
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

contextMenu({
    menu: (actions, _props, browserWindow) => [
        actions.separator(),
        {
            label: 'Settings',
            click: () => {
                (browserWindow as BrowserWindow).webContents.send(
                    Channel.NAVIGATE,
                    ROUTES.SETTINGS
                );
            }
        }
    ]
});
