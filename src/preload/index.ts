import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { ApiKey, Channel } from '../constants/appConstants';

// Custom APIs for renderer
const api = {};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI);
        contextBridge.exposeInMainWorld('api', api);
        contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}

contextBridge.exposeInMainWorld(ApiKey, {
    selectFolder: () => ipcRenderer.invoke(Channel.ADD_FOLDER),
    getRootFolders: (search?: string) => ipcRenderer.invoke(Channel.GET_ROOT_FOLDERS, search),
    getEntity: (id: number) => ipcRenderer.invoke(Channel.GET_ENTITY, id),
    getEntitySiblings: (id: number) => ipcRenderer.invoke(Channel.GET_ENTITY_SIBLINGS, id),
    getChildren: (parentId: number, search?: string) =>
        ipcRenderer.invoke(Channel.GET_CHILDREN, parentId, search),
    updateProgress: (id, progress) => ipcRenderer.invoke(Channel.UPDATE_PROGRESS, id, progress),
    updateFavorite: (id, favorite) => ipcRenderer.invoke(Channel.UPDATE_FAVORITE, id, favorite),
    getAllFavorites: () => ipcRenderer.invoke(Channel.GET_ALL_FAVORITES),
    deleteEntity: (id: number) => ipcRenderer.invoke(Channel.DELETE_ENTITY, id)
});
