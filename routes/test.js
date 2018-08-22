var express = require('express');
var router = express.Router();


var Event = require('../models/event');
var News = require('../models/news');
var Video = require('../models/video');



var assert = require('assert');

var mongo = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017';

const dbName= 'sahana';


router.get('/', function(req, res, next) {

    var events = [
        new Event({
            "_id":{"$oid":"5b01d2e4f6b2bc2d4c22d303"},"imagePath":"/images/disaster management.jpg","title":"Where can I get some?","ownerId":"5b002ff576cefe2710870c1d","date":"2018/5/21-1:26:20","ownerName":"Vihanga Paranahewa","ownerProfileImage":"/images/profilePics/profileImage-1527093881431.jpg","__v":{"$numberInt":"0"}
        }),
        new Event({
            "_id":{"$oid":"5b01d460f6b2bc2d4c22d304"},"imagePath":"/images/eventImage-1526846560741.jpg","title":"Sri lanka Colombo has facing a Storm","ownerId":"5b002ff576cefe2710870c1d","date":"2018/2/18-18:12:58","ownerName":"Vihanga Paranahewa","ownerProfileImage":"/images/profilePics/profileImage-1527093881431.jpg","__v":{"$numberInt":"0"}
        }),
        new Event({
            "_id":{"$oid":"5b01d4d0f6b2bc2d4c22d305"},"imagePath":"/images/eventImage-1526846672449.jpg","title":"Sri lanka, Mithotamulla Garbage dump collapse to houses","ownerId":"5b002ff576cefe2710870c1d","date":"2017/9/15-17:34:32","ownerName":"Vihanga Paranahewa","ownerProfileImage":"/images/profilePics/profileImage-1527093881431.jpg","__v":{"$numberInt":"0"}
        }),
        new Event({
            "_id":{"$oid":"5b01d4f0f6b2bc2d4c22d306"},"imagePath":"/images/eventImage-1526846704997.jpg","title":"Sri lanka, anuradhapura facing worst Drought","ownerId":"5b002ff576cefe2710870c1d","date":"2017/8/11-8:27:23","ownerName":"Vihanga Paranahewa","ownerProfileImage":"/images/profilePics/profileImage-1527093881431.jpg","__v":{"$numberInt":"0"}
        }),
        new Event({
            "_id":{"$oid":"5b02b951e5650a13dcf274af"},"imagePath":"/images/eventImage-1526905169902.jpg","title":"Sri Lanka Southern Province has flood","ownerId":"5b002ff576cefe2710870c1d","date":"2018/5/21-17:49:29","ownerName":"Vihanga Paranahewa","ownerProfileImage":"/images/profilePics/profileImage-1527093881431.jpg","__v":{"$numberInt":"0"}
        })
    ];

    Event.collection.insert(events, function (err, docs) {
        assert.equal(null, err);
        res.redirect('/');
    });

});





router.get('/addNews', function(req, res, next) {

    var news = [
        new News({
            "_id":{"$oid":"5b01bc3bce94530150f4489b"},"imagePath":"/images/logo_news.png","title":"Why do we use it?","description":"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.","ownerId":"5b002ff576cefe2710870c1d","eventId":"5b02b951e5650a13dcf274af","date":"2018/5/20-23:49:39","ownerName":"Vihanga Paranahewa","ownerProfileImage":"/images/profilePics/profileImage-1527093881431.jpg","__v":{"$numberInt":"0"}
        }),
        new News({
            "_id":{"$oid":"5b01c68bbdc72e2ac89b03b0"},"imagePath":"/images/newsImage-1526843019828.jpg","title":"Roads blocked due to flood in Galle","description":"Some quick example text to build on the card title and make up the bulk of the card's content","ownerId":"5b002ff576cefe2710870c1d","eventId":"5b02b951e5650a13dcf274af","date":"2018/5/21-0:33:39","ownerName":"Vihanga Paranahewa","ownerProfileImage":"/images/profilePics/profileImage-1527093881431.jpg","__v":{"$numberInt":"0"}
        }),
        new News({
            "_id":{"$oid":"5b01c7a8bdc72e2ac89b03b1"},"imagePath":"/images/newsImage-1526843304066.jpg","title":"People are moving to safe places creating own boats","description":"Some quick example text to build on the card title and make up the bulk of the card's content","ownerId":"5b002ff576cefe2710870c1d","eventId":"5b02b951e5650a13dcf274af","date":"2018/5/21-0:38:24","ownerName":"Vihanga Paranahewa","ownerProfileImage":"/images/profilePics/profileImage-1527093881431.jpg","__v":{"$numberInt":"0"}
        }),
        new News({
            "_id":{"$oid":"5b01c817bdc72e2ac89b03b2"},"imagePath":"/images/newsImage-1526843415771.jpg","title":"People are moving to safe places by using boats","description":"Some quick example text to build on the card title and make up the bulk of the card's content","ownerId":"5b002ff576cefe2710870c1d","eventId":"5b02b951e5650a13dcf274af","date":"2018/5/21-0:40:15","ownerName":"Vihanga Paranahewa","ownerProfileImage":"/images/profilePics/profileImage-1527093881431.jpg","__v":{"$numberInt":"0"}
        }),
        new News({
            "_id":{"$oid":"5b01c845bdc72e2ac89b03b3"},"imagePath":"/images/newsImage-1526911485327.jpg","title":"Sri lankan Southern Highway Entrance (Matara) Flooded","description":"Some quick example text to build on the card title and make up the bulk of the card's content","ownerId":"5b002ff576cefe2710870c1d","eventId":"5b02b951e5650a13dcf274af","date":"2018/5/21-19:34:45","ownerName":"Vihanga Paranahewa","ownerProfileImage":"/images/profilePics/profileImage-1527093881431.jpg","__v":{"$numberInt":"0"}
        })
    ];

    News.collection.insert(news, function (err, docs) {
        assert.equal(null, err);
        res.redirect('/');
    });

});


router.get('/addVideos', function(req, res, next) {


    var videos = [
        new Video({
            "_id":{"$oid":"5b0d0be11aeac82d947077cc"},"videoLink":"https://www.youtube.com/embed/HTHm9AmFUUg","ownerId":"5b002ff576cefe2710870c1d","eventId":"5b02b951e5650a13dcf274af","ownerName":"Vihanga Paranahewa","ownerProfileImage":"/images/profilePics/profileImage-1527093881431.jpg","date":"2018/5/29-13:44:25","__v":{"$numberInt":"0"}
        }),
        new Video({
            "_id":{"$oid":"5b0d0f05359926053069b83b"},"videoLink":"https://www.youtube.com/embed/n4H1Qj16Q40","ownerId":"5b002ff576cefe2710870c1d","eventId":"5b01d4d0f6b2bc2d4c22d305","ownerName":"Vihanga Paranahewa","ownerProfileImage":"/images/profilePics/profileImage-1527093881431.jpg","date":"2018/5/29-13:57:49","__v":{"$numberInt":"0"}
        }),
        new Video({
            "_id":{"$oid":"5b0d37e0c4dc622d8440460f"},"videoLink":"https://www.youtube.com/embed/wQPvTtaZznI","ownerId":"5b002ff576cefe2710870c1d","eventId":"5b02b951e5650a13dcf274af","ownerName":"Vihanga Paranahewa","ownerProfileImage":"/images/profilePics/profileImage-1527093881431.jpg","date":"2018/5/29-16:52:8","__v":{"$numberInt":"0"}
        })
    ];




    Video.collection.insert(videos, function (err, docs) {
        assert.equal(null, err);
        res.redirect('/');
    });


});


router.use('/', isLoggedIn, function(req, res, next) {
    next();
});

router.get('/mapDelete', function(req, res, next) {

    mongo.connect(url, function (err, client) {
        const db = client.db(dbName);
        db.collection('maps').drop();
        res.redirect('/');
        client.close();
    });

});


router.get('/deviceDelete', function(req, res, next) {

    mongo.connect(url, function (err, client) {
        const db = client.db(dbName);
        db.collection('devices').drop();
        res.redirect('/');
        client.close();
    });

});


router.get('/deleteEvent', function(req, res, next) {

    Event.deleteMany({ ownerId : "5b002ff576cefe2710870c1d"},
        function (err) {
            assert.equal(null, err);
            res.redirect('/');
        });

});


router.get('/deleteNews', function(req, res, next) {

    News.deleteMany({ ownerId : "5b002ff576cefe2710870c1d"},
        function (err) {
            assert.equal(null, err);
            res.redirect('/');
        });

});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && (req.user.role === 'Admin' || req.user.role === 'Super Volunteer') ){
        return next();
    }
    res.redirect('/');
}


module.exports = router;