
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;
mongoose.Promise = global.Promise
var UserSchema = new Schema({
    userName: String
    , password: String
});
var ShujuSchema= new Schema({
    time: Number
    , title: String
    , url: String
    , money: String
    , select_web_name: String
});
var userShujuSchema= new Schema({
    userName: String
    , iphoneNumber: String
    , keywords: Array
    , notice:Boolean
    , select_web : Array
    , waitTime : Number

});
module.exports.user = mongoose.model('user', UserSchema);
module.exports.userShuju = mongoose.model('userShuju', userShujuSchema);
module.exports.shuju = mongoose.model('shuju', ShujuSchema);