var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    donorName : {type:String, required: true},
    mobile : {type:String, required: true},
    item : {type:String, required: true},
    amount : {type:Number, required: true},
    eventId : {type:String, required: true},
    ownerId : {type:String, required: true}
});

module.exports = mongoose.model('Donation', schema);