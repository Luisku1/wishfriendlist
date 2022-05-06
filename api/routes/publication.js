'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');
var api = express.Router();
var middleWareValidate = require('../middlewares/validated');

var multipart = require('connect-multiparty');
var middleWareUpload = multipart({uploadDir: '.uploads/publications'});

api.get('/probando-pub', middleWareValidate.ensureAuth, PublicationController.probando);
api.post('/publication', middleWareValidate.ensureAuth, PublicationController.savePublication);
api.get('/publications/:page?', middleWareValidate.ensureAuth, PublicationController.getPublications);
api.get('/publication/:id', middleWareValidate.ensureAuth, PublicationController.getPublication);
api.delete('/publication/:id', middleWareValidate.ensureAuth, PublicationController.deletePublication);
api.post('/upload-image-pub/:id', [middleWareValidate.ensureAuth, middleWareUpload], PublicationController.uploadImage);
api.post('/get-image-pub/:imageFile', PublicationController.getImageFile);


module.exports = api;