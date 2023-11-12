import * as fs from 'fs';
import * as path from 'path';
import { FolderDetails } from '../models/FolderDetails';

export class AppService {
    static getFolderChildren = async (pathName: string) => {
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
                const childFolderDetails = await AppService.getFolderChildren(childAbsolutePath);
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

    static getFolderDetails = async (path: string) => {
        return await AppService.getFolderChildren(path);
    };
}
