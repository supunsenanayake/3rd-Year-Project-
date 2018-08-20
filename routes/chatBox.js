var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');
var messageFromDevices=require('../models/messageFromDevice');

router.use(csrfProtection);

router.get('/msg/:msg/:address', function(req, res, next) {
    var msg=req.params.msg;
    var address=req.params.address;
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    var massage = new messageFromDevices();
    massage.deviceAddress = address;
    massage.massage =massage ;
    massage.time =formatted ;
    massage.save(function (err, result) {
        if(err){
            res.send(err);
        }
        else{
            res.send("Massage Reseved:"+msg+" Sender Address :"+address+" Time :"+formatted);
        }
    });


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