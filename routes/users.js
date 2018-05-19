var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');


router.use(csrfProtection);

/* GET users listing. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next) {
    next();
});

router.get('/signUp', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signUp', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, layout : 'user'});
});

router.post('/signUp', passport.authenticate('local.signUp', {
    successRedirect: '/users/signUp',
    failureRedirect: '/users/signUp',
    failureFlash: true
}));

router.get('/signIn', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signIn', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, layout : 'user'});
});

router.post('/signIn', passport.authenticate('local.signIn', {
    successRedirect: '/',
    failureRedirect: '/users/signIn',
    failureFlash: true
}));


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


module.exports = router;
