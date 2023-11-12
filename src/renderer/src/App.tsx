import { Layout } from './pages/Layout';
import { Route, Routes } from 'react-router-dom';
import { WatchList } from './components/WatchList';
import { Settings } from './pages/Settings';
import { ROUTES } from './Routes';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<WatchList />} />
                <Route path={ROUTES.SETTINGS} element={<Settings />} />
            </Route>
        </Routes>
    );
};

export default App;
