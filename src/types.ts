export type RodStorage = {
    news: RodNews[],
    events: RodEvent[],
    routes: RodRoute[],
    initPath: string|null,
};

export type RodNews = {
    //
};

export type RodEvent = {
    //
};

export type RodRoute = {
    path: string,
    title: string,
    base?: boolean,
    selected?: boolean
};
