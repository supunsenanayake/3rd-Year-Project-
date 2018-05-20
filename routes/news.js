var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');

const multer = require('multer');

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'public/images/');
    },
    filename : function (req,file,cb) {
        cb(null,file.fieldname + '-' + Date.now() + '.jpg');
        req.session.attacheFile = true;
    }

});


const uploadNews = multer({storage : storage});

var assert = require('assert');

var News = require('../models/news');




router.use(csrfProtection);

router.use('/', isLoggedIn, function(req, res, next) {
    next();
});

router.get('/', function(req, res, next) {
    req.session.attacheFile = false;
    res.render('uploadNews', {csrfToken: req.csrfToken(), layout : 'main'});
});

router.post('/publish', uploadNews.single('newsImage'), function(req, res, next) {

    req.check('title', 'Give Title for News in Title Filed ').notEmpty();
    req.check('description', 'Write your news in Description Field').notEmpty();
    req.session.dat = new Date();
    req.session.publishDate = req.session.dat.getFullYear() + "-" + (req.session.dat.getMonth()+1) + "-" +
        req.session.dat.getDate() + "T" + req.session.dat.getHours() + ":" + req.session.dat.getMinutes() + ":"
        + req.session.dat.getSeconds() + "Z";


    var errors = req.validationErrors();

    if(errors){
        req.session.errors = errors;
        res.render('createPost' , { csrfToken: req.csrfToken(), messages : req.session.errors, layout: 'main'});
    } else {
        var news = new News();
        if (req.session.attacheFile) {

                news.imagePath = '/images/'+ req.file.filename;
                news.title = req.body.title;
                news.description = req.body.description;
                news.ownerId = req.user._id;
                news.eventId = req.session.eventID;
                news.date = req.session.publishDate.toUTCString();

            news.save(function (err, result) {
                req.flash('success', 'Successfully Add your Donation!');
                res.render('addItem', {
                    csrfToken: req.csrfToken(),
                    msgSuccess: req.flash('success')[0],
                    messages: false,
                    layout: 'main'
                });
            });
        } else {

            news.imagePath = '/images/logo_news.png';
            news.title = req.body.title;
            news.description = req.body.description;
            news.ownerId = req.user._id;
            news.eventId = req.session.eventID;
            news.date = req.session.publishDate.toUTCString();

            news.save(function (err, result) {
                req.flash('success', 'Successfully Add your Donation!');
                res.render('addItem', {
                    csrfToken: req.csrfToken(),
                    msgSuccess: req.flash('success')[0],
                    messages: false,
                    layout: 'main'
                });
            });
        }
        }
});



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}




module.exports = router;
