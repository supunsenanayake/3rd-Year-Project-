var News = require('../models/news');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sahana');

var news = [
    new News({
        imagePath : '/images/sri-lanka-flood.jpg',
        title : 'Roads blocked due to flood in Galle',
        description : 'Some quick example text to build on the card title and make up the bulk of the card\'s content',
        eventId : '5aef19ac9b895918a0bb8069',
        date : '5 mins ago'
    }),
    new News({
        imagePath : '/images/sri-lanka-floods-759.jpg',
        title : 'People are moving to safe places by using boats ',
        description : 'Some quick example text to build on the card title and make up the bulk of the card\'s content',
        eventId : '5aef19ac9b895918a0bb8069',
        date : '8 mins ago'
    }),
    new News({
        imagePath : '/images/sri-lanka-reuters11.jpg',
        title : 'People are moving to safe places',
        description : 'Some quick example text to build on the card title and make up the bulk of the card\'s content',
        eventId : '5aef19ac9b895918a0bb8069',
        date : '10 mins ago'
    }),
    new News({
        imagePath : '/images/580170-lanka-floods-reuters.jpg',
        title : 'Sri lankan Southern Highway Entrance(Matara) Flooded',
        description : 'Some quick example text to build on the card title and make up the bulk of the card\'s content',
        eventId : '5aef19ac9b895918a0bb8069',
        date : '15 mins ago'
    })
];

var done = 0;
for (var i = 0; i< news.length; i++){
    news[i].save(function (err, result) {
        done ++;
        if(done === news.length){
            mongoose.disconnect();
        }
    });

}