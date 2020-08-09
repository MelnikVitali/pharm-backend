const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config(); //to use env variables
const cookieParser = require('cookie-parser');

const routes = require('./routes/routes');
const configPassport = require('./configs/passport');

require('./configs/passport')(passport);

const app = express();

app.use(passport.initialize());
app.use(passport.session());

configPassport(passport);

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

const db = process.env.DB_CONNECT;

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

mongoose.connection.on('error', (err) => {
    console.error('Connection error:', err)
});

mongoose.connection.once('open', () => {
    console.log('Connect to MongoDB success');

    routes(app);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Оно живо! PORT=${PORT}`, new Date());
    });
});
