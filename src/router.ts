import RodStore from './store';
import { RodRoute } from './types';
import { RodTopicService } from './topics';

const DYNAMIC_ROUTE_RE = /\/(.*)\/(.+)$/;

export default class RodRouter {

    // tslint:disable-next-line: variable-name
    private _appTitle: string = 'My site';

    // tslint:disable-next-line: variable-name
    private _a: HTMLAnchorElement;

    get a(): HTMLAnchorElement {
        if (!this._a) {
            this._a = document.createElement('a');
        }

        return this._a;
    }
    
    constructor(readonly store: RodStore, readonly topics: RodTopicService) {
        const { initPath, routes } = this.store.get();
        const homeRoute = routes.find(r => r.home);

        this._appTitle = homeRoute?.title;

        window.onpopstate = (event: PopStateEvent) => this.navigateTo(event.state, true);

        this.navigateTo(initPath || homeRoute?.path);
    }

    public navigateTo(path: RodRoute|string, recover: boolean = false): void {
        const route = this._resolveRoute(path);

        if (route) {
            this._activateRoute(route, !recover);
        }
    }

    private _activateRoute(route: RodRoute, isPushStateRequired: boolean): void {
        const title = this._getRouteTitle(route);
        const url = this._getRouteUrl(route);

        document.title = title;
        this.store.set({ currentRoute: route });
        
        if (isPushStateRequired) {
            history.pushState(route, title, url);
        }
    }

    private _resolveRoute(path: RodRoute|string): RodRoute {
        if (typeof path !== 'string') {
            return path;
        }

        const { routes } = this.store.get();
        
        this.a.href = path;

        const pn = this.a.pathname;

        if (DYNAMIC_ROUTE_RE.test(pn)) {
            const [ , base, name ] = pn.match(DYNAMIC_ROUTE_RE);
            const baseRoute = routes.find(r => r.dynamic && r.path.includes(base));

            if (baseRoute) {
                const topic = this.topics.find(base, name);
                const title = topic?.title || baseRoute.title;

                return {
                    ...baseRoute,
                    topic,
                    title,
                    dynamicPath: path
                };
            }
        } else {
            return routes.find(r => r.path === pn);
        }
    }

    private _getRouteTitle(route: RodRoute): string {
        if (route.home) {
            return this._appTitle;
        } else {
            return `${this._appTitle} — ${route.title}`;
        }
    }

    private _getRouteUrl(route: RodRoute): string {
        return route.dynamicPath || route.path;
    }
}
