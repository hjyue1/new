
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    userName: String
    , password: String
});
var ShujuSchema= new Schema({
    time: Number
    , title: String
    , url: String
    , money: String
    , web_name: String
});
var userShujuSchema= new Schema({
    userName: String
    , cycleTime: Number
    , frequency: Number
    , iphoneNumber: String
    , keywords: Array
    , notice:Boolean
    , select_web : Array
    , waitTime : Number

});
module.exports.user = mongoose.model('user', UserSchema);
module.exports.userShuju = mongoose.model('userShuju', userShujuSchema);
module.exports.shuju = mongoose.model('shuju', ShujuSchema);