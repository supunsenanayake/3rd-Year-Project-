var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    eventId : {type:String, required: true},
    eventTitle : {type:String, required: true},
    regionName : {type:String, required: true},
    longitudes : {type: String, required: true},
    latitudes : {type:String, required: true}
});

module.exports = mongoose.model('Map', schema);