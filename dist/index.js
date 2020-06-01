(function () {
    'use strict';

    /**
     * Shorthand for `elem.appendChild()` for better minification
     */
    function appendChild(element, node) {
        return element.appendChild(node);
    }
    /**
     * Creates element with given tag name
     * @param cssScope Scope for CSS isolation
     */
    function elem(tagName, cssScope) {
        const el = document.createElement(tagName);
        return cssScope ? isolateElement(el, cssScope) : el;
    }
    /**
     * Creates element with given tag name and text
     * @param cssScope Scope for CSS isolation
     */
    function elemWithText(tagName, value, cssScope) {
        const el = elem(tagName, cssScope);
        el.appendChild(textNode(value));
        return el;
    }
    /**
     * Creates text node with given value
     */
    function text(value) {
        const node = textNode(value);
        node.$value = value;
        return node;
    }
    /**
     * Creates text node with given value
     */
    function textNode(value) {
        return document.createTextNode(value != null ? value : '');
    }
    /**
     * Updates given text node value, if required
     * @returns Returns `1` if text was updated, `0` otherwise
     */
    function updateText(node, value) {
        if (value !== node.$value) {
            // node.nodeValue = textValue(value);
            node.nodeValue = value != null ? value : '';
            node.$value = value;
            return 1;
        }
        return 0;
    }
    /**
     * Isolates given element with CSS scope
     */
    function isolateElement(el, cssScope) {
        el.setAttribute(cssScope, '');
        return el;
    }
    /**
     * Creates fast object
     */
    function obj(proto = null) {
        return Object.create(proto);
    }
    /**
     * Check if given value id defined, e.g. not `null`, `undefined` or `NaN`
     */
    function isDefined(value) {
        return value != null && value === value;
    }
    // tslint:disable-next-line:only-arrow-functions
    const assign = Object.assign || function (target) {
        for (let i = 1, source; i < arguments.length; i++) {
            source = arguments[i];
            for (const p in source) {
                if (source.hasOwnProperty(p)) {
                    target[p] = source[p];
                }
            }
        }
        return target;
    };
    /**
     * Returns property descriptors from given object
     */
    // tslint:disable-next-line:only-arrow-functions
    const getObjectDescriptors = Object['getOwnPropertyDescriptors'] || function (source) {
        const descriptors = obj();
        const props = Object.getOwnPropertyNames(source);
        for (let i = 0, prop, descriptor; i < props.length; i++) {
            prop = props[i];
            descriptor = Object.getOwnPropertyDescriptor(source, prop);
            if (descriptor != null) {
                descriptors[prop] = descriptor;
            }
        }
        return descriptors;
    };
    function captureError(host, fn, arg1, arg2) {
        try {
            return fn && fn(arg1, arg2);
        }
        catch (error) {
            runtimeError(host, error);
            // tslint:disable-next-line:no-console
            console.error(error);
        }
    }
    function runtimeError(host, error) {
        if (typeof CustomEvent !== 'undefined') {
            host.dispatchEvent(new CustomEvent('runtime-error', {
                bubbles: true,
                cancelable: true,
                detail: { error, host }
            }));
        }
        else {
            throw error;
        }
    }

    /**
     * Registers given event listener on `target` element and returns event binding
     * object to unregister event
     */
    function addEvent(target, type, listener, host, scope) {
        return registerBinding(type, { host, scope, target, listener, handleEvent });
    }
    /**
     * Unregister given event binding
     */
    function removeEvent(type, binding) {
        binding.target.removeEventListener(type, binding);
    }
    function handleEvent(event) {
        try {
            this.listener && this.listener(this.host, event, this.target, this.scope);
        }
        catch (error) {
            runtimeError(this.host, error);
            // tslint:disable-next-line:no-console
            console.error(error);
        }
    }
    function safeEventListener(host, handler) {
        // tslint:disable-next-line:only-arrow-functions
        return function (event) {
            try {
                handler.call(this, event);
            }
            catch (error) {
                runtimeError(host, error);
                // tslint:disable-next-line:no-console
                console.error(error);
            }
        };
    }
    function registerBinding(type, binding) {
        binding.target.addEventListener(type, binding);
        return binding;
    }
    /**
     * Alias for `elem.setAttribute`
     */
    function setAttribute(elem, name, value) {
        elem.setAttribute(name, value);
        return value;
    }
    /**
     * Sets attribute value as expression. Unlike regular primitive attributes,
     * expression values must be represented, e.g. non-primitive values must be
     * converted to string representations. Also, expression resolved to `false`,
     * `null` or `undefined` will remove attribute from element
     */
    function setAttributeExpression(elem, name, value) {
        const primitive = representedValue(value);
        primitive === null
            ? elem.removeAttribute(name)
            : setAttribute(elem, name, primitive);
        return value;
    }
    /**
     * Returns normalized list of class names from given string
     */
    function classNames(str) {
        if (isDefined(str)) {
            return String(str).split(/\s+/).filter(uniqueClassFilter).join(' ');
        }
        return '';
    }
    /**
     * Returns represented attribute value for given data
     */
    function representedValue(value) {
        if (value === false || !isDefined(value)) {
            return null;
        }
        if (value === true) {
            return '';
        }
        if (Array.isArray(value)) {
            return '[]';
        }
        if (typeof value === 'function') {
            return '𝑓';
        }
        if (typeof value === 'object') {
            return '{}';
        }
        return value;
    }
    function uniqueClassFilter(cl, index, arr) {
        return cl ? arr.indexOf(cl) === index : false;
    }

    /**
     * Creates injector instance for given target, if required
     */
    function createInjector(target) {
        return {
            parentNode: target,
            head: null,
            ptr: null,
            // NB create `slots` placeholder to promote object to hidden class.
            // Do not use any additional function argument for adding value to `slots`
            // to reduce runtime checks and keep functions in monomorphic state
            slots: null
        };
    }

    /**
     * Invokes `name` hook for given component definition
     */
    function runHook(component, name, arg1, arg2) {
        const { plugins } = component.componentModel;
        for (let i = plugins.length - 1, hook; i >= 0; i--) {
            hook = plugins[i][name];
            if (typeof hook === 'function') {
                try {
                    hook(component, arg1, arg2);
                }
                catch (error) {
                    runtimeError(component, error);
                    // tslint:disable-next-line:no-console
                    console.error(error);
                }
            }
        }
    }
    /**
     * Returns current variable scope
     */
    function getScope(elem) {
        return elem.componentModel.vars;
    }
    function notifySlotUpdate(host, ctx) {
        runHook(host, 'didSlotUpdate', ctx.name, ctx.element);
    }

    let renderQueue = null;
    /** A lookup of normalized attributes */
    const attributeLookup = {};
    /**
     * Creates Endorphin DOM component with given definition
     */
    function createComponent(name, definition, host) {
        let cssScope;
        let root;
        if (host && 'componentModel' in host) {
            cssScope = host.componentModel.definition.cssScope;
            root = host.root || host;
        }
        const element = elem(name, cssScope);
        return createComponentFromElement(element, definition, root);
    }
    /**
     * Convert HTMLElement into Endorphin DOM component with given definition
     */
    function createComponentFromElement(el, definition, root) {
        const element = el;
        // Add host scope marker: we can’t rely on tag name since component
        // definition is bound to element in runtime, not compile time
        if (definition.cssScope) {
            element.setAttribute(definition.cssScope + '-host', '');
        }
        const { props, state, extend, events, plugins } = prepare(element, definition);
        element.refs = obj();
        element.props = obj();
        element.state = state;
        element.componentView = element; // XXX Should point to Shadow Root in Web Components
        root && (element.root = root);
        addPropsState(element);
        if (extend) {
            Object.defineProperties(element, extend);
        }
        if (definition.store) {
            element.store = definition.store();
        }
        else if (root && root.store) {
            element.store = root.store;
        }
        // Create slotted input
        const input = createInjector(element.componentView);
        input.slots = obj();
        element.componentModel = {
            definition,
            input,
            vars: obj(),
            mounted: false,
            preparing: false,
            update: void 0,
            queued: false,
            events,
            plugins,
            partialDeps: null,
            defaultProps: props
        };
        runHook(element, 'init');
        return element;
    }
    /**
     * Mounts given component
     */
    function mountComponent(component, props) {
        const { componentModel } = component;
        const { input, definition } = componentModel;
        const changes = setPropsInternal(component, props || componentModel.defaultProps);
        const arg = changes || {};
        componentModel.preparing = true;
        // Notify slot status
        for (const p in input.slots) {
            notifySlotUpdate(component, input.slots[p]);
        }
        if (changes) {
            runHook(component, 'didChange', arg);
        }
        runHook(component, 'willMount', arg);
        runHook(component, 'willRender', arg);
        componentModel.preparing = false;
        componentModel.update = captureError(component, definition.default, component, getScope(component));
        componentModel.mounted = true;
        runHook(component, 'didRender', arg);
        runHook(component, 'didMount', arg);
    }
    /**
     * Queues next component render
     */
    function renderNext(component, changes) {
        if (!component.componentModel.preparing) {
            renderComponent(component, changes);
        }
        else {
            scheduleRender(component, changes);
        }
    }
    /**
     * Schedules render of given component on next tick
     */
    function scheduleRender(component, changes) {
        if (!component.componentModel.queued) {
            component.componentModel.queued = true;
            if (renderQueue) {
                renderQueue.push(component, changes);
            }
            else {
                renderQueue = [component, changes];
                requestAnimationFrame(drainQueue);
            }
        }
    }
    /**
     * Renders given component
     */
    function renderComponent(component, changes) {
        const { componentModel } = component;
        const arg = changes || {};
        componentModel.queued = false;
        componentModel.preparing = true;
        if (changes) {
            runHook(component, 'didChange', arg);
        }
        runHook(component, 'willUpdate', arg);
        runHook(component, 'willRender', arg);
        componentModel.preparing = false;
        captureError(component, componentModel.update, component, getScope(component));
        runHook(component, 'didRender', arg);
        runHook(component, 'didUpdate', arg);
    }
    function kebabCase(ch) {
        return '-' + ch.toLowerCase();
    }
    function setPropsInternal(component, nextProps) {
        let changes;
        const { props } = component;
        const { defaultProps } = component.componentModel;
        let prev;
        let current;
        for (const p in nextProps) {
            prev = props[p];
            current = nextProps[p];
            if (current == null && p in defaultProps) {
                current = defaultProps[p];
            }
            if (p === 'class' && current != null) {
                current = classNames(current);
            }
            if (current !== prev) {
                if (!changes) {
                    changes = obj();
                }
                props[p] = current;
                changes[p] = { current, prev };
                if (!/^partial:/.test(p)) {
                    setAttributeExpression(component, normalizeAttribute(p), current);
                }
            }
        }
        return changes;
    }
    /**
     * Check if `next` contains value that differs from one in `prev`
     */
    function hasChanges(prev, next) {
        for (const p in next) {
            if (next[p] !== prev[p]) {
                return true;
            }
        }
        return false;
    }
    /**
     * Prepares internal data for given component
     */
    function prepare(component, definition) {
        const props = obj();
        const state = obj();
        const plugins = collectPlugins(component, definition, [definition]);
        let events;
        let extend;
        for (let i = plugins.length - 1; i >= 0; i--) {
            const dfn = plugins[i];
            dfn.props && assign(props, dfn.props(component));
            dfn.state && assign(state, dfn.state(component));
            // NB: backward compatibility with previous implementation
            if (dfn.methods) {
                extend = getDescriptors(dfn.methods, extend);
            }
            if (dfn.extend) {
                extend = getDescriptors(dfn.extend, extend);
            }
            if (dfn.events) {
                if (!events) {
                    events = createEventsMap(component);
                }
                attachEventHandlers(component, dfn.events, events);
            }
        }
        return { props, state, extend, events, plugins };
    }
    /**
     * Collects all plugins (including nested) into a flat list
     */
    function collectPlugins(component, definition, dest = []) {
        let { plugins } = definition;
        if (typeof plugins === 'function') {
            plugins = plugins(component);
        }
        if (Array.isArray(plugins)) {
            for (let i = 0; i < plugins.length; i++) {
                dest.push(plugins[i]);
                collectPlugins(component, plugins[i], dest);
            }
        }
        return dest;
    }
    /**
     * Extracts property descriptors from given source object and merges it with `prev`
     * descriptor map, if given
     */
    function getDescriptors(source, prev) {
        const descriptors = getObjectDescriptors(source);
        return prev ? assign(prev, descriptors) : descriptors;
    }
    function createEventsMap(component) {
        const listeners = obj();
        const handler = function (evt) {
            if (component.componentModel) {
                const handlers = listeners[evt.type];
                for (let i = 0; i < handlers.length; i++) {
                    handlers[i](component, evt, this);
                }
            }
        };
        return { handler: safeEventListener(component, handler), listeners };
    }
    function attachEventHandlers(component, events, eventMap) {
        const names = Object.keys(events);
        const { listeners } = eventMap;
        for (let i = 0, name; i < names.length; i++) {
            name = names[i];
            if (name in listeners) {
                listeners[name].push(events[name]);
            }
            else {
                component.addEventListener(name, eventMap.handler);
                listeners[name] = [events[name]];
            }
        }
    }
    function addPropsState(element) {
        element.setProps = function setProps(value) {
            const { componentModel } = element;
            // In case of calling `setProps` after component was unmounted,
            // check if `componentModel` is available
            if (value != null && componentModel && componentModel.mounted) {
                const changes = setPropsInternal(element, assign(obj(), value));
                changes && renderNext(element, changes);
                return changes;
            }
        };
        element.setState = function setState(value) {
            const { componentModel } = element;
            // In case of calling `setState` after component was unmounted,
            // check if `componentModel` is available
            if (value != null && componentModel && hasChanges(element.state, value)) {
                assign(element.state, value);
                // If we’re in rendering state than current `setState()` is caused by
                // one of the `will*` hooks, which means applied changes will be automatically
                // applied during rendering stage.
                // If called outside of rendering state we should schedule render
                // on next tick
                if (componentModel.mounted && !componentModel.preparing) {
                    scheduleRender(element);
                }
            }
        };
    }
    function drainQueue() {
        const pending = renderQueue;
        renderQueue = null;
        for (let i = 0, component; i < pending.length; i += 2) {
            component = pending[i];
            // It’s possible that a component can be rendered before next tick
            // (for example, if parent node updated component props).
            // Check if it’s still queued then render.
            // Also, component can be unmounted after it’s rendering was scheduled
            if (component.componentModel && component.componentModel.queued) {
                renderComponent(component, pending[i + 1]);
            }
        }
    }
    /**
     * Normalizes given attribute name: converts `camelCase` to `kebab-case`
     */
    function normalizeAttribute(attr) {
        if (!(attr in attributeLookup)) {
            attributeLookup[attr] = attr.replace(/[A-Z]/g, kebabCase);
        }
        return attributeLookup[attr];
    }

    /**
     * Creates Endorphin component and mounts it into given `options.target` container
     */
    function endorphin(name, definition, options = {}) {
        const component = createComponent(name, definition, options.target);
        if (options.store) {
            component.store = options.store;
        }
        if (options.target && !options.detached) {
            options.target.appendChild(component);
        }
        mountComponent(component, options.props);
        return component;
    }

    function state() {
        return { count: 0 };
    }
    function didMount(component) {
        console.log('Mounted component %s with initial count %d', component.nodeName, component.state.count);
    }
    function onClick(component) {
        component.setState({
            count: component.state.count + 1
        });
    }

    const cssScope = "e-n43ojt";

    function template$0(host, scope) {
    	const target$0 = host.componentView;
    	appendChild(target$0, text("\n    Hello world!"));
    	appendChild(target$0, elem("br", cssScope));
    	const button$0 = appendChild(target$0, elemWithText("button", "Click me", cssScope));
    	scope.click$0 = addEvent(button$0, "click", onClick, host, scope);
    	const p$0 = appendChild(target$0, elem("p", cssScope));
    	appendChild(p$0, text("Clicked "));
    	scope.text$2 = appendChild(p$0, text(host.state.count));
    	appendChild(p$0, text(" "));
    	scope.text$4 = appendChild(p$0, text(((host.state.count !== 1) ? "times" : "time")));
    	return template$0Update;
    }

    template$0.dispose = template$0Unmount;

    function template$0Update(host, scope) {
    	updateText(scope.text$2, host.state.count);
    	updateText(scope.text$4, ((host.state.count !== 1) ? "times" : "time"));
    }

    function template$0Unmount(scope) {
    	scope.click$0 = removeEvent("click", scope.click$0);
    }

    var RodApp = /*#__PURE__*/Object.freeze({
        __proto__: null,
        cssScope: cssScope,
        'default': template$0,
        state: state,
        didMount: didMount,
        onClick: onClick
    });

    endorphin('rod-app', RodApp, {
        target: document.body
    });

}());
//# sourceMappingURL=index.js.map
