'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WishObjectSchema = Schema({

    name : String,
    price : String,
    objectUrl : String,
    user : {type : Schema.ObjectId, ref: 'User'}

});

module.exports = mongoose.model('WishObject', WishObjectSchema);