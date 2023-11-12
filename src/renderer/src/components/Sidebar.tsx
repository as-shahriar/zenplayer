import { Link } from 'react-router-dom';
import { ROUTES } from '../Routes';

type SidebarProps = {};

export const Sidebar = (props: SidebarProps) => {
    const {} = props;
    return (
        <div className="p-2">
            <span>ZenPlayer</span>
            <ul>
                <li>
                    <Link to={ROUTES.INDEX}>Watch List</Link>
                </li>
                <li>
                    <Link to={ROUTES.SETTINGS}>Settings</Link>
                </li>
            </ul>
        </div>
    );
};
