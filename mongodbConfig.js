
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    userid: String
    , password: String
});
var ShujuSchema= new Schema({
    time: Number
    , title: String
    , url: String
    , money: String
});
module.exports.user = mongoose.model('user', UserSchema);
module.exports.shuju = mongoose.model('shuju', ShujuSchema);