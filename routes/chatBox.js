var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');


router.use(csrfProtection);

router.get('/msg/:msg/:address', function(req, res, next) {
    var massage=req.params.msg;
    var address=req.params.address;
res.send("get massage Reseved:"+massage+" Sender Address :"+address);

});


router.use('/', isLoggedIn, function(req, res, next) {
    next();
});


router.get('/', function(req, res, next) {
    res.render('chatBox',{layout : 'main'});
});



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && (req.user.role === 'Admin' || req.user.role === 'Super Volunteer') ){
        return next();
    }
    res.redirect('/');
}



module.exports = router;