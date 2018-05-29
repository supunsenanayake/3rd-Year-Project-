var express = require('express');
var router = express.Router();


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
    res.render('addVideo', {layout : 'main'});
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
        res.render('addVideo', {messages: req.session.errors, layout: 'main'});
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



router.get('/edit', function(req, res, next) {
    Video.find({_id: req.session.videoId}).exec(function (err, docs) {
        assert.equal(null, err);
        res.render('editVideo', {result : docs , layout : 'main'});
    });
});

router.get('/edit/:id', function(req, res, next) {
    req.session.videoId = req.params.id;
    res.redirect('/video/edit');
});

router.post('/edit', function(req, res, next) {

    req.check('videoLink', 'cannot video Link empty ').notEmpty();
    req.session.dat = new Date();
    req.session.publishDate = req.session.dat.getFullYear() + "/" + (req.session.dat.getMonth()+1) + "/" +
        req.session.dat.getDate() + "-" + req.session.dat.getHours() + ":" + req.session.dat.getMinutes() + ":"
        + req.session.dat.getSeconds();


    var errors = req.validationErrors();

    if(errors){
        req.session.errors = errors;
        Video.find({_id: req.session.videoId}).exec(function (err, docs) {
            assert.equal(null, err);
            res.render('editVideo', {result : docs, messages : req.session.errors, layout : 'main'});
        });

    } else{
        Video.findByIdAndUpdate(req.session.videoId, { $set: {

            videoLink: req.body.videoLink,
            ownerId: req.user._id,
            eventId : req.session.eventID,
            ownerName : req.user.firstName + " " + req.user.lastName,
            ownerProfileImage : req.user.profileImage,
            date : req.session.publishDate

        }}, { new: true }, function (err, docs) {
            assert.equal(null, err);
            res.redirect('/video/publish');
        });
    }
});

router.get('/delete/:id', function(req, res, next) {
    req.session.videoId = req.params.id;
    Video.deleteOne({ _id : req.session.videoId }, function (err) {
        assert.equal(null, err);
        res.redirect('/video/publish');
    });
});



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && (req.user.role === 'Admin')) {
        return next();
    }
    res.redirect('/');
}


module.exports = router;