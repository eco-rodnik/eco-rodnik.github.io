import { Store } from 'endorphin';
import RodRouter from './router';
import { RodStorage } from './types';

export default class RodStore extends Store<RodStorage> {

    public router: RodRouter;

    constructor(initData = {}) {
        super();

        this.set({
            ...initData
        });

        this.router = new RodRouter(this);
    }

    public dispose() {
        // unsubscribe
    }
}
