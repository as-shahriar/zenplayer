import { Route, Routes, useNavigate } from 'react-router-dom';
import { WatchListPage } from './pages/WatchListPage';
import { SettingsPage } from './pages/SettingsPage';
import { ROUTES } from './Routes';
import { VideoPage } from './pages/VideoPage';
import { ApiKey, Channel } from '../../constants/appConstants';
import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { FavoritesPage } from './pages/FavoritesPage';

const App = () => {
    const navigate = useNavigate();
    useEffect(() => {
        window[ApiKey].navigate(Channel.NAVIGATE, function (url: string) {
            navigate(url);
        });
    }, []);

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<WatchListPage />} />
                <Route path={ROUTES.WATCH_LIST_BY_ID} element={<WatchListPage />} />
                <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
            </Route>
            <Route path={ROUTES.VIDEO} element={<VideoPage />} />
        </Routes>
    );
};

export default App;
