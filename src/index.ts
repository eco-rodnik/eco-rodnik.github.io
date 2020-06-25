import endorphin from 'endorphin';
import RodStore from './store';
import routes from './routes.json';
import storage from './storage.json';

// @ts-ignore
import * as RodApp from './components/rod-app/rod-app.html';

const target = document.body;
const store = new RodStore({
    ...storage,
    routes,
    initPath: getInitPath(),
});

endorphin('rod-app', RodApp, { target, store });

/*
 * Обработка редиректа от захода на вложенную страницу
 * по прямому урлу (404-hack)
 */
function getInitPath(): string | null {
    const path = sessionStorage.getItem('redirect');

    sessionStorage.removeItem('redirect');
    return path;
}
