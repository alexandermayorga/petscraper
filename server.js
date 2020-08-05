const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose'); //Mongoose - DB util
const CronJob = require('cron').CronJob;
const { aarfhouston, houstonspca } = require('./scrapers/scrapers')

if(process.env.NODE_ENV === 'production'){
    // second minute hour day month day(week)
    new CronJob('0 0 0 * * *', function () {
        //Runs at midnight
        const d = new Date();
        // console.log('Every 3 minutes:', d);
        aarfhouston.fetchLinks();
        houstonspca.fetchLinks();
    }, null, true, 'America/Chicago');

    new CronJob('0 0 6 * * *', function () {
        //Runs at 6am
        const d = new Date();
        console.log('Every 30 minutes:', d);
        aarfhouston.fetchPets();
        houstonspca.fetchPets();
    }, null, true, 'America/Chicago');
}

//DB Config
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const indexRouter = require('./routes/index');
const petRouter = require('./routes/pet');
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, './client/build')));

app.use('/links', indexRouter);
app.use('/pets', petRouter);
app.use('/api', apiRouter);

module.exports = app;
