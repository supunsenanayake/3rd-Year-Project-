var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath : {type:String, required: true},
    title : {type:String, required: true},
    ownerId : {type: String, required: true},
    date : {type:String, required: true},
    ownerName : {type:String, required: true},
    ownerProfileImage : {type:String, required: true}
});

module.exports = mongoose.model('Event', schema);