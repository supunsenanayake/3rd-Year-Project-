var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var csrfProtection = csrf();

var Map = require('../models/map');

var assert = require('assert');

router.use(csrfProtection);

router.use('/', isLoggedIn, function(req, res, next) {
    next();
});


router.get('/', function(req, res, next) {
    res.render('uploadMapRegion',{csrfToken: req.csrfToken(), msgSuccess: req.flash('success')[0],layout : 'main'});
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

router.get('/delete', function(req, res, next) {

    mongo.connect(url, function (err, client) {
        const db = client.db(dbName);
        db.collection('maps').drop();
        res.redirect('/');
        client.close();
    });

});




function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && (req.user.role === 'Admin' || req.user.role === 'Super Volunteer') ){
        return next();
    }
    res.redirect('/');
}






module.exports = router;