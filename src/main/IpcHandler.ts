import { BrowserWindow, dialog, ipcMain } from 'electron';
import { Channel } from '../constants/appConstants';
import { AppService } from '../services/AppService';

export const ipcHandler = (mainWindow: BrowserWindow) => {
    const appService = new AppService();

    ipcMain.handle(Channel.GET_ROOT_FOLDERS, async () => {
        return appService.getAllRootEntity();
    });

    ipcMain.handle(Channel.GET_CHILDREN, async (_event, parentId) => {
        return appService.getChildren(parentId);
    });

    ipcMain.handle(Channel.ADD_FOLDER, async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        });
        if (!canceled) {
            return appService.uploadFolderDetails(filePaths[0]);
        }
    });

    ipcMain.handle(Channel.GET_ENTITY, async (_event, id) => {
        return appService.getEntity(id);
    });

    ipcMain.handle(Channel.GET_ENTITY_AND_SIBLING, async (_event, id) => {
        return appService.getEntityAndSibling(id);
    });

    ipcMain.handle(Channel.UPDATE_PROGRESS, async (_event, id, progress) => {
        return appService.updateProgress(id, progress);
    });
};
