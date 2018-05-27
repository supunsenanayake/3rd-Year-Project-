var express = require('express');
var router = express.Router();

var mongo = require('mongodb').MongoClient;
var assert = require('assert');


var Donation = require('../models/donation');


var url = 'mongodb://localhost:27017';

const dbName= 'sahana';


router.use('/', isLoggedIn, function(req, res, next) {
    next();
});


router.get('/', function(req, res, next) {
    res.render('handlingDonations/searchDonors', {layout : 'main'});
});




router.get('/viewDonations', function(req, res, next) {

    mongo.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.collection('donations').aggregate(
            [
                {$match:{eventId : req.session.eventID, ownerId : req.session.profileId,
                status : req.session.status }
                },
                { $group : { _id : "$item", quantity: { $sum: "$amount"},
                    "profileImage": { "$first": "$profileImage" },
                    "donorName": { "$first": "$donorName" },
                    "mobile": { "$first": "$mobile" },
                    "status": {"$first": "$status"},
                    "province": { "$first": "$province" },
                    "district": { "$first": "$district" },
                    "phone": { "$first": "$phone"
                }} }
            ])
            .toArray(function (err, result) {
                assert.equal(null, err);
                res.render('handlingDonations/viewDonations', {donations: result, layout : 'main'});
                client.close();
            });
    });

});


router.get('/viewDonations/:id/:status', function(req, res, next) {

    req.session.profileId = req.params.id;
    req.session.status = req.params.status;
    res.redirect('/handlingDonations/viewDonations');

});

router.post('/updateStatus', function(req, res, next) {
    if(req.body.status === 'Pending'){
        req.session.colour = "default";
    } else if(req.body.status === 'Call Once'){
        req.session.colour = "warning";
    } else if(req.body.status === 'Call Twice'){
        req.session.colour = "danger";
    } else if (req.body.status === 'Confirm'){
        req.session.colour = "primary";
    } else {
        req.session.colour = "success";
    }

    Donation.update({ownerId : req.session.profileId ,
        status : req.session.status}, { $set: {

        status : req.body.status,
        colour : req.session.colour

    }}, { multi: true }, function (err, docs) {
        assert.equal(null, err);
        res.redirect('/handlingDonations/searchDonors');
    });

});

router.post('/search', function(req, res, next) {
    req.session.status = req.body.status;
    req.session.province = req.body.province;
    req.session.district = req.body.district;
    res.redirect('/handlingDonations/searchDonors');
});

router.get('/searchDonors', function(req, res, next) {


    mongo.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.collection('donations').aggregate(
            [
                {$match:{
                    eventId : req.session.eventID,
                    status : req.session.status,
                    province : req.session.province,
                    district : req.session.district
                }
                },
                { $group : { _id : "$ownerId" ,
                    "donorName": { "$first": "$donorName" },
                    "status": { "$first": "$status" },
                    "colour": { "$first": "$colour" },
                    "profileImage": {"$first": "$profileImage" }
                }
                },
                {$sort : {_id : 1}}
            ])
            .toArray(function (err, result) {
                assert.equal(null, err);
                res.render('handlingDonations/donors', {donors : result, layout : 'main'});
                client.close();
            });
    });

});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && (req.user.role === 'Admin' || req.user.role === 'Super Volunteer')) {
        return next();
    }
    res.redirect('/');
}





module.exports = router;