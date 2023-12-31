import { Route, Routes } from 'react-router-dom';
import { WatchListPage } from './pages/WatchListPage';
import { SettingsPage } from './pages/SettingsPage';
import { ROUTES } from './Routes';
import { VideoPage } from './pages/VideoPage';
import { useLayoutEffect } from 'react';
import { Layout } from './components/Layout';
import { FavoritesPage } from './pages/FavoritesPage';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CommonUtil } from './services/CommonUtil';

const App = () => {
    const queryClient = new QueryClient();

    useLayoutEffect(() => {
        CommonUtil.applyTheme();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<WatchListPage />} />
                    <Route path={ROUTES.WATCH_LIST_BY_ID} element={<WatchListPage />} />
                    <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                    <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
                </Route>
                <Route path={ROUTES.VIDEO} element={<VideoPage />} />
            </Routes>
        </QueryClientProvider>
    );
};

export default App;
