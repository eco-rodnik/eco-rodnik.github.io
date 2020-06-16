import { Store } from 'endorphin';
import RodRouter from './router';

export default class RodStore extends Store {

    public router: RodRouter;

    constructor(initData = {}) {
        super();

        this.router = new RodRouter(this);

        this.set({
            ...initData
        });
    }

    dispose() {
        // unsubscribe
    }

}