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

            <ul className="d-flex flex-column gap-2 mt-4 p-0 nav">
                <li className={clsx(isHome && 'active')}>
                    <Link to={ROUTES.HOME} className="nav-item rounded p-2">
                        <Icon iconSpritePath={iconDef} name="home" width={19} height={19} />
                    </Link>
                    <span className="nav-text">Home</span>
                </li>
                <li className={clsx(isFavorite && 'active')}>
                    <Link to={ROUTES.FAVORITES} className="nav-item rounded p-2">
                        <Icon iconSpritePath={iconDef} name="heart-solid" width={19} height={19} />
                    </Link>
                    <span className="nav-text">Favorites</span>
                </li>
                <li className={clsx(isSettings && 'active')}>
                    <Link to={ROUTES.SETTINGS} className="nav-item rounded p-2">
                        <Icon iconSpritePath={iconDef} name="gear" width={19} height={19} />
                    </Link>
                    <span className="nav-text">Settings</span>
                </li>
            </ul>
        </div>
    );
};
