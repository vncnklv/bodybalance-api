const express = require('express');
require('dotenv').config();
require("./database");

const cors = require('./middleware/cors');
const requestLogger = require("./middleware/requestLogger");

const app = express();

app.use(requestLogger);
app.use(cors);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

const port = 3000
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`App listening on port ${port}`);
    }
});