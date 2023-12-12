import { ApiKey } from '../../../constants/appConstants';
import { EntityModel } from '../../../models/EntityModel';

export class AppService {
    static getRootFolders(): Promise<EntityModel[]> {
        return window[ApiKey].getRootFolders();
    }

    static getChildren(id: string): Promise<EntityModel[]> {
        return window[ApiKey].getChildren(id);
    }

    static updateFavorite(id: number, favorite: number) {
        return window[ApiKey].updateFavorite(id, favorite);
    }

    static getAllFavorites(): Promise<EntityModel[]> {
        return window[ApiKey].getAllFavorites();
    }

    static updateProgress(id: number, progress: number) {
        return window[ApiKey].updateProgress(id, progress);
    }

    static getEntitySiblings(id: string): Promise<EntityModel[]> {
        return window[ApiKey].getEntitySiblings(id);
    }

    static getEntity(id: string): Promise<EntityModel> {
        return window[ApiKey].getEntity(id);
    }
}
