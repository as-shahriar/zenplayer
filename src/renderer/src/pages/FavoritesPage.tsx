import { Folder } from '../components/Folder';
import { useEffect, useState } from 'react';
import { EntityModel } from '../../../models/EntityModel';
import { ApiKey } from '../../../constants/appConstants';
import { EntityType } from '../../../models/enums/EntityType';
import { generatePath, useNavigate } from 'react-router-dom';
import { ROUTES } from '../Routes';

export const FavoritesPage = () => {
    const [entityList, setEntityList] = useState<EntityModel[]>([]);
    const navigate = useNavigate();

    const getAll = () => {
        window[ApiKey].getAllFavorites().then((result: EntityModel[]) => {
            setEntityList(result);
        });
    };

    const onClick = (entity: EntityModel) => {
        if (entity.type === EntityType.Folder) {
            const link = generatePath(ROUTES.WATCH_LIST_BY_ID, { id: entity.id });
            navigate(link);
        } else if (entity.type === EntityType.Video) {
            navigate(generatePath(ROUTES.VIDEO, { id: entity.id }));
        }
    };

    const updateFavorite = (id: number, favorite: number) => {
        window[ApiKey].updateFavorite(id, favorite).then(() => {
            setEntityList((prev) => prev.filter((each) => each.id !== id));
        });
    };

    useEffect(() => {
        getAll();
    }, []);

    return (
        <div className="p-3 pb-1">
            <div className="d-flex justify-content-between align-items-center">
                <span className="fs-6">Favorites</span>
            </div>
            <div className="mt-4 pb-2 d-flex flex-wrap gap-4 me-n3 watch-list-content overflow-y-auto">
                {entityList.map((entity) => (
                    <Folder
                        key={entity.id}
                        entity={entity}
                        onClick={() => onClick(entity)}
                        updateFavorite={updateFavorite}
                    />
                ))}
            </div>
        </div>
    );
};
