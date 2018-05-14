var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs  = require('express-handlebars');
var session= require('express-session');
var validator = require('express-validator');
var flash = require('connect-flash');
var passport = require('passport');

var index = require('./routes/index');
var users = require('./routes/users');
var profile = require('./routes/profile');
var chatBox = require('./routes/chatBox');
//var newsFeed = require('./routes/newsFeed');
var uploadPost = require('./routes/uploadPost');
var donation = require('./routes/donation');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost:27017/sahana');
require('./config/passport');

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'landing', layoutsDir:__dirname+'/views/layouts/'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'foo',
    saveUninitialized: false ,
    resave: false,}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/profile', profile);
app.use('/chatBox', chatBox);
//app.use('/newsFeed', newsFeed);
app.use('/uploadPost', uploadPost);
app.use('/donation', donation);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
