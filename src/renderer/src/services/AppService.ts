import { ApiKey } from '../../../constants/appConstants';
import { EntityModel } from '../../../models/EntityModel';

export class AppService {
    static getRootFolders(search?: string): Promise<EntityModel[]> {
        return window[ApiKey].getRootFolders(search);
    }

    static getChildren(id: string, search?: string): Promise<EntityModel[]> {
        return window[ApiKey].getChildren(id, search);
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

    static deleteEntity(id: number): Promise<EntityModel> {
        return window[ApiKey].deleteEntity(id);
    }
}
