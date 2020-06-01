const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static('./'));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('OK');
});

app.listen(PORT, () => console.log(`Started on http://localhost:${PORT}`));