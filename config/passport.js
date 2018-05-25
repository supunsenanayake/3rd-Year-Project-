var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function (user_detail, done) {
    done(null, user_detail);
});

passport.deserializeUser(function (user_detail, done) {
        done(null, user_detail);
});

passport.use('local.signUp', new LocalStrategy({
    usernameField: 'username',
    passwordField: '_password',
    passReqToCallback: true
}, function (req, username, password, done) {
    req.checkBody('password', 'Password word at least have 4 characters').notEmpty().isLength({min:4});
    req.checkBody('province', 'Choose the Province Field').notEmpty();
    req.checkBody('district', 'Choose the District Field').notEmpty();
    req.checkBody('password', 'Password Not Match').notEmpty().equals(req.body.confirmPassword);
    req.checkBody('firstName', 'Fill the First Name Field').notEmpty();
    req.checkBody('lastName', 'Fill the Last Name Field').notEmpty();
    req.checkBody('gender', 'Choose the Gender Field').notEmpty();
    req.checkBody('role', 'Choose the Role Field').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'nic': (req.body.nic).toString() + "v"}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {message: 'NIC is already in use.'});
        }
        var newUser = new User();
        newUser.nic = (req.body.nic) + "v";
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.firstName = req.body.firstName;
        newUser.lastName = req.body.lastName;
        newUser.gender = req.body.gender;
        newUser.province = req.body.province;
        newUser.district = req.body.district;
        newUser.role = req.body.role;
        newUser.mobile ="+94" + (req.body.mobile).slice(1);
        newUser.phone = (req.body.phone);
        if(req.body.gender === 'Male'){
            newUser.profileImage = "https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg";
        } else {
            newUser.profileImage = "/images/lady.jpg"
        }

        newUser.save(function(err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));


passport.use('local.signIn', new LocalStrategy({
    usernameField: 'username',
    passwordField: '_password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('nic', 'NIC Field Empty').notEmpty();
    req.checkBody('password', 'Password Field Empty').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'nic': req.body.nic}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found.'});
        }
        if (!user.validPassword(req.body.password)) {
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, user);
    });
}));