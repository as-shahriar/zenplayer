import { Layout } from './pages/Layout';
import { Route, Routes } from 'react-router-dom';
import { WatchList } from './components/WatchList';
import { Settings } from './pages/Settings';
import { ROUTES } from './Routes';
import { VideoPlayer } from './pages/VideoPlayer';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<WatchList />} />
                <Route path={ROUTES.WATCH_LIST_BY_ID} element={<WatchList />} />
                <Route path={ROUTES.SETTINGS} element={<Settings />} />
            </Route>
            <Route path={ROUTES.VIDEO} element={<VideoPlayer />} />
        </Routes>
    );
};

export default App;
