var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');


router.use(csrfProtection);

router.get('/msg', function(req, res, next) {
res.send("get massage reseved");
    //var parsedBody = JSON.parse(req.body);
  //  console.log(req.body);

});
router.post('/msg', function(req, res, next) {
    res.send("Post msg");
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