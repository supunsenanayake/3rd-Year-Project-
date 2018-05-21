var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();

var User = require('../models/user');

var assert = require('assert');

router.use(csrfProtection);


router.use('/', isLoggedIn, function(req, res, next) {
    next();
});


router.get('/', function(req, res, next) {
    res.render('createUser', { csrfToken: req.csrfToken(), noErr : false, msgSuccess : false, messages : false, layout : 'main'});
});

router.post('/', function(req, res, next) {
    req.checkBody('nic', 'Invalid NIC Number').notEmpty().isLength({min:11, max: 11});
    req.checkBody('password', 'Password word at least have 4 characters').notEmpty().isLength({min:4});
    req.checkBody('mobile', 'Invalid Mobile No').notEmpty().isLength({min:10, max:10});
    req.checkBody('phone', 'Invalid Tel-No').notEmpty().isLength({min:10, max:10});
    req.checkBody('province', 'Choose the Province Field').notEmpty();
    req.checkBody('district', 'Choose the District Field').notEmpty();
    req.checkBody('password', 'Password Not Match').notEmpty().equals(req.body.confirmPassword);
    req.checkBody('firstName', 'Fill the First Name Field').notEmpty();
    req.checkBody('lastName', 'Fill the Last Name Field').notEmpty();
    req.checkBody('gender', 'Choose the Gender Field').notEmpty();
    req.checkBody('role', 'Choose the Role Field').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        res.render('createUser', { csrfToken: req.csrfToken(), noErr : false, msgSuccess : false, messages : req.session.errors, layout : 'main'});
    } else {
        var newUser = new User();
        newUser.nic = (req.body.nic).toString() + "v";
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.firstName = req.body.firstName;
        newUser.lastName = req.body.lastName;
        newUser.gender = req.body.gender;
        newUser.province = req.body.province;
        newUser.district = req.body.district;
        newUser.role = req.body.role;
        newUser.mobile ="+94" + (req.body.mobile).toString().slice(1);
        newUser.phone = (req.body.phone).toString();
        newUser.profileImage = "https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg";
        newUser.save(function(err, result) {
            assert.equal(null, err);
            req.flash('success', 'Successfully Add New System User!');
            res.render('createUser', { csrfToken: req.csrfToken(), noErr : true, msgSuccess : req.flash('success')[0], messages : false, layout : 'main'});
        });
    }
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;