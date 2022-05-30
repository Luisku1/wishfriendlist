'user strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Preparamos el modelo con el Json
var UserSchema = Schema({

    name : String,
    lastName : String,
    birthDate : String,
    phoneNumber : String,
    profileImage : String,
    email : String,
    password : String

});

module.exports = mongoose.model('User', UserSchema);

