import { Folder } from '../components/Folder';
import { QUERY_KEYS } from '../../../constants/appConstants';
import { EntityModel } from '../../../models/EntityModel';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import 'plyr-react/plyr.css';
import { ROUTES } from '../Routes';
import { EntityType } from '../../../models/enums/EntityType';
import { useRoutesMatch } from '../hooks/useRoutesMatch';
import { useQuery } from 'react-query';
import { AppService } from '../services/AppService';
import { AddButton } from '../components/AddButton';

export const WatchListPage = () => {
    const { id } = useParams();
    const isHome = useRoutesMatch(ROUTES.HOME);
    const navigate = useNavigate();

    const getEntityData = () => {
        if (id) {
            return AppService.getChildren(id);
        } else {
            return AppService.getRootFolders();
        }
    };

    const getEntity = () => {
        if (id) {
            return AppService.getEntity(id);
        }
        return undefined;
    };

    const { data: entityList = [], refetch } = useQuery(
        [QUERY_KEYS.GET_ALL_ENTITY, id],
        getEntityData,
        {
            staleTime: 0,
            refetchInterval: 3000
        }
    );

    const { data: entity } = useQuery([QUERY_KEYS.GET_ENTITY, id], getEntity);

    const onClick = (entity: EntityModel) => {
        if (entity.type === EntityType.Folder) {
            const link = generatePath(ROUTES.WATCH_LIST_BY_ID, { id: entity.id });
            navigate(link);
        } else if (entity.type === EntityType.Video) {
            navigate(generatePath(ROUTES.VIDEO, { id: entity.id }));
        }
    };

    const deleteEntity = (id: number) => {
        console.log(id);
    };

    const updateFavorite = (id: number, favorite: number) => {
        AppService.updateFavorite(id, favorite).then(() => refetch());
    };

    return (
        <div className="p-3 pb-1">
            <div className="d-flex justify-content-between align-items-center">
                <span className="fs-6">{entity?.name || 'Home'}</span>
            </div>
            <div className="mt-4 pb-2 d-flex flex-wrap gap-2 me-n3 watch-list-content overflow-y-auto">
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
            {isHome && <AddButton refreshList={refetch} />}
        </div>
    );
};
