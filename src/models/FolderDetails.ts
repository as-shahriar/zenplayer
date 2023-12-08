import { EntityType } from './enums/EntityType';

export type FolderDetails = {
    key: string;
    path: string;
    type: EntityType;
    children: FolderDetails[];
};
