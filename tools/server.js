const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static('../dist'));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('OK');
});

app.use(function (req, res, next) {
    res.status(404).sendFile(path.resolve(__dirname, '../dist/404.html'));
})

app.listen(PORT, () => console.log(`Started on http://localhost:${PORT}`));
