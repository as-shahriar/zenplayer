export type FolderDetails = {
    key: string;
    path: string;
    directory: boolean;
    children: FolderDetails[];
};
