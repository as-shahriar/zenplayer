import { Route, Routes, useNavigate } from 'react-router-dom';
import { WatchListContainer } from './pages/WatchListContainer';
import { Settings } from './pages/Settings';
import { ROUTES } from './Routes';
import { VideoPlayerContainer } from './pages/VideoPlayerContainer';
import { ApiKey, Channel } from '../../constants/appConstants';
import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { Favorites } from './pages/Favorites';

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
                <Route index element={<WatchListContainer />} />
                <Route path={ROUTES.WATCH_LIST_BY_ID} element={<WatchListContainer />} />
                <Route path={ROUTES.SETTINGS} element={<Settings />} />
                <Route path={ROUTES.FAVORITES} element={<Favorites />} />
            </Route>
            <Route path={ROUTES.VIDEO} element={<VideoPlayerContainer />} />
        </Routes>
    );
};

export default App;
