import { Route, Routes, useNavigate } from 'react-router-dom';
import { WatchListContainer } from './pages/WatchListContainer';
import { Settings } from './pages/Settings';
import { ROUTES } from './Routes';
import { VideoPlayer } from './pages/VideoPlayer';
import { ApiKey, Channel } from '../../constants/appConstants';
import { useEffect } from 'react';

const App = () => {
    const navigate = useNavigate();
    useEffect(() => {
        window[ApiKey].navigate(Channel.NAVIGATE, function (url: string) {
            navigate(url);
        });
    }, []);

    return (
        <Routes>
            <Route index element={<WatchListContainer />} />
            <Route path={ROUTES.WATCH_LIST_BY_ID} element={<WatchListContainer />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
            <Route path={ROUTES.VIDEO} element={<VideoPlayer />} />
        </Routes>
    );
};

export default App;
