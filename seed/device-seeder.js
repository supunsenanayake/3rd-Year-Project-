var Device = require('../models/device');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sahana');

var messages = [
    new Device({
        eventId : '5b02b951e5650a13dcf274af',
        deviceAddress : 'Device one',
        message : 'More Donations want',
        time : '2018/08/22-14:06:34'
    }),
    new Device({
        eventId : '5b02b951e5650a13dcf274af',
        deviceAddress : 'Device Two',
        message : 'Need Help',
        time : '2018/08/22-14:46:54'
    }),
    new Device({
        eventId : '5b01d2e4f6b2bc2d4c22d303',
        deviceAddress : 'Device one',
        message : 'Reached for the place',
        time : '2018/08/22-15:00:21'
    })
];

var done = 0;
for (var i = 0; i< messages.length; i++){
    messages[i].save(function (err, result) {
        done ++;
        if(done === messages.length){
            mongoose.disconnect();
        }
    });

}