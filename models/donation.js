var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    donorName : {type:String, required: true},
    mobile : {type:Number, required: true},
    item : {type:String, required: true},
    amount : {type:Number, required: true}
});

module.exports = mongoose.model('Donation', schema);