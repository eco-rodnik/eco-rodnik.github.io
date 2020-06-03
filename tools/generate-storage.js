const fs = require('fs');
const path = require('path');

const resources = '../resources';
const storagePath = '../resources/storage.json';

const PARTS = {
    NEWS: 'news',
    EVENTS: 'events'
}

const news = collectInfo(path.join(resources, PARTS.NEWS));
const events = collectInfo(path.join(resources, PARTS.EVENTS))

const storage = require(storagePath);

// TODO: merge storage

const updatedStorage = {
    ...storage,
    news,
    events
};

fs.writeFileSync(storagePath, Buffer.from(JSON.stringify(updatedStorage), 'utf8'));

console.log('Storage generation done');

function collectInfo(basePath) {
    return fs.readdirSync(basePath)
    .filter(d =>
        fs.statSync(path.join(basePath, d)).isDirectory() &&
        !d.startsWith('.')
    )
    .sort((a, b) => 
        fs.statSync(path.join(basePath, b)).mtime.getTime() -
        fs.statSync(path.join(basePath, a)).mtime.getTime()
    )
    .map(dirName => {
        const dirPath = path.join(basePath, dirName);
        const fileList = fs.readdirSync(dirPath);

        return {
            dirName,
            dirPath,
            fileList,
        }
    });
}