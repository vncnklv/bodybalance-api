const express = require('express');
require('dotenv').config();
require("./database");
require('./models/Diary');
const cors = require('cors');
const requestLogger = require("./middleware/requestLogger");

const routes = require("./routes/routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(routes);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
});

const port = 3000
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`App listening on port ${port}`);
    }
});