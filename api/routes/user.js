'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var middleWareValidate = require('../middlewares/validated');

var multipart = require('connect-multiparty');
var middleWareUpload = multipart({uploadDir: './uploads/users'});

//rutas
api.get('/home', UserController.home);
api.get('/pruebas', middleWareValidate.ensureAuth, UserController.pruebas);
api.post('/signup', UserController.signUpUser);
api.post('/login', UserController.logInUser);
api.get('/user/:id', middleWareValidate.ensureAuth, UserController.getUser);
api.get('/users/:page?', middleWareValidate.ensureAuth, UserController.getUsers);
api.get('/counters/:id?', middleWareValidate.ensureAuth, UserController.getCounters);
api.put('/update-user/:id', middleWareValidate.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [middleWareValidate.ensureAuth, middleWareUpload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);


module.exports = api;