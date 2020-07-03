import { Component } from 'endorphin';
import { RodTopic } from '../../types';

// Interface for component props
type RodNewsItemProps = {
    topic: RodTopic
};

// Interface for component state
type RodNewsItemState = {
    route: string,
    formattedDate: string,
};

// Interface for component instance
type RodNewsItemComponent = Component<RodNewsItemProps, RodNewsItemState>;

export function state(): RodNewsItemState {
    return {
        route: null,
        formattedDate: null
    };
}

export function willMount(component: RodNewsItemComponent) {
    const { topic } = component.props;

    if (topic) {
        const route = `/news/${topic.name}`;
        const formattedDate = formatDate(new Date(topic.date));

        component.setState({
            route,
            formattedDate
        });
    }
}

function formatDate(date: Date) {
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('.');
}
