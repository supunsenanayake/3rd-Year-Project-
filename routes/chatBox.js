var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');

var Device = require('../models/device');
var Event = require('../models/event');

router.use(csrfProtection);

router.get('/msg/:msg/:address', function(req, res, next) {
    var msg = req.params.msg;
    var address = req.params.address;
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    var msgArray="r99;180.791;6.947;81.132;6.956;".split('');


    if(msgArray[0]==='r'){
        console.log(msgArray.length);
        var LatitudeandLongitude="r99;180.791;6.947;".split(';');
        if(LatitudeandLongitude.length===6){
            var region=LatitudeandLongitude[0];
            var location1={lat:LatitudeandLongitude[1],log:LatitudeandLongitude[2]};
            var location2={lat:LatitudeandLongitude[3],log:LatitudeandLongitude[4]};
        }else if(LatitudeandLongitude.length===4){
            var region_=LatitudeandLongitude[0];
            var location1_={lat:LatitudeandLongitude[1],log:LatitudeandLongitude[2]};
        }
        else{
            console.log("else",LatitudeandLongitude);
            //think as just a message
        }
    }else{
        //just message
    }
    //console.log(msgArray);

    /*Event.find().sort({_id : -1}).limit(1).exec(function (err, docs) {
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
    });*/
});



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
