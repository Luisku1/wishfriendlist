'use strict'

var express = require('express');
var WishObjectController = require('../controllers/wishObject');
var api = express.Router();
var middleWareValidate = require('../middlewares/validated');

api.post('/wishobject', middleWareValidate.ensureAuth, WishObjectController.saveWishObject);
api.get('/wishlist-user/:userId/:page?', middleWareValidate.ensureAuth, WishObjectController.getWishObjectsUser);
api.delete('/wishobject/:id', middleWareValidate.ensureAuth, WishObjectController.deleteWishObject);

module.exports = api;