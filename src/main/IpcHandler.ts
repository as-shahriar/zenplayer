import { BrowserWindow, dialog, ipcMain } from 'electron';
import { Channel } from '../constants/appConstants';
import { MainAppService } from './services/MainAppService';

export const ipcHandler = (mainWindow: BrowserWindow) => {
    const appService = new MainAppService();

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

    ipcMain.handle(Channel.GET_ENTITY_SIBLINGS, async (_event, id) => {
        return appService.getEntitySiblings(id);
    });

    ipcMain.handle(Channel.UPDATE_PROGRESS, async (_event, id, progress) => {
        return appService.updateProgress(id, progress);
    });

    ipcMain.handle(Channel.UPDATE_FAVORITE, async (_event, id, favorite) => {
        return appService.updateFavorite(id, favorite);
    });

    ipcMain.handle(Channel.GET_ALL_FAVORITES, async () => {
        return appService.getAllFavorites();
    });
};
