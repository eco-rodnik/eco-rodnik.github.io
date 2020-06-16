import RodStore from './store';

export type Route = {
    path: string,
    title: string,
    base?: boolean,
}

export default class RodRouter {
    
    constructor(readonly store: RodStore) {}

    navigateTo(route: Route) {
        history.replaceState(null, route.title, route.path);

        // TODO:
        //  - types for store
        //  - update store data
        console.log(route);
    }

}