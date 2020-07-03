'use strict'

module.exports = (headerCache) => () => (tree, file, next) => {
    if (tree && tree.type && tree.type === 'root') {
        const header = tree.children.find(node => node.type === 'heading' && node.depth === 1);

        if (header) {
            headerCache.value = header.children[0].value;
        }
    }
    next();
};
