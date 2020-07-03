import { RodTopic } from '../../types';
import { Component } from 'endorphin';

// Interface for component props
type RodPageTopicProps = {
    topic: RodTopic
};

// Interface for component state
type RodPageTopicState = {
    formattedDate: string,
};

// Interface for component instance
type RodPageTopicComponent = Component<RodPageTopicProps, RodPageTopicState>;

export function state(): RodPageTopicState {
    return {
        formattedDate: null
    };
}

export function willMount(component: RodPageTopicComponent) {
    const { topic } = component.props;

    if (topic) {
        const formattedDate = formatDate(new Date(topic.date));

        component.setState({
            formattedDate
        });
    }
}

export function formatDate(date: Date) {
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('.');
}
