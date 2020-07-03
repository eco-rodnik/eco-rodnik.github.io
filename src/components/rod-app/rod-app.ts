import { Component } from 'endorphin';

// Interface for component props
type RodAppProps = {
    foo: number,
    bar: string,
};

// Interface for component state
type RodAppState = {
    count: number,
};

// Interface for component instance
type RodApp = Component<RodAppProps, RodAppState>;

export function state(): RodAppState {
    return { count: 0 };
}

export function didMount(component: RodApp): void {
    console.log('Mounted component %s with initial count %d', component.nodeName, component.state.count);
}

export function didUpdate(component: RodApp): void {
    console.log(component.store.get().currentRoute);
}

export function onClick(component: RodApp): void {
    component.setState({
        count: component.state.count + 1
    });
}
