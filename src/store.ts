import { Store } from 'endorphin';
import RodRouter from './router';
import { RodStorage } from './types';
import { RodTopicService } from './topics';

export default class RodStore extends Store<RodStorage> {

    public router: RodRouter;
    public topics: RodTopicService;

    constructor(initData = {}) {
        super();

        this.set({
            ...initData
        });

        this.topics = new RodTopicService(this);
        this.router = new RodRouter(this, this.topics);
    }

    public dispose() {
        // unsubscribe
    }
}
