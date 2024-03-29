import * as fs from 'fs';
import * as path from 'path';
import { Repository } from '../Repository';
import { FolderDetails } from '../../models/FolderDetails';
import { EntityModel } from '../../models/EntityModel';
import { EntityType } from '../../models/enums/EntityType';
import { ProcessingItemStatus } from '../../models/enums/ProcessingItemStatus';
import { HelperService } from './HelperService';
import { ProcessingItemType } from '../../models/enums/ProcessingItemType';

export class MainAppService {
    readonly repository: Repository;

    constructor() {
        this.repository = Repository.getInstance();
    }

    getFolderChildren = async (pathName: string) => {
        const rootFolder = path.basename(pathName);
        const getType = (pathName: string) => {
            if (fs.lstatSync(pathName).isDirectory()) {
                return EntityType.Folder;
            } else if (HelperService.validateMedia(pathName)) {
                return EntityType.Video;
            }
            return EntityType.Other;
        };
        const folderDetails: FolderDetails = {
            key: rootFolder,
            path: pathName,
            type: getType(pathName),
            children: []
        };

        const paths = fs.readdirSync(pathName);
        for (const childPath of paths) {
            const childAbsolutePath = path.join(pathName, childPath);
            const type = getType(childAbsolutePath);
            if (type === EntityType.Folder) {
                const childFolderDetails = await this.getFolderChildren(childAbsolutePath);
                folderDetails.children.push(childFolderDetails);
            } else if (type === EntityType.Video) {
                folderDetails.children.push({
                    type,
                    key: childPath,
                    path: childAbsolutePath,
                    children: []
                });
            }
        }
        return folderDetails;
    };

    uploadEachData = (data: FolderDetails, parent: number) => {
        if (
            data.type === EntityType.Video ||
            (data.type === EntityType.Folder && data.children?.length > 0)
        ) {
            const entity: EntityModel = {
                name: data.key,
                path: data.path,
                type: data.type,
                parent,
                id: 1
            };
            const res = this.repository.insert(entity);

            if (data.children?.length > 0) {
                for (const each of data.children) {
                    this.uploadEachData(each, res.lastInsertRowid as number);
                }
            }
        }
    };

    uploadFolderDetails = async (path: string) => {
        const data = await this.getFolderChildren(path);
        this.uploadEachData(data, -1);
    };

    getAllRootEntity = (search?: string) => {
        try {
            return this.repository.findAllRoot(search);
        } catch (err) {
            console.log(err);
        }
        return [];
    };

    getChildren = (parentId: number, search?: string) => {
        try {
            return this.repository.findChildren(parentId, search);
        } catch (err) {
            console.log(err);
        }
        return [];
    };

    getEntity = (id: number) => {
        try {
            return this.repository.findById(id);
        } catch (err) {
            console.log(err);
        }
        return;
    };

    getEntitySiblings = (id: number) => {
        try {
            const res = this.getEntity(id);
            if (res) {
                return this.repository.findChildren(res.parent);
            }
        } catch (err) {
            console.log(err);
        }
        return [];
    };

    updateProgress = async (id: number, progress: number) => {
        try {
            this.repository.addProcessingItem(id, ProcessingItemType.PROGRESS);
            this.repository.updateProgress(id, progress);
        } catch (err) {
            console.log(err);
        }
    };

    getAllProcessingItemsByStatus = (status: ProcessingItemStatus, type: ProcessingItemType) => {
        try {
            return this.repository.getAllProcessingItemsByStatusAndType(status, type);
        } catch (err) {
            console.log(err);
        }
        return [];
    };

    updateProcessingItem = (id: number, status: number) => {
        try {
            this.repository.updateProcessingItem(id, status);
        } catch (err) {
            console.log(err);
        }
    };

    deleteProcessingItem = (id: number) => {
        try {
            this.repository.deleteProcessingItem(id);
        } catch (err) {
            console.log(err);
        }
    };

    syncParents = (id: number, processId: number) => {
        if (id === -1) {
            this.updateProcessingItem(processId, ProcessingItemStatus.COMPLETED);
            return;
        }
        const item = this.getEntity(id);
        if (item === undefined) {
            this.deleteProcessingItem(processId);
        }
        this.updateProcessingItem(processId, ProcessingItemStatus.IN_PROGRESS);
        if (item) {
            const siblings = this.getChildren(item?.parent);
            let progress = 0;
            for (const each of siblings) {
                progress += each?.progress || 0;
            }
            progress = progress / siblings?.length;
            void this.repository.updateProgress(item.parent, progress);
            this.syncParents(item.parent, processId);
        }
    };

    checkAndRunProcess = (status: ProcessingItemStatus) => {
        const items = this.getAllProcessingItemsByStatus(status, ProcessingItemType.PROGRESS);
        items.forEach((item) => {
            this.syncParents(item.id, item.id);
        });
    };

    startBackgroundSync = () => {
        setInterval(() => {
            this.checkAndRunProcess(ProcessingItemStatus.PENDING);
        }, 5000);

        setInterval(() => {
            this.checkAndRunProcess(ProcessingItemStatus.IN_PROGRESS);
        }, 300000);
    };

    updateFavorite = (id: number, favorite: number) => {
        this.repository.updateFavorite(id, favorite);
    };

    getAllFavorites = () => {
        return this.repository.getAllFavorites();
    };

    prepareDeletedChildId = (id: number) => {
        let previousIds = [id];
        const children = this.repository.findChildren(id);
        for (const item of children) {
            const childIds = this.prepareDeletedChildId(item.id);
            previousIds = previousIds.concat(childIds);
        }
        return previousIds;
    };

    deleteEntity = (id: number) => {
        const ids = this.prepareDeletedChildId(id);
        if (id !== -1) {
            const entity = this.repository.findById(id);
            const siblings = this.repository
                .findChildren(entity.parent)
                .filter((item) => item.id !== id);
            if (siblings.length > 0) {
                this.repository.addProcessingItem(siblings[0].id, ProcessingItemType.PROGRESS);
            } else {
                this.repository.addProcessingItem(entity.parent, ProcessingItemType.PROGRESS);
            }
        }
        this.repository.deleteEntities(ids);
    };
}
