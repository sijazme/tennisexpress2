'use strict';
var debug = require('debug')('my express app');
var express = require('express');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var routes2 = require('./routes/odds');
var routes3 = require('./routes/players');
var routes4 = require('./routes/rating');
var routes5 = require('./routes/home');

var favicon = require('serve-favicon');
var fetch = require('node-fetch');
var jsonQuery = require('json-query');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public

app.use(favicon(__dirname + '/public/images/ball.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/stylesheets', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
//app.use('/services', express.static('services'));


app.use('/home', routes5);
app.use('/rating', routes4);
app.use('/players', routes3);
app.use('/odds', routes2);
app.use('/', routes);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

// # MongoDB

const mongoose = require("mongoose");

const dbserver = 'dbuser:Ginger991@cluster1.r00nfer.mongodb.net';
const database = 'tennisexpress';

//const connstr = 'mongodb+srv://dbuser:Ginger991@cluster1.r00nfer.mongodb.net/';
class Database {
    constructor() {
        this._connect();
    }
    _connect() {
        mongoose
            .connect(`mongodb+srv://${dbserver}/${database}`)
            .then(() => {
                console.log('Database connection successful');
            })
            .catch((err) => {
                console.error('Database connection failed');
            });
    }
}

module.exports = new Database();