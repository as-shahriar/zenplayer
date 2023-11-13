import * as fs from 'fs';
import * as path from 'path';
import { Repository } from '../main/Repository';
import { FolderDetails } from '../models/FolderDetails';
import { EntityModel } from '../models/EntityModel';
import { Boolean } from '../models/BooleanParser';

export class AppService {
    readonly repository: Repository;

    constructor() {
        this.repository = new Repository();
    }

    getFolderChildren = async (pathName: string) => {
        const rootFolder = path.basename(pathName);
        const folderDetails: FolderDetails = {
            key: rootFolder,
            path: pathName,
            directory: fs.lstatSync(pathName).isDirectory(),
            children: []
        };

        const paths = fs.readdirSync(pathName);
        for (const childPath of paths) {
            const childAbsolutePath = path.join(pathName, childPath);
            const directory = fs.lstatSync(childAbsolutePath).isDirectory();
            if (directory) {
                const childFolderDetails = await this.getFolderChildren(childAbsolutePath);
                folderDetails.children.push(childFolderDetails);
            } else {
                folderDetails.children.push({
                    directory: false,
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
                directory: Boolean.parseToBoolean(data.directory),
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
}
