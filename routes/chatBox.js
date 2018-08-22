var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');

var Device = require('../models/device');
var Event = require('../models/event');
var Map = require('../models/map');

var mongoose = require('mongoose');

router.use(csrfProtection);

router.get('/msg/:msg/:address', function(req, res, next) {
    var msg = req.params.msg;
    var address = req.params.address;
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    var msgArray= msg.split('');
    var map = [];


    if(msgArray[0]==='r'){
        console.log(msgArray.length);
        var LatitudeandLongitude= msg.split('');
        if(LatitudeandLongitude.length===6){
            map = [
                new Map({
            eventId :req.session.eventID,
            eventTitle : req.session.eventTitle,
            regionName : LatitudeandLongitude[0],
            longitudes : LatitudeandLongitude[1],
            latitudes : LatitudeandLongitude[2]}),
                new Map({
                    eventId :req.session.eventID,
                    eventTitle : req.session.eventTitle,
                    regionName : LatitudeandLongitude[0],
                    longitudes : LatitudeandLongitude[3],
                    latitudes : LatitudeandLongitude[4]})
        ];

            autoMapMark(map);

        }else if(LatitudeandLongitude.length===4){


            map = [
                new Map({
                    eventId :req.session.eventID,
                    eventTitle : req.session.eventTitle,
                    regionName : LatitudeandLongitude[0],
                    longitudes : LatitudeandLongitude[1],
                    latitudes : LatitudeandLongitude[2]})
            ];

            autoMapMark(map);

        }
        else{
            storeMessages(res, msg, address, formatted);
        }
    }else{

        storeMessages(res, msg, address, formatted);

    }
});


function autoMapMark(map) {
    var done = 0;
    for (var i = 0; i< map.length; i++){
        map[i].save(function (err, result) {
            done ++;
            if(done === map.length){
                mongoose.disconnect();
            }
        });

    }
}


function storeMessages(res , msg, address, formatted) {


    Event.find().sort({_id : -1}).limit(1).exec(function (err, docs) {
        var messages = new Device();
        messages.eventId = docs[0]._id;
        messages.deviceAddress = address;
        messages.message = msg;

        messages.time = formatted;
        messages.save(function (err, result) {
            if (err) {
                res.send(err);
            }
            else {
                res.send("Massage Reserved:" + msg + " Sender Address :" + address + " Time :" + formatted);
            }
        });
    });


}



router.use('/', isLoggedIn, function(req, res, next) {
    next();
});


router.get('/', function(req, res, next) {
    res.render('chatBox',{layout : 'main'});
});

router.get('/deviceMessageBox', function(req, res, next) {
    Device.find({eventId : req.session.eventID}).exec(function (err, result) {
        console.log(result);
        res.render('deviceMessageBox', {messages: result, layout: 'main'});
        });

});





function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && (req.user.role === 'Admin' || req.user.role === 'Super Volunteer') ){
        return next();
    }
    res.redirect('/');
}





module.exports = router;
