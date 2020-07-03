import RodStore from './store';
import { RodTopic } from './types';

export class RodTopicService {

    constructor(readonly store: RodStore) {}

    public find(base: string, name: string): RodTopic {
        const { news, events } = this.store.get();
        const topics = (base === 'news') ? news : events;

        return topics?.find(t => t.name === name);
    }
}
