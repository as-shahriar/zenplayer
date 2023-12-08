import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => {
    return (
        <div className="row">
            <div className="col-3">
                <Sidebar />
            </div>
            <div className="col-9">
                <Outlet />
            </div>
        </div>
    );
};
