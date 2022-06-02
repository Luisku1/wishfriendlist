'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'wishfriendlists_security_authentication_key';

exports.createToken = function(user)
{
    var payload = {

        sub: user._id,
        name: user.name,
        lastName: user.lastName,
        birthDay: user.birthDay,
        phoneNumber: user.phoneNumber,
        email: user.email,
        profileImage: user.profileImage,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, secretKey);
}
