import endorphin from 'endorphin';

// @ts-ignore
import * as RodApp from './components/rod-app/rod-app.html';

//import storageData from '../resources/storage.json';

console.log('Redirected from:', sessionStorage.redirect);

endorphin('rod-app', RodApp, {
    target: document.body
});