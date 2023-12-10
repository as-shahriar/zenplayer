import './Folder.scss';
import { Icon } from './Icon';
import iconDef from '../assets/fonts/zenplayer-icon-defs.svg';
import { EntityType } from '../../../models/enums/EntityType';
import { ContextMenu } from './ContextMenu';
import { Fragment, useCallback, useMemo } from 'react';
import { Item } from 'react-contexify';
import { EntityModel } from '../../../models/EntityModel';
import { useRoutesMatch } from '../hooks/useRoutesMatch';
import { ROUTES } from '../Routes';

type FolderProps = {
    entity: EntityModel;
    onClick: () => void;
    updateFavorite: (id: number, favorite: number) => void;
    deleteEntity?: (id: number) => void;
};
const FAVORITE = 'favorite';
const UN_FAVORITE = 'un-favorite';
const DELETE = 'delete';

export const Folder = (props: FolderProps) => {
    const { entity, onClick, updateFavorite, deleteEntity } = props;
    const isHome = useRoutesMatch(ROUTES.HOME);

    const handleItemClick = useCallback(
        ({ id }: any) => {
            switch (id) {
                case FAVORITE:
                    updateFavorite(entity.id, 1);
                    return;
                case UN_FAVORITE:
                    updateFavorite(entity.id, 0);
                    return;
                case DELETE:
                    deleteEntity?.(entity.id);
                    return;
            }
        },
        [entity.id]
    );

    const menuItems = useMemo(() => {
        return (
            <Fragment>
                {entity.favorite === 0 && (
                    <Item id={FAVORITE} onClick={handleItemClick}>
                        <Icon
                            className="me-2"
                            iconSpritePath={iconDef}
                            name="heart-solid"
                            width={14}
                            height={14}
                        />
                        Add to Favorites
                    </Item>
                )}
                {entity.favorite === 1 && (
                    <Item id={UN_FAVORITE} onClick={handleItemClick}>
                        <Icon
                            className="me-2"
                            iconSpritePath={iconDef}
                            name="heart"
                            width={15}
                            height={15}
                        />
                        Remove from Favorites
                    </Item>
                )}
                {isHome && (
                    <Item id={DELETE} onClick={handleItemClick}>
                        <Icon
                            className="me-2"
                            iconSpritePath={iconDef}
                            name="trash"
                            width={16}
                            height={16}
                        />
                        Delete
                    </Item>
                )}
            </Fragment>
        );
    }, [entity.favorite, isHome]);

    return (
        <ContextMenu menuItems={menuItems}>
            <button
                className="btn p-0 btn-folder position-relative"
                title={entity.name}
                onClick={onClick}
            >
                {entity.type === EntityType.Folder ? (
                    <Icon iconSpritePath={iconDef} name="directory" width={60} height={60} />
                ) : (
                    <Icon iconSpritePath={iconDef} name="video" width={60} height={60} />
                )}
                {entity.progress !== 0 && entity.progress !== 100 && (
                    <div className="progress-container">
                        <div className="progress" style={{ width: `${entity.progress}%` }}></div>
                    </div>
                )}

                {entity.progress === 100 && (
                    <div className="check position-absolute">
                        <Icon iconSpritePath={iconDef} name="check" width={12} height={12} />
                    </div>
                )}
                <div className="text-truncate text">{entity.name}</div>
            </button>
        </ContextMenu>
    );
};
