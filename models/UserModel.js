
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    name: String,
    compamy_name:String,
    companyId:String,
    address: String,
    regdate: String,
  });
module.exports = mongoose.model('Users', UserSchema);