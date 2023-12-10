import { Folder } from '../components/Folder';
import { ApiKey } from '../../../constants/appConstants';
import { useEffect, useState } from 'react';
import { EntityModel } from '../../../models/EntityModel';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import 'plyr-react/plyr.css';
import { ROUTES } from '../Routes';
import { EntityType } from '../../../models/enums/EntityType';
import { AddButton } from '../components/AddButton';
import { useRoutesMatch } from '../hooks/useRoutesMatch';

export const WatchListPage = () => {
    const [entityList, setEntityList] = useState<EntityModel[]>([]);
    const { id } = useParams();
    const isHome = useRoutesMatch(ROUTES.HOME);
    const navigate = useNavigate();

    const onClick = (entity: EntityModel) => {
        if (entity.type === EntityType.Folder) {
            const link = generatePath(ROUTES.WATCH_LIST_BY_ID, { id: entity.id });
            navigate(link);
        } else if (entity.type === EntityType.Video) {
            navigate(generatePath(ROUTES.VIDEO, { id: entity.id }));
        }
    };

    const getAll = () => {
        window[ApiKey].getRootFolders().then((result: EntityModel[]) => {
            setEntityList(result);
        });
    };

    const deleteEntity = (id: number) => {
        console.log(id);
    };

    const updateFavorite = (id: number, favorite: number) => {
        window[ApiKey].updateFavorite(id, favorite).then(() => {
            setEntityList((prev) => {
                return prev.map((each) => {
                    if (each.id === id) {
                        const temp = structuredClone(each);
                        temp.favorite = favorite;
                        return temp;
                    }
                    return each;
                });
            });
        });
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
        <div className="p-3 pb-1">
            <div className="d-flex justify-content-between align-items-center">
                <span className="fs-6">Watch List</span>
            </div>
            <div className="mt-4 pb-2 d-flex flex-wrap gap-4 me-n3 watch-list-content overflow-y-auto">
                {entityList.map((entity) => (
                    <Folder
                        key={entity.id}
                        entity={entity}
                        onClick={() => onClick(entity)}
                        updateFavorite={updateFavorite}
                        deleteEntity={deleteEntity}
                    />
                ))}
            </div>
            {isHome && <AddButton refreshList={getAll} />}
        </div>
    );
};
