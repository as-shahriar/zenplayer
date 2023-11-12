import { Folder } from './Folder';
import addFolderIcon from '../assets/icons/add-folder.svg';
import { ApiKey } from '../../../constants/appConstants';
import { useState } from 'react';
import { FolderDetails } from '../../../models/FolderDetails';

type WatchListProps = {};

export const WatchList = (props: WatchListProps) => {
    const {} = props;
    const [folders, setFolders] = useState<FolderDetails[]>([]);
    const getNewFolder = () => {
        window[ApiKey].selectFolder().then((result) => {
            setFolders([result]);
        });
    };
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <span>Watch List</span>
                <button className="btn" onClick={getNewFolder}>
                    <img src={addFolderIcon} className="mt-n1 me-2" alt="add-folder" width={22} />
                    New Folder
                </button>
            </div>
            <div className="mt-4 d-flex flex-wrap gap-4">
                {folders.map((item, index) => (
                    <Folder key={index} title={item.key} />
                ))}
            </div>
        </div>
    );
};
