import { matchRoutes, useLocation } from 'react-router-dom';

export const useRoutesMatch = (path: string) => {
    const location = useLocation();
    return matchRoutes([{ path }], location);
};
