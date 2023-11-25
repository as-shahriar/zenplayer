import * as fs from 'fs';
import * as path from 'path';
import { Repository } from '../main/Repository';
import { FolderDetails } from '../models/FolderDetails';
import { EntityModel } from '../models/EntityModel';
import { EntityType } from '../models/EntityType';

export class AppService {
    readonly repository: Repository;

    constructor() {
        this.repository = new Repository();
    }

    getFolderChildren = async (pathName: string) => {
        const rootFolder = path.basename(pathName);
        const getType = (pathName: string) => {
            if (fs.lstatSync(pathName).isDirectory()) {
                return EntityType.Folder;
            } else if (pathName.endsWith('.mp4')) {
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
            } else {
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
        // console.log(data);
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

    getEntityAndSibling = (id: number) => {
        const res = this.repository.findById(id);
        return this.repository.findChildren(res.parent);
    };

    updateProgress = (id: number, progress: number) => {
        return this.repository.updateProgress(id, progress);
    };
}
