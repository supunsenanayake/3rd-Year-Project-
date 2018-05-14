var passport = require('passport');
var donation = require('../models/donation');
var LocalStrategy = require('passport-local').Strategy;

passport.use('local.addItem', new LocalStrategy({
    donorNameField: 'donorName',
    mobileField: 'mobile',
    itemField: 'item',
    amountField: 'amount',
    passReqToCallback: true
}, function (req, donorName, mobile, item, amount, done) {
    console.log(amount);
    var quantity = req.body.amount;
    if(quantity <= 0){
        return done(null, false, {message: 'Invalid Amount.'});
    }
    req.checkBody('donorName', 'Fill Donor Name').notEmpty().isEmail();
    req.checkBody('mobile', 'Invalid Mobile Number').notEmpty().isLength({min:10, max:10});
    req.checkBody('item', 'Fill Item').notEmpty();
    req.checkBody('amount', 'Fill Amount').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    var newDonation = new Donation();
    newDonation.donorName = donorName;
    newDonation.mobile = mobile;
    newDonation.item = item;
    newDonation.amount = amount;
    newDonation.save(function(err, result) {
        if (err) {
            return done(err);
        }
        return done(null, newDonation);
    });
}));
