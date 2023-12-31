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
import { Icon } from '../components/Icon';
import iconDef from '../assets/fonts/zenplayer-icon-defs.svg';

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
        AppService.deleteEntity(id).then(() => {
            void refetch();
        });
    };

    const updateFavorite = (id: number, favorite: number) => {
        AppService.updateFavorite(id, favorite).then(() => refetch());
    };

    const back = () => {
        let link: string;
        if (entity?.parent !== -1) {
            link = generatePath(ROUTES.WATCH_LIST_BY_ID, { id: entity?.parent });
        } else {
            link = ROUTES.HOME;
        }
        navigate(link);
    };

    return (
        <div className="p-3 pb-1">
            <div>
                {!isHome && (
                    <div className="d-flex">
                        <button className="btn btn-back p-0" onClick={back}>
                            <Icon
                                className="mt-n1 me-1"
                                iconSpritePath={iconDef}
                                name="left-arrow"
                                width={10}
                                height={10}
                            />
                            Back
                        </button>
                        <div className="flex-grow-1 text-center">{entity?.name}</div>
                    </div>
                )}
            </div>
            <div className="mt-3 pb-2 d-flex flex-wrap gap-2 me-n3 watch-list-content overflow-y-auto">
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
