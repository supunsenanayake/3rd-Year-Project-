var express = require('express');
var router = express.Router();

var Event = require('../models/event');
var News = require('../models/news');
var Map = require('../models/map');

var mongo = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017';

const dbName= 'sahana';

var assert = require('assert');


/* GET home page. */
router.get('/', function(req, res, next) {
    Event.find().sort({_id : -1}).limit(4).exec(function (err, docs) {
        req.session.eventChunks = [];
        var chunkSize = 2;
        for (var i = 0; i < docs.length; i += chunkSize) {
            req.session.eventChunks.push(docs.slice(i, i + chunkSize));
        }
        //console.log(docs[0].title);
        //console.log(docs[0]._id);
        Map.find({eventId : docs[0]._id}).exec(function (err, result) {
            req.session.regionBlock = [];
            req.session.regionName = result[0].regionName;
            req.session.matchingCount = 0;
            for (var j = 0; j < result.length; j++) {
                if (req.session.regionName === result[j].regionName) {
                    //console.log(req.session.regionName);
                    req.session.matchingCount++;
                    if(j === result.length - 1){
                        //console.log("I am In");
                        req.session.regionBlock.push(result.slice((j - req.session.matchingCount + 1), j + 1));
                        req.session.regionName = result[j].regionName;
                        req.session.matchingCount = 0;
                    }
                } else {
                    req.session.regionBlock.push(result.slice((j - req.session.matchingCount), j));
                    req.session.regionName = result[j].regionName;
                    req.session.matchingCount = 0;
                    j--;
                }
            }
            //console.log(req.session.eventChunks);
            console.log(req.session.regionBlock[0][0].longitudes);
            console.log(req.session.regionBlock[0].length);
            res.render('index', {events: req.session.eventChunks, regionBlock: req.session.regionBlock});
        });
    });

});

router.get('/newsFeed', function(req, res, next) {
    News.find({eventId: req.session.eventID}).sort({_id : -1})
        .exec(function (err, docs) {
            var newsChunks = [];
            var chunkSize = 2;
            for (var i = 0; i < docs.length; i += chunkSize) {
                newsChunks.push(docs.slice(i, i + chunkSize));
            }
            res.render('newsFeed', {news: newsChunks, layout: 'main'});
        });

});

router.get('/newsFeed/:id/:event', function(req, res, next) {
    req.session.eventTitle = req.params.event;
    var str = req.params.id;
    req.session.eventID = str.toString();
    res.redirect('/video/publish');
});


router.get('/getJson', function(req, res, next) {
    Event.find().sort({_id : -1}).limit(4).exec(function (err, docs) {
        req.session.eventChunks = [];
        var chunkSize = 2;
        for (var i = 0; i < docs.length; i += chunkSize) {
            req.session.eventChunks.push(docs.slice(i, i + chunkSize));
        }
        //console.log(docs[0].title);
        //console.log(docs[0]._id);
        Map.find({eventId : docs[0]._id}).exec(function (err, result) {
            req.session.regionBlock = [];
            req.session.regionName = result[0].regionName;
            req.session.matchingCount = 0;
            for (var j = 0; j < result.length; j++) {
                if (req.session.regionName === result[j].regionName) {
                    //console.log(req.session.regionName);
                    req.session.matchingCount++;
                    if(j === result.length - 1){
                        //console.log("I am In");
                        req.session.regionBlock.push(result.slice((j - req.session.matchingCount + 1), j + 1));
                        req.session.regionName = result[j].regionName;
                        req.session.matchingCount = 0;
                    }
                } else {
                    req.session.regionBlock.push(result.slice((j - req.session.matchingCount), j));
                    req.session.regionName = result[j].regionName;
                    req.session.matchingCount = 0;
                    j--;
                }
            }
            //console.log(req.session.eventChunks);
            console.log(req.session.regionBlock);
            console.log(req.session.regionBlock[0][0].longitudes);
            console.log(req.session.regionBlock[0].length);
            res.send(JSON.stringify(req.session.regionBlock));
        });
    });

});



module.exports = router;
