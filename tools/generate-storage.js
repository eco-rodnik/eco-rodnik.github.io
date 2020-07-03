'use strict'

const fs = require('fs');
const path = require('path');
const remark = require('remark');
const html = require('remark-html');
const extractTitle = require('./remark-extract-title');

const dist = '../dist';
const resources = path.join(dist, 'resources');
const storagePath = '../src/storage.json';

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
    .sort((a, b) => b > a ? 1 : (b < a ? -1 : 0))
    .map(name => {
        const dirPath = path.join(basePath, name);
        const fileList = fs.readdirSync(dirPath);

        const date = new Date(name.split('_')[0]);
        const textFile = fileList.find(f => f.endsWith('.md'))
        const image = '/' + path.relative(
            dist,
            path.join(dirPath, fileList.find(f =>
                f.endsWith('.png')
                || f.endsWith('.jpg')
                || f.endsWith('.jpeg')
        )));

        const headerCache = {
            value: ''
        };
        let text = '';
        
        remark()
        .use(extractTitle(headerCache))
        .use(html)
        .process(
            fs.readFileSync(path.join(dirPath, textFile), 'utf8'),
            (err, file) => {
                if (!err) {
                    text = String(file);
                }
            }
        );

        return {
            name: encodeURI(name),
            date,
            image,
            title: headerCache.value,
            text
        }
    });
}
