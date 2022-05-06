'use strict'

var express = require('express');
var FollowController = require('../controllers/follow');
var api = express.Router();
var middleWareValidate = require('../middlewares/validated');


api.post('/follow', middleWareValidate.ensureAuth, FollowController.saveFollow);
api.delete('/follow/:id', middleWareValidate.ensureAuth, FollowController.unfollow);
api.get('/following/:id?/:page?', middleWareValidate.ensureAuth, FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?', middleWareValidate.ensureAuth, FollowController.getFollowedUsers);
api.get('/get-my-follows/:followed?', middleWareValidate.ensureAuth, FollowController.getMyFollows);


module.exports = api;
