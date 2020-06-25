import RodStore from './store';
import { RodRoute } from './types';

export default class RodRouter {
    
    constructor(readonly store: RodStore) {
        const { initPath } = this.store.get();

        if (initPath) {
            const route = this._findRoute(initPath);

            if (route) {
                this.navigateTo(route);
            }
        }
    }

    public navigateTo(route: RodRoute, data?: any): void {
        const { routes } = this.store.get();
        const newRoutes = routes.map<RodRoute>(r => ({
            ...r,
            selected: r.path === route.path
        }));

        this.store.set({ routes: newRoutes });
        history.pushState(data, route.title, route.path);
        console.log(this.store.get().routes);
    }

    private _findRoute(path: string): RodRoute {
        const { routes } = this.store.get();
        const a = document.createElement('a');
        
        a.href = path;
        return routes.find(r => r.path === a.pathname);
    }
}
