const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/config');
const port = process.env.PORT || 5000;
const cors = require("cors");
const morgan = require('morgan');
const errorHandler = require('./middleware/error-handler');

const { errorResponse, ApiResponse } = require('./util/helper');
const { NOT_FOUND } = require('./util/status-codes');


const app = express();

app.use(morgan('dev'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
const passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);



//connecting mongoDB
mongoose.connect(config.db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const route = require('./routes');

app.use('/stock-tracking-system', route);

app.get('/', function(req, res) {
    return res.send('Hello! The API is at http://localhost:' + port + '/api');
});


app.use((req, res, next) => {
    const meta = errorResponse(NOT_FOUND, 'Resource not found');
    return res.status(NOT_FOUND).json(ApiResponse(meta));
});

app.use('*', (req, res, next) => {
    const meta = errorResponse(NOT_FOUND, 'Resource not found');
    return res.status(NOT_FOUND).json(ApiResponse(meta));
});

app.use(errorHandler);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log(`Stock-Tracking-System running on port ${port}`);
});

connection.on('error', (err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
});

app.listen(port);