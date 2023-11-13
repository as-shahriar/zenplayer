import { Folder } from './Folder';
import addFolderIcon from '../assets/icons/add-folder.svg';
import { ApiKey } from '../../../constants/appConstants';
import { useEffect, useState } from 'react';
import { EntityModel } from '../../../models/EntityModel';
import { useParams } from 'react-router-dom';

type WatchListProps = {};

export const WatchList = (props: WatchListProps) => {
    const {} = props;
    const [entity, setEntity] = useState<EntityModel[]>([]);
    let { id } = useParams();
    const getNewFolder = () => {
        window[ApiKey].selectFolder().then(() => {
            getAll();
        });
    };
    const getAll = () => {
        window[ApiKey].getRootFolders().then((result: EntityModel[]) => {
            setEntity(result);
        });
    };
    useEffect(() => {
        if (id) {
            window[ApiKey].getChildren(id).then((result: EntityModel[]) => {
                setEntity(result);
            });
        } else {
            getAll();
        }
    }, [id]);

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
                {entity.map((item) => (
                    <Folder key={item.id} title={item.name} id={item.id} />
                ))}
            </div>
        </div>
    );
};
