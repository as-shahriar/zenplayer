import { BrowserWindow, dialog, ipcMain } from 'electron';
import { Channel } from '../constants/appConstants';
import { AppService } from '../services/AppService';

export const ipcHandler = (mainWindow: BrowserWindow) => {
    const appService = new AppService();

    ipcMain.handle(Channel.GET_ROOT_FOLDERS, async () => {
        return appService.getAllRootEntity();
    });

    ipcMain.handle(Channel.ADD_FOLDER, async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        });
        if (!canceled) {
            return appService.uploadFolderDetails(filePaths[0]);
        }
    });
};
