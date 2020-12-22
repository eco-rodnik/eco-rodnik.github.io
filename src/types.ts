export type RodStorage = {
    news: RodTopic[],
    events: RodTopic[],
    routes: RodRoute[],
    currentRoute?: RodRoute,
    initPath?: string,
};

export type RodTopic = {
    name: string,
    date: string,
    image: string,
    title: string,
    text: string,
};

export type RodRoute = {
    path: string,
    title: string,
    home?: boolean,
    dynamic?: boolean,
    dynamicPath?: string,
    topic?: RodTopic,
};
