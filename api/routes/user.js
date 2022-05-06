'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var middleWareValidate = require('../middlewares/validated');

var multiparty = require('connect-multiparty');
var middleWareUpload = multiparty({uploadDir: './uploads/users'});

//rutas
api.get('/home', UserController.home);
api.get('/pruebas', middleWareValidate.ensureAuth, UserController.pruebas);
api.post('/register', UserController.signUpUser);
api.post('/login', UserController.logInUser);
api.get('/user/:id', middleWareValidate.ensureAuth, UserController.getUser);
api.get('/user/:page?', middleWareValidate.ensureAuth, UserController.getUsers);
api.get('/user/:page?', middleWareValidate.ensureAuth, UserController.getUsers);
api.put('/update-user/:id', middleWareValidate.ensureAuth, UserController.updateUser);
api.post('/update-image-user/:id', [middleWareValidate.ensureAuth, midleWareUpload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);


module.exports = api;