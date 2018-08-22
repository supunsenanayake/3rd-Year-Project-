var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var csrfProtection = csrf();

var Map = require('../models/map');


var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017';

const dbName= 'sahana';

router.use(csrfProtection);

router.use('/', isLoggedIn, function(req, res, next) {
    next();
});


router.get('/', function(req, res, next) {
    mongo.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.collection('maps').aggregate(
            [
                {$match:{eventId : req.session.eventID }
                },
                { $group : { _id : "$regionName"} }
            ])
            .toArray(function (err, result) {
                console.log(result);
                res.render('uploadMapRegion',{csrfToken: req.csrfToken(), msgSuccess: req.flash('success')[0], regions : result, layout : 'main'});
                req.flash('success')[0] = false;
                client.close();
            });
    });
});


router.post('/', function(req, res, next) {
    console.log(req.body);
    req.session.entries = parseInt(req.body.entries);
    var disasterPolygon = [];
    req.session.validDonations = 0;
    for (var i = 0; i < req.session.entries; i++){
        if(req.body['latitudes['+i+']'] !== '' && req.body['longitudes['+i+']'] !== ''){
            disasterPolygon[req.session.validDonations] = new Map({
                eventId: req.session.eventID,
                eventTitle: req.session.eventTitle,
                regionName : req.body.regionName,
                longitudes: req.body['longitudes['+i+']'],
                latitudes: req.body['latitudes['+i+']']
            });
            req.session.validDonations ++;
        }
    }
    if(disasterPolygon.length === 0){
        req.flash('success', 'Oops...Invalid Location...');
        res.redirect('/map/');
    } else {
        req.session.done = 0;
        for (var j = 0; j < disasterPolygon.length; j++) {
            disasterPolygon[j].save(function (err, result) {
                req.session.done++;
                if (req.session.done === disasterPolygon.length) {
                    res.redirect('/');
                }
            });

        }
    }
});


router.get('/deleteEvent', function(req, res, next) {

    Event.deleteMany({ ownerId : "5b002ff576cefe2710870c1d"},
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