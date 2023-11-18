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
    getRootFolders: () => ipcRenderer.invoke(Channel.GET_ROOT_FOLDERS),
    getEntity: (id: number) => ipcRenderer.invoke(Channel.GET_ENTITY, id),
    getChildren: (parentId: number) => ipcRenderer.invoke(Channel.GET_CHILDREN, parentId)
});
