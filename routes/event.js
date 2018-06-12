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
            event.ownerName = req.user.firstName + " " + req.user.lastName;
            event.ownerProfileImage = req.user.profileImage;

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
            event.ownerName = req.user.firstName + " " + req.user.lastName;
            event.ownerProfileImage = req.user.profileImage;

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


router.get('/edit', function(req, res, next) {
    req.session.attacheFile = false;
    Event.find({_id: req.session.eventID}).exec(function (err, docs) {
        assert.equal(null, err);
        res.render('editEvent', {result : docs , messages : false});
    });
});

router.get('/edit/:id', function(req, res, next) {
    req.session.eventID = req.params.id;
    res.redirect('/event/edit');
});

router.post('/updateEvent', createEvent.single('eventImage'), function(req, res, next) {
    req.check('title', 'Give Title for Event in Title Filed ').notEmpty();
    req.session.dat = new Date();
    req.session.publishDate = req.session.dat.getFullYear() + "/" + (req.session.dat.getMonth()+1) + "/" +
        req.session.dat.getDate() + "-" + req.session.dat.getHours() + ":" + req.session.dat.getMinutes() + ":"
        + req.session.dat.getSeconds();


    var errors = req.validationErrors();

    if(errors){
        req.session.errors = errors;
        Event.find({_id: req.session.eventID}).exec(function (err, docs) {
            assert.equal(null, err);
            res.render('editEvent', {result : docs , messages : req.session.errors});
        });
    } else {
        if (req.session.attacheFile) {

            Event.findByIdAndUpdate(req.session.eventID, { $set: {
                imagePath : '/images/'+ req.file.filename,
                title : req.body.title,
                ownerId : req.user._id,
                date : req.session.publishDate,
                ownerName : req.user.firstName + " " + req.user.lastName,
                ownerProfileImage : req.user.profileImage
            }}, { new: true }, function (err, docs) {
                assert.equal(null, err);
                res.redirect('/');
            });
        } else {

            Event.findByIdAndUpdate(req.session.eventID, { $set: {
                title : req.body.title,
                ownerId : req.user._id,
                date : req.session.publishDate,
                ownerName : req.user.firstName + " " + req.user.lastName,
                ownerProfileImage : req.user.profileImage
            }}, { new: true }, function (err, docs) {
                assert.equal(null, err);
                res.redirect('/');
            });
        }
    }
});


router.get('/delete/:id', function(req, res, next) {
    req.session.eventID = req.params.id;
    Event.deleteOne({ _id : req.session.eventID }, function (err) {
        assert.equal(null, err);
        res.redirect('/');
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && (req.user.role === 'Admin' || req.user.role === 'Super Volunteer')) {
        return next();
    }
    res.redirect('/');
}




module.exports = router;
