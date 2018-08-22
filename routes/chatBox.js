var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');

var messageFromDevice=require('../models/messageFromDevice');
var Event = require('../models/event');

router.use(csrfProtection);

router.get('/msg/:msg/:address', function(req, res, next) {
    var msg=req.params.msg;
    var address=req.params.address;
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    Event.find().sort({_id : -1}).limit(1).exec(function (err, docs) {
        var massage = new messageFromDevice();
        message.eventId = docs[0]._id;
        massage.deviceAddress = address;
        massage.massage = massage;
        massage.time = formatted;
        massage.save(function (err, result) {
            if (err) {
                res.send(err);
            }
            else {
                res.send("Massage Reseved:" + msg + " Sender Address :" + address + " Time :" + formatted);
            }
        });
    });
});



router.use('/', isLoggedIn, function(req, res, next) {
    next();
});


router.get('/', function(req, res, next) {
    res.render('chatBox',{layout : 'main'});
});

router.get('/deviceMessageBox', function(req, res, next) {
    messageFromDevice.find({eventId : req.session.eventID}).exec(function (err, docs) {
        var messageChunks = [];
        var chunkSize = 2;
        for (var i = 0; i < docs.length; i += chunkSize) {
            messageChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('deviceMessageBox', {messages: messageChunks, layout: 'main'});
        });

});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && (req.user.role === 'Admin' || req.user.role === 'Super Volunteer') ){
        return next();
    }
    res.redirect('/');
}



module.exports = router;