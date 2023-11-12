import { ReactNode } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

export const Layout = (): ReactNode => {
    return (
        <div className="row vw-100 vh-100 ms-0">
            <div className="col-3 shadow-sm">
                <Sidebar />
            </div>
            <div className="col-9 p-3">
                <Outlet />
            </div>
        </div>
    );
};
