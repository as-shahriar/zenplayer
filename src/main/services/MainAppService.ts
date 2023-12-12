import * as fs from 'fs';
import * as path from 'path';
import { Repository } from '../Repository';
import { FolderDetails } from '../../models/FolderDetails';
import { EntityModel } from '../../models/EntityModel';
import { EntityType } from '../../models/enums/EntityType';
import { ProcessingItemStatus } from '../../models/enums/ProcessingItemStatus';
import { HelperService } from './HelperService';

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
        if (data) {
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

    getAllRootEntity = () => {
        return this.repository.findAllRoot();
    };

    getChildren = (parentId: number) => {
        return this.repository.findChildren(parentId);
    };

    getEntity = (id: number) => {
        return this.repository.findById(id);
    };

    getEntitySiblings = (id: number) => {
        const res = this.getEntity(id);
        return this.repository.findChildren(res.parent);
    };

    updateProgress = async (id: number, progress: number) => {
        this.repository.addProcessingItem(id);
        return this.repository.updateProgress(id, progress);
    };

    getAllProcessingItemsByStatus = (status: ProcessingItemStatus) => {
        return this.repository.getAllProcessingItemsByStatus(status);
    };

    updateProcessingItem = (id: number, status: number) => {
        return this.repository.updateProcessingItem(id, status);
    };

    syncParents = (id: number, processId: number) => {
        if (id === -1) {
            this.updateProcessingItem(processId, ProcessingItemStatus.COMPLETED);
            return;
        }
        this.updateProcessingItem(processId, ProcessingItemStatus.IN_PROGRESS);
        const item = this.getEntity(id);
        const siblings = this.getChildren(item?.parent);
        let progress = 0;
        for (const each of siblings) {
            progress += each?.progress || 0;
        }
        progress = progress / siblings?.length;
        void this.repository.updateProgress(item.parent, progress);
        this.syncParents(item.parent, processId);
    };

    checkAndRunProcess = (status: ProcessingItemStatus) => {
        const items = this.getAllProcessingItemsByStatus(status);
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
}
