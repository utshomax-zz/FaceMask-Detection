
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DtcSchema = new Schema({
    state: {type: Boolean, required: true},
    dateTime: {type: String, required:true},
});


// Export the model
var Dtc = module.exports = mongoose.model('Dtc', DtcSchema);
module.exports.get = function (callback, limit) {
    Dtc.find(callback)
    .sort({dateTime: 1})
    .limit(limit); 
 }