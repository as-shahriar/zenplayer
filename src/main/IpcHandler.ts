import { BrowserWindow, dialog, ipcMain } from 'electron';
import { Channel } from '../constants/appConstants';
import { MainAppService } from './services/MainAppService';

export const ipcHandler = (mainWindow: BrowserWindow) => {
    const appService = new MainAppService();
    ipcMain.removeHandler(Channel.GET_ROOT_FOLDERS);
    ipcMain.handle(Channel.GET_ROOT_FOLDERS, async (_event, search) => {
        return appService.getAllRootEntity(search);
    });

    ipcMain.removeHandler(Channel.GET_CHILDREN);
    ipcMain.handle(Channel.GET_CHILDREN, async (_event, parentId, search) => {
        return appService.getChildren(parentId, search);
    });
    ipcMain.removeHandler(Channel.ADD_FOLDER);
    ipcMain.handle(Channel.ADD_FOLDER, async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        });
        if (!canceled) {
            return appService.uploadFolderDetails(filePaths[0]);
        }
    });

    ipcMain.removeHandler(Channel.GET_ENTITY);
    ipcMain.handle(Channel.GET_ENTITY, async (_event, id) => {
        return appService.getEntity(id);
    });

    ipcMain.removeHandler(Channel.GET_ENTITY_SIBLINGS);
    ipcMain.handle(Channel.GET_ENTITY_SIBLINGS, async (_event, id) => {
        return appService.getEntitySiblings(id);
    });

    ipcMain.removeHandler(Channel.UPDATE_PROGRESS);
    ipcMain.handle(Channel.UPDATE_PROGRESS, async (_event, id, progress) => {
        return appService.updateProgress(id, progress);
    });

    ipcMain.removeHandler(Channel.UPDATE_FAVORITE);
    ipcMain.handle(Channel.UPDATE_FAVORITE, async (_event, id, favorite) => {
        return appService.updateFavorite(id, favorite);
    });

    ipcMain.removeHandler(Channel.GET_ALL_FAVORITES);
    ipcMain.handle(Channel.GET_ALL_FAVORITES, async () => {
        return appService.getAllFavorites();
    });

    ipcMain.removeHandler(Channel.DELETE_ENTITY);
    ipcMain.handle(Channel.DELETE_ENTITY, async (_event, id) => {
        return appService.deleteEntity(id);
    });
};
