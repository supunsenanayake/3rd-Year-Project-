var express = require('express');
var router = express.Router();
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


const createEvent = multer({storage : storage});

var assert = require('assert');

var Event = require('../models/event');





router.use('/', isLoggedIn, function(req, res, next) {
    next();
});

router.get('/', function(req, res, next) {
    req.session.attacheFile = false;
    res.render('createEvent', {layout : 'main'});
});

router.post('/publish', createEvent.single('eventImage'), function(req, res, next) {

    req.check('title', 'Give Title for Event in Title Filed ').notEmpty();
    req.session.dat = new Date();
    req.session.publishDate = req.session.dat.getFullYear() + "/" + (req.session.dat.getMonth()+1) + "/" +
        req.session.dat.getDate() + "-" + req.session.dat.getHours() + ":" + req.session.dat.getMinutes() + ":"
        + req.session.dat.getSeconds();


    var errors = req.validationErrors();

    if(errors){
        req.session.errors = errors;
        res.render('createEvent' , { messages : req.session.errors, msgSuccess : false, noErr : false, layout: 'main'});
    } else {
        var event = new Event();
        if (req.session.attacheFile) {

            event.imagePath = '/images/'+ req.file.filename;
            event.title = req.body.title;
            event.ownerId = req.user._id;
            event.date = req.session.publishDate;

            event.save(function (err, result) {
                req.flash('success', 'Successfully Created New Instance!');
                res.render('createEvent', {
                    msgSuccess: req.flash('success')[0],
                    messages: false,
                    noErr : true,
                    layout: 'main'
                });
            });
        } else {

            event.imagePath = '/images/disaster management.jpg';
            event.title = req.body.title;
            event.ownerId = req.user._id;
            event.date = req.session.publishDate;

            event.save(function (err, result) {
                req.flash('success', 'Successfully Created New Instance!');
                res.render('createEvent', {
                    msgSuccess: req.flash('success')[0],
                    messages: false,
                    noErr : true,
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
