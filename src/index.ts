import endorphin from 'endorphin';
import RodStore from './store';
import routes from './routes.json';
import storage from '../resources/storage.json';

// @ts-ignore
import * as RodApp from './components/rod-app/rod-app.html';

/*
 * Обработка редиректа от захода на вложенную страницу
 * по прямому урлу (404-hack)
 */
if (sessionStorage.redirect) {
    history.replaceState(null, 'ОЭО Родник', sessionStorage.redirect);
    sessionStorage.redirect = null;
}

const target = document.body;
const store = new RodStore({
    ...storage,
    routes,
});

endorphin('rod-app', RodApp, { target, store });