import { Component } from 'endorphin';

// Interface for component props
interface RodAppProps {
	foo: number;
	bar: string;
}

// Interface for component state
interface RodAppState {
	count: number;
}

// Interface for component instance
type RodApp = Component<RodAppProps, RodAppState>;

export function state() {
    return { count: 0 }
}

export function didMount(component: RodApp) {
	console.log('Mounted component %s with initial count %d', component.nodeName, component.state.count);
}

export function onClick(component: RodApp) {
	component.setState({
		count: component.state.count + 1
	});
}