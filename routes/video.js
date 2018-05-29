var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();


router.use(csrfProtection);
var Video = require('../models/video');

var assert = require('assert');




router.get('/publish', function(req, res, next) {

    Video.find({eventId : req.session.eventID}).sort({_id : -1}).limit(5).exec(function (err, docs) {
        req.session.videos = [];
        for (var i = 0; i < docs.length; i ++) {
            (req.session.videos).push(docs.slice(i, i + 1));
        }
        res.redirect('/newsFeed');
    });

});


router.use('/', isLoggedIn, function(req, res, next) {
    next();
});


router.get('/', function(req, res, next) {
    res.render('addVideo', {csrfToken: req.csrfToken(), layout : 'main'});
});

router.post('/', function(req, res, next) {
    req.check('videoLink', 'Insert Embedded Link').notEmpty();
    req.session.dat = new Date();
    req.session.publishDate = req.session.dat.getFullYear() + "/" + (req.session.dat.getMonth()+1) + "/" +
        req.session.dat.getDate() + "-" + req.session.dat.getHours() + ":" + req.session.dat.getMinutes() + ":"
        + req.session.dat.getSeconds();
    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        res.render('addVideo', {csrfToken: req.csrfToken(), messages: req.session.errors, layout: 'main'});
    } else {
        var video = new Video({
            videoLink: req.body.videoLink,
            ownerId: req.user._id,
            eventId : req.session.eventID,
            ownerName : req.user.firstName + " " + req.user.lastName,
            ownerProfileImage : req.user.profileImage,
            date : req.session.publishDate
        });video.save(function (err, result) {
            assert.equal(null, err);
            res.redirect('/video/publish');
        });
    }
});





function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && (req.user.role === 'Admin')) {
        return next();
    }
    res.redirect('/');
}


module.exports = router;