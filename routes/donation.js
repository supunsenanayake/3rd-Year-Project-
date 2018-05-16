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
                {$match:{eventId : req.session.eventID}
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

router.get('/addItem', function(req, res, next) {
    res.render('addItem', {csrfToken: req.csrfToken(), msgSuccess: false, messages: false, layout : 'main'});
});

router.post('/addItem', function (req, res, next) {
    req.check('donorName', 'Fill Donor Name').notEmpty();
    req.check('mobile', 'Fill Mobile Number').notEmpty();
    req.check('mobile', 'Invalid Mobile Number').isLength({min:10, max:10});
    req.check('itemName', 'Fill Item').notEmpty();
    req.check('amount', 'Fill Amount').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        res.render('addItem', {csrfToken: req.csrfToken(), msgSuccess: false, messages: req.session.errors, layout : 'main'});
    }else {
        var donation = new Donation({
            donorName: req.body.donorName,
            mobile: req.body.mobile,
            item: req.body.itemName,
            amount: req.body.amount,
            eventId : req.session.eventID
        });
        donation.save(function (err, result) {
            req.flash('success', 'Successfully Add your Donation!');
            res.render('addItem', {
                csrfToken: req.csrfToken(),
                msgSuccess: req.flash('success')[0],
                messages: false,
                layout: 'main'
            });
        });
    }
});

router.get('/addDonation/:id', function(req, res, next) {
    res.render('addDonation',{csrfToken: req.csrfToken(), itemName : req.params.id, layout : 'main'});
});


router.post('/addDonation', function (req, res, next) {
    req.check('donorName', 'Fill Donor Name').notEmpty();
    req.check('mobile', 'Fill Mobile Number').notEmpty();
    req.check('mobile', 'Invalid Mobile Number').isLength({min:10, max:10});
    req.check('amount', 'Fill Amount').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        res.render('addDonation', {csrfToken: req.csrfToken(), messages: req.session.errors, layout : 'main'});
    }else {
        var donation = new Donation({
            donorName: req.body.donorName,
            mobile: req.body.mobile,
            item: req.body.itemName,
            amount: req.body.amount,
            eventId : req.session.eventID
        });
        donation.save(function (err, result) {
            req.flash('success', 'Successfully Add your Donation!');
            res.redirect('/donation/');
        });
    }
});







module.exports = router;