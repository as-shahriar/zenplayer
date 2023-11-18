import { EntityType } from './EntityType';

export type FolderDetails = {
    key: string;
    path: string;
    type: EntityType;
    children: FolderDetails[];
};
