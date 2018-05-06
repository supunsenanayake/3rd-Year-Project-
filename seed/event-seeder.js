var Event = require('../models/event');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sahana');

var events = [
    new Event({
        imagePath : '/images/DISASTER-1-640x229.jpg',
        title : 'Sri Lanka Southern Province has flood',
        date : '3 mins ago'
    }),
    new Event({
        imagePath : '/images/22maple5.jpg',
        title : 'Sri lanka, anuradhapura facing worst Drought',
        date : '2 months ago'
    }),
    new Event({
        imagePath : '/images/image_1498680527-608d81d147.jpg',
        title : 'Sri lanka, Mithotamulla Garbage dump collapse to houses',
        date : '6 months ago'
    }),
    new Event({
        imagePath : '/images/a6s8a.jpg',
        title : 'Sri lanka Colombo has facing a Storm',
        date : '7 months ago'
    })
    ];

var done = 0;
for (var i = 0; i< events.length; i++){
    events[i].save(function (err, result) {
        done ++;
        if(done === events.length){
            mongoose.disconnect();
        }
    });

}