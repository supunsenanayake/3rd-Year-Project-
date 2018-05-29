var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    videoLink : {type:String, required: true},
    ownerId : {type:String, required: true},
    eventId : {type:String, required: true},
    ownerName : {type:String, required: true},
    ownerProfileImage : {type:String, required: true},
    date : {type:String, required: true}
});

module.exports = mongoose.model('Video', schema);