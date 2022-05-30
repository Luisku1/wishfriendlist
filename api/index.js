'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;


mongoose.connect('mongodb://localhost:27017/wishfriendlist', { useNewUrlParser: true, useUnifiedTopology: true, useMongoClient: true })
    .then(() => {

        console.log("La conexión a la base de datos es correcta");
       
        //Aquí se crea el servidor, al colocarle un escucha al puerto
        app.listen(port, () => {

            console.log("servidor corriendo en http://localhost:3800");

        })
    })
    .catch(err => console.log("ha fallado",err));
