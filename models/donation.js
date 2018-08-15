var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    donorName : {type:String, required: true},
    mobile : {type:String, required: true},
    phone : {type:String, required: true},
    item : {type:String, required: true},
    amount : {type:Number, required: true},
    donationType : {type:String, required: true},
    eventId : {type:String, required: true},
    ownerId : {type:String, required: true},
    province : {type:String, required: true},
    district : {type:String, required: true},
    profileImage : {type:String, required: true},
    status : {type:String, required: true},
    colour : {type:String, required: true},
    location : {type:String, required: true}
});

module.exports = mongoose.model('Donation', schema);