import ReactDOM from 'react-dom/client';
import './assets/scss/styles.scss';
import App from './App';
import { HashRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <HashRouter>
        <App />
    </HashRouter>
);
