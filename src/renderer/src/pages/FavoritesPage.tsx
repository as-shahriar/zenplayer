import { Folder } from '../components/Folder';
import { EntityModel } from '../../../models/EntityModel';
import { QUERY_KEYS } from '../../../constants/appConstants';
import { EntityType } from '../../../models/enums/EntityType';
import { generatePath, useNavigate } from 'react-router-dom';
import { ROUTES } from '../Routes';
import { useQuery } from 'react-query';
import { AppService } from '../services/AppService';

export const FavoritesPage = () => {
    const navigate = useNavigate();

    const { data: entityList = [], refetch } = useQuery(
        [QUERY_KEYS.GET_ALL_FAVORITE_ENTITY],
        AppService.getAllFavorites,
        {
            staleTime: 0
        }
    );

    const onClick = (entity: EntityModel) => {
        if (entity.type === EntityType.Folder) {
            const link = generatePath(ROUTES.WATCH_LIST_BY_ID, { id: entity.id });
            navigate(link);
        } else if (entity.type === EntityType.Video) {
            navigate(generatePath(ROUTES.VIDEO, { id: entity.id }));
        }
    };

    const updateFavorite = (id: number, favorite: number) => {
        AppService.updateFavorite(id, favorite).then(() => refetch());
    };

    return (
        <div className="p-3 pb-1">
            <div className="d-flex justify-content-between align-items-center">
                <span className="fs-6">Favorites</span>
            </div>
            <div className="mt-4 pb-2 d-flex flex-wrap gap-2 me-n3 watch-list-content overflow-y-auto">
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
