import { ReactNode } from 'react';
import { Sidebar } from '../components/Sidebar';
import { WatchList } from '../components/WatchList';

export const Homepage = (): ReactNode => {
    return (
        <div className="row vw-100 vh-100">
            <div className="col-3 shadow-sm">
                <Sidebar />
            </div>
            <div className="col-9">
                <WatchList />
            </div>
        </div>
    );
};
