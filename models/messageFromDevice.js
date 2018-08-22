var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    eventId:{type:String, required: true},
    deviceAddress : {type:String, required: true},
    massage : {type:String, required: true},
    time:{type:String, required: true}

});

module.exports = mongoose.model('massagesFromDevices', schema);