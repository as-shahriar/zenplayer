import { Folder } from '../components/Folder';
import addFolderIcon from '../assets/icons/add-folder.svg';
import { ApiKey } from '../../../constants/appConstants';
import { useEffect, useState } from 'react';
import { EntityModel } from '../../../models/EntityModel';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import 'plyr-react/plyr.css';
import { ROUTES } from '../Routes';
import videoIcon from '../assets/icons/video.svg';
import folderIcon from '../assets/icons/folder.svg';
import unknownIcon from '../assets/icons/unknown.svg';
import { EntityType } from '../../../models/EntityType';

type WatchListProps = {};

export const WatchListContainer = (props: WatchListProps) => {
    const {} = props;
    const [entityList, setEntityList] = useState<EntityModel[]>([]);
    const { id } = useParams();

    const navigate = useNavigate();
    const onClick = (entity: EntityModel) => {
        if (entity.type === EntityType.Folder) {
            const link = generatePath(ROUTES.WATCH_LIST_BY_ID, { id: entity.id });
            navigate(link);
        } else if (entity.type === EntityType.Video) {
            navigate(generatePath(ROUTES.VIDEO, { id: entity.id }));
        }
    };

    const getNewFolder = () => {
        window[ApiKey].selectFolder().then(() => {
            getAll();
        });
    };
    const getAll = () => {
        window[ApiKey].getRootFolders().then((result: EntityModel[]) => {
            setEntityList(result);
        });
    };

    const renderIcon = (entity: EntityModel) => {
        switch (entity.type) {
            case EntityType.Folder:
                return folderIcon;
            case EntityType.Video:
                return videoIcon;
            default:
                return unknownIcon;
        }
    };

    useEffect(() => {
        if (id) {
            window[ApiKey].getChildren(id).then((result: EntityModel[]) => {
                setEntityList(result);
            });
        } else {
            getAll();
        }
    }, [id]);

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between align-items-center">
                <span>Watch List</span>
                <button className="btn" onClick={getNewFolder}>
                    <img src={addFolderIcon} className="mt-n1 me-2" alt="add-folder" width={22} />
                    New Folder
                </button>
            </div>
            <div className="mt-4 d-flex flex-wrap gap-4">
                {entityList.map((entity) => (
                    <Folder
                        key={entity.id}
                        title={entity.name}
                        onClick={() => onClick(entity)}
                        icon={renderIcon(entity)}
                        progress={entity?.progress || 0}
                    />
                ))}
            </div>
        </div>
    );
};
