var express = require('express');
var router = express.Router();
var Event = require('../models/event');

/* GET home page. */
router.get('/', function(req, res, next) {
    Event.find(function (err, docs) {
        var eventChunks = [];
        var chunkSize = 2;
        for (var i = 0; i < 4; i += chunkSize) {
            eventChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('index', {events: eventChunks , layout: 'landing'});
    });

});

router.get('/home', function(req, res, next) {
    res.render('home', {layout: 'normal'});
});

router.get('/event', function(req, res, next) {
    res.render('event');
});

router.get('/event2', function(req, res, next) {
    res.render('newsFeed', {layout: 'normal2'});
});



module.exports = router;
