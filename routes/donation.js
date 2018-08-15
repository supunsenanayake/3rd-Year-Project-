var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');


var Donation = require('../models/donation');

router.use(csrfProtection);
var url = 'mongodb://localhost:27017';

const dbName= 'sahana';


router.get('/', function(req, res, next) {
    mongo.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.collection('donations').aggregate(
            [
                {$match:{eventId : req.session.eventID, donationType : req.session.donationType,
                status : { $in: [ "Pending", "Call Once", "Call Twice", "Confirm" ] } }
                },
                { $group : { _id : "$item", quantity: { $sum: "$amount"} } }
            ])
            .toArray(function (err, result) {
                assert.equal(null, err);
                res.render('donation', {donations: result, msgSuccess: req.flash('success')[0], layout : 'main'});
                req.flash('success')[0] = false;
                client.close();
            });
    });
});


router.get('/donors/:donationType', function(req, res, next) {
    req.session.donationType = req.params.donationType;
    res.redirect('/donation/');
});

router.get('/storedDonations/:donationType', function(req, res, next) {
    req.session.donationType = req.params.donationType;
    res.redirect('/donation/storedDonations');
});

router.get('/storedDonations', function(req, res, next) {

    mongo.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.collection('donations').aggregate(
            [
                {$match:{eventId : req.session.eventID, donationType : req.session.donationType,
                    status : "Success" }
                },
                { $group : { _id : "$item", quantity: { $sum: "$amount"} } }
            ])
            .toArray(function (err, result) {
                assert.equal(null, err);
                //result[0].quantity = result[0].quantity *2;
                console.log(result.length);
                res.render('storedDonation', {donations: result, msgSuccess: req.flash('success')[0], layout : 'main'});
                req.flash('success')[0] = false;
                client.close();
            });
    });

});

router.use('/', isLoggedIn, function(req, res, next) {
    next();
});

router.get('/addItem', function(req, res, next) {
    if(req.session.donationType === 'Food(Non-Perishable Only)'){
        res.render('addItem', {csrfToken: req.csrfToken(), msgSuccess: false, messages: false, layout : 'main'});
    }else if (req.session.donationType === 'Baby Items'){
        res.render('addItemBaby', {csrfToken: req.csrfToken(), msgSuccess: false, messages: false, layout : 'main'});
    }else if (req.session.donationType === 'Medical Supplies'){
        res.render('addItemMedical', {csrfToken: req.csrfToken(), msgSuccess: false, messages: false, layout : 'main'});
    } else {
        res.render('addItemOther', {csrfToken: req.csrfToken(), msgSuccess: false, messages: false, layout : 'main'});
    }

});

router.post('/addItem', function (req, res, next) {
    console.log(req.body);
    req.session.entries = parseInt(req.body.entries);
    var donations = [];
    req.session.validDonations = 0;
    for (var i = 0; i < req.session.entries; i++){
        if(req.body['itemName['+i+']'] !== '' && req.body['amount['+i+']'] !== ''
        && parseInt(req.body['amount['+i+']']) > 0){
            donations[req.session.validDonations] = new Donation({
                donorName: req.body.donorName,
                mobile: req.body.mobile,
                phone : req.user.phone,
                item: req.body['itemName['+i+']'],
                amount: req.body['amount['+i+']'],
                donationType : req.session.donationType,
                eventId : req.session.eventID,
                ownerId : req.user._id,
                province : req.user.province,
                district : req.user.district,
                profileImage : req.user.profileImage,
                status : "Pending",
                colour : "default",
                location : "None"
            });
            req.session.validDonations ++;
        }
    }
    if(donations.length === 0){
        req.flash('success', 'Oops...Invalid Donations...');
        res.redirect('/donation/donors/'+req.session.donationType+'');
    } else {
        req.session.done = 0;
        for (var j = 0; j < donations.length; j++) {
            donations[j].save(function (err, result) {
                req.session.done++;
                if (req.session.done === donations.length) {
                    req.flash('success', 'Successfully Add Only Valid Donations!');
                    res.redirect('/donation/donors/'+req.session.donationType+'');
                }
            });

        }
    }
});


router.get('/addDonation', function(req, res, next) {
    res.render('addDonation',{csrfToken: req.csrfToken(), layout : 'main'});
});

router.get('/addDonation/:id', function(req, res, next) {
    req.session.itemName = req.params.id;
    res.redirect('/donation/addDonation');
});


router.post('/addDonation', function (req, res, next) {
    req.check('amount', 'Fill Amount').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        res.render('addDonation', {csrfToken: req.csrfToken(), messages: req.session.errors, layout : 'main'});
    }else {
        var donation = new Donation({
            donorName: req.body.donorName,
            mobile: req.body.mobile,
            phone : req.user.phone,
            item: req.session.itemName,
            amount: req.body.amount,
            donationType : req.session.donationType,
            eventId : req.session.eventID,
            ownerId : req.user._id,
            province : req.user.province,
            district : req.user.district,
            profileImage : req.user.profileImage,
            status : "Pending",
            colour : "default",
            location : "None"
        });
        donation.save(function (err, result) {
            req.flash('success', 'Successfully Add your Donation!');
            res.redirect('/donation/');
        });
    }
});

router.get('/orderedDonations', function(req, res, next) {
    mongo.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.collection('donations').aggregate(
            [
                {$match:{eventId : req.session.eventID, ownerId : req.session.profileId}
                },
                { $group : { _id : "$item", quantity: { $sum: "$amount"},
                    "profileImage": { "$first": "$profileImage" },
                    "donorName": { "$first": "$donorName" },
                    "mobile": { "$first": "$mobile" }
                } }
            ])
            .toArray(function (err, result) {
                assert.equal(null, err);
                res.render('profileDonations', {donations: result, layout : 'main'});
                client.close();
            });
    });

});


router.get('/myDonations', function(req, res, next) {
    req.session.donorName = req.user.firstName + " " + req.user.lastName;
    req.session.mobile = req.user.mobile;
    req.session.profileImage = req.user.profileImage;
    req.session.profileId = req.user._id;
    res.redirect('/donation/orderedDonations');
});


router.get('/userOrderedDonations', function(req, res, next) {

    mongo.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.collection('donations').aggregate(
            [
                {$match:{eventId : req.session.eventID,
                    ownerId : req.session.profileId,
                    status : { $in: [ "Pending", "Call Once", "Call Twice", "Confirm" ] } }
                },
                { $group : { _id : "$item", quantity: { $sum: "$amount"},
                    "profileImage": {"$first": "$profileImage"},
                    "mobile": {"$first": "$mobile" },
                    "donorName": {"$first": "$donorName" }
                } }
            ])
            .toArray(function (err, result) {
                assert.equal(null, err);
                res.render('profileDonations', {donations: result, layout : 'main'});
                client.close();
            });
    });

});


router.get('/userOfferedDonations', function(req, res, next) {

    mongo.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.collection('donations').aggregate(
            [
                {$match:{eventId : req.session.eventID,
                    ownerId : req.session.profileId,
                    status : "Success" }
                },
                { $group : { _id : "$item", quantity: { $sum: "$amount"},
                    "profileImage": {"$first": "$profileImage"},
                    "mobile": {"$first": "$mobile" },
                    "donorName": {"$first": "$donorName" }
                        }}
            ])
            .toArray(function (err, result) {
                assert.equal(null, err);
                res.render('profileDonations', {donations: result, layout : 'main'});
                client.close();
            });
    });

});

router.get('/distributedDonations/:donationType', function(req, res, next) {
    req.session.donationType = req.params.donationType;
    res.redirect('/donation/distributedDonations');
});

router.get('/distributedDonations', function(req, res, next) {
    mongo.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.collection('donations').aggregate(
            [
                {$match:{eventId : req.session.eventID, donationType : req.session.donationType,
                    amount : {$lt: 0}, status : "Success" }
                },
                { $group : { _id : {item : "$item" , location : "$location"},   quantity: { $sum: "$amount"} } }
            ])
            .toArray(function (err, result) {
                assert.equal(null, err);
                for(var i = 0; i < result.length; i++){
                    result[i].quantity = result[i].quantity *(-1);
                }
                res.render('distributedDonation', {donations: result, msgSuccess: req.flash('success')[0], layout : 'main'});
                req.flash('success')[0] = false;
                client.close();
            });
    });
});


router.get('/distribute/:donationType', function(req, res, next) {
    req.session.donationType = req.params.donationType;
    res.redirect('/donation/distributedDonations');
});

router.get('/distributeList', function(req, res, next) {
    if(req.session.donationType === 'Food(Non-Perishable Only)'){
        res.render('distributeFood', {csrfToken: req.csrfToken(), msgSuccess: false, messages: false, layout : 'main'});
    }else if (req.session.donationType === 'Baby Items'){
        res.render('distributeBaby', {csrfToken: req.csrfToken(), msgSuccess: false, messages: false, layout : 'main'});
    }else if (req.session.donationType === 'Medical Supplies'){
        res.render('distributeMedical', {csrfToken: req.csrfToken(), msgSuccess: false, messages: false, layout : 'main'});
    } else {
        res.render('distributeOthers', {csrfToken: req.csrfToken(), msgSuccess: false, messages: false, layout : 'main'});
    }
});

router.get('/addDistributeDonation', function(req, res, next) {
    res.render('addDistributeDonation',{csrfToken: req.csrfToken(), layout : 'main'});
});

router.get('/addDistributeDonation/:itemName/:location', function(req, res, next) {
    req.session.itemName = req.params.itemName;
    req.session.location = req.params.location;
    res.redirect('/donation/addDistributeDonation');
});


router.post('/addDistributeDonation', function (req, res, next) {
    req.check('amount', 'Fill Amount').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        res.render('addDonation', {csrfToken: req.csrfToken(), messages: req.session.errors, layout : 'main'});
    }else {
        var donation = new Donation({
            donorName: "None",
            mobile: "None",
            phone : "None",
            item: req.session.itemName,
            amount: req.body.amount * (-1),
            donationType : req.session.donationType,
            eventId : req.session.eventID,
            ownerId : "None",
            province : "None",
            district : "None",
            profileImage : "None",
            status : "Success",
            colour : "success",
            location : req.body.location
        });
        donation.save(function (err, result) {
            req.flash('success', 'Successfully Add your Donation!');
            res.redirect('/donation/distributedDonations');
        });
    }
});


router.post('/distributeList', function (req, res, next) {
    console.log(req.body);
    req.session.entries = parseInt(req.body.entries);
    var donations = [];
    req.session.validDonations = 0;
    for (var i = 0; i < req.session.entries; i++){
        if(req.body['itemName['+i+']'] !== '' && req.body['location['+i+']'] !== '' && req.body['amount['+i+']'] !== ''
            && parseInt(req.body['amount['+i+']']) > 0){
            donations[req.session.validDonations] = new Donation({
                donorName: "None",
                mobile: "None",
                phone : "None",
                item: req.body['itemName['+i+']'],
                amount: req.body['amount['+i+']'] * (-1),
                donationType : req.session.donationType,
                eventId : req.session.eventID,
                ownerId : "None",
                province : "None",
                district : "None",
                profileImage : "None",
                status : "Success",
                colour : "success",
                location : req.body['location['+i+']']
            });
            req.session.validDonations ++;
        }
    }
    if(donations.length === 0){
        req.flash('success', 'Oops...Invalid Distribute Donations...');
        res.redirect('/donation/distribute/'+req.session.donationType+'');
    } else {
        req.session.done = 0;
        for (var j = 0; j < donations.length; j++) {
            donations[j].save(function (err, result) {
                req.session.done++;
                if (req.session.done === donations.length) {
                    req.flash('success', 'Successfully Add Only Valid Distribute Donations!');
                    res.redirect('/donation/distribute/'+req.session.donationType+'');
                }
            });

        }
    }
});




router.get('/delete', function(req, res, next) {

    mongo.connect(url, function (err, client) {
        const db = client.db(dbName);
        db.collection('donations').drop();
        res.redirect('/');
        client.close();
    });

});




function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/signIn');
}





module.exports = router;