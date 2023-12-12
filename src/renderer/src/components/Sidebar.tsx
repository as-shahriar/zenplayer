import './Sidebar.scss';
import { Icon } from './Icon';
import iconDef from '../assets/fonts/zenplayer-icon-defs.svg';
import { Link } from 'react-router-dom';
import { ROUTES } from '../Routes';
import { useRoutesMatch } from '../hooks/useRoutesMatch';
import { clsx } from 'clsx';
import { Logo } from './Logo';

export const Sidebar = () => {
    const isHome = useRoutesMatch(ROUTES.HOME);
    const isSettings = useRoutesMatch(ROUTES.SETTINGS);
    const isFavorite = useRoutesMatch(ROUTES.FAVORITES);
    return (
        <div className="sidebar-container p-2">
            <div className="text-center my-2">
                <Logo />
            </div>

            <ul className="d-flex flex-column gap-3 mt-4 p-0 nav">
                <li>
                    <Link
                        to={ROUTES.HOME}
                        className={clsx(
                            'nav-item rounded d-flex flex-column align-items-center gap-1 p-2',
                            isHome && 'active'
                        )}
                    >
                        <Icon iconSpritePath={iconDef} name="home" width={19} height={19} />
                        <span>Home</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to={ROUTES.FAVORITES}
                        className={clsx(
                            'nav-item rounded d-flex flex-column align-items-center gap-1 p-2',
                            isFavorite && 'active'
                        )}
                    >
                        <Icon iconSpritePath={iconDef} name="heart-solid" width={19} height={19} />
                        <span>Favorites</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to={ROUTES.SETTINGS}
                        className={clsx(
                            'nav-item rounded d-flex flex-column align-items-center gap-1 p-2',
                            isSettings && 'active'
                        )}
                    >
                        <Icon iconSpritePath={iconDef} name="gear" width={19} height={19} />
                        <span>Settings</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};
