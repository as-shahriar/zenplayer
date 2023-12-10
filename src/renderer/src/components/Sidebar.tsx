import './Sidebar.scss';
import { Icon } from './Icon';
import iconDef from '../assets/fonts/zenplayer-icon-defs.svg';
import { Link } from 'react-router-dom';
import { ROUTES } from '../Routes';
import { useRoutesMatch } from '../hooks/useRoutesMatch';
import { clsx } from 'clsx';

export const Sidebar = () => {
    const isHome = useRoutesMatch(ROUTES.HOME);
    const isSettings = useRoutesMatch(ROUTES.SETTINGS);
    const isFavorite = useRoutesMatch(ROUTES.FAVORITES);
    return (
        <div className="sidebar-container p-4">
            <span className="fs-6">Zenplayer</span>

            <ul className="d-flex flex-column gap-3 mt-4 p-0 nav">
                <li>
                    <Link to={ROUTES.HOME} className={clsx('nav-item rounded', isHome && 'active')}>
                        <Icon
                            className="mt-n1 me-2"
                            iconSpritePath={iconDef}
                            name="home"
                            width={18}
                            height={18}
                        />
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        to={ROUTES.FAVORITES}
                        className={clsx('nav-item rounded', isFavorite && 'active')}
                    >
                        <Icon
                            className="mt-n1 me-2"
                            iconSpritePath={iconDef}
                            name="heart-solid"
                            width={18}
                            height={18}
                        />
                        Favorites
                    </Link>
                </li>
                <li>
                    <Link
                        to={ROUTES.SETTINGS}
                        className={clsx('nav-item rounded', isSettings && 'active')}
                    >
                        <Icon
                            className="mt-n1 me-2"
                            iconSpritePath={iconDef}
                            name="gear"
                            width={18}
                            height={18}
                        />
                        Settings
                    </Link>
                </li>
            </ul>
        </div>
    );
};
