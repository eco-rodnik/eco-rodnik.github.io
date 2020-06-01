import endorphin from 'endorphin';

// @ts-ignore
import * as RodApp from './components/rod-app/rod-app.html';

endorphin('rod-app', RodApp, {
    target: document.body
});