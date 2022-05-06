'use strict'

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

//Mandamo a llamar el export del archivo user.js

var User = require('../models/user');



//Rutas de prueba
function home(req, res) {

    res.status(200).send({

        message: 'Hola mundo desde el servidor de NodeJS'
    })

}

function pruebas(req, res) {

    res.status(200).send({

        message: 'Pruebas de WishhFriendList'
    })

}

//signUp del usuario
function signUpUser(req, res){

    var params = req.body;
    var user = new User();

    if(params.name && params.lastName && params.birthDay && params.phoneNumber
        && params.email && params.password)
    {
        user.name = params.name;
        user.lastName = params.lastName;
        user.birthDay = params.birthDay;
        user.phoneNumber = params.phoneNumber;
        user.email = params.email;
        user.profileImage = null;

        //Controllar que no haya usuarios duplicados
        user.find({ $or : [
            
            {email : user.email.toLowerCase()},
            {phoneNumber : user.phoneNumber}

        ]}).exec((err, users) =>{

            if(err) return res.status(500).send({message: 'Error en la petición de usuarios'});
            
            if(users && users.length >= 1){

                return res.status(200).send({message: 'El usuario que intentas registrar ya existe'});

            } else {

                //cifra la contraseña y en caso de ser exitoso el proceso
                //guarda al usuario en la base de datos
                bcrypt.hash(params.password, null, null, (err, hash) => {

                    user.password = hash;

                    user.save((err, userStored) => {

                        if(err) return res.status(500).send({message: 'Error al guardar los datos del usuario'})

                        if(userStored) 
                        {
                            res.status(200).send({user : userStored});

                        } else {

                            res.status(404).send({message : 'No se ha registrado al usuario'});
                        }

                    });

                });
            }

        });

    } else {

        res.status(200).send({
            message: 'Llena todos los campos solicitados'
        })
    }

}

//login del usuario
function logInUser(req, res)
{

    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email}, (err, user) => {

        if(err) return res.status(500).send({message: 'Error en la petición'});

        if(user){

            bcrypt.compare(password, user.password, (err, validate) =>{

                if(check)
                {
                    //El usuario se ha loggeado correctamente

                    if(params.gettoken)
                    {
                        //devolver un token
                        //generar token
                        return res.status(200).send({

                            token: jwt.createToken(user)
                        });

                    
                    } else {

                        //devolver datos de usuario
                        user.password = undefined; //Elimina la password para devolver los datos sin la password
                        return res.status(200).sed({user})
                    }
                
                } else {

                    return res.status(404).send({message: 'El usuario no se ha podido identificar'});
                }
            });

        } else {

            return res.status(404).send({message: 'El usuario con el email ' + email + ' no existe'});
        }

    });
}

//conseguir datos de un usuario
function getUser(req, res)
{
    var userId = req.params.id;

    User.findById(userId, (err, user) =>
    {
        if(err) return res.status(500).send({message: 'Error en la petición'});
        if(!user) return res.status(404).send({message: 'El usuario no existe'});

        user.password = undefined;

        return res.status(200).send({user});
    });
}

//Devolver lista de usuarios
function getUsers(req, res)
{
    var identityUserId = req.user.sub;
    var page = 1;

    if(req.params.page)
    {
        page = req.params.page;
    }

    var itemsPerPage = 1;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) =>
    {
        if(err) return res.status(500).send({message: 'Error en la petición'});

        if(!users) return res.status(404).send({message : 'No hay usuarios disponibles'});

        return res.status(200).send({
            
            users,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });
}

//Editar datos de usuario
function updateUser(req, res)
{
    var userId = req.params.id;
    var update = req.body;

    //Evitar que actualice la contraseña

    delete update.password;

    if(userId != req.user.sub)
    {
        return res.status(500).send({message: 'No tienes permiso de actualizar los datos del usuario'});
    }

    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) =>
    {
        if(err) return res.status(500).send({message: 'Error en la petición'});
        if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

        return res.status(200).send({user: userUpdated});
    });

}

//Subir la imagen de perfil del usuario

function uploadImage(req, res)
{
    var userId = req.params.id;

    if(userId != req.user.sub)
    {
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'})
    }

    if(req.files)
    {
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];
        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        if(userId != req.user.sub)
        {
            return removeFilesoOfUploads(res, filePath, 'No tienes permiso para actualizar los datos del usuario');
        }

        if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'gif')
        {
            //Actualizar documento de usuario loggeado

            User.findByIdAndUpdate(userId, {image: fileName}, {new:true}, (err, userUpdated) =>
            {
                if(err) return res.status(500).send({message: 'Error en la petición'});
                if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

                return res.status(200).send({user: userUpdated});
            })
            
        } else {

            return removeFilesoOfUploads(res, filePath, 'No tienes permiso para actualizar los datos del usuario');
        }


    } else {

        return res.status(200).send({message: 'No se han subido imágenes'});
    }
}

function removeFilesoOfUploads(res, filePath, message)
{
    fs.unlink(filePath, (err) =>
    {
        if(err) return res.status(200).send({message: message});
    })
}

function getImageFile(req, res)
{
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/' + image_file;

    fs.exists(pathFile, (exists) =>
    {
        if(exists)
        {
            res.sendFile(path.resolve(pathFile));
        
        } else {

            res.stauts(200).send({message: 'No existe la imagen...'})
        }
    })
}

module.exports = {

    home,
    pruebas,
    signUpUser,
    logInUser,
    getUser,
    getUsers,
    updateUser,
    getImageFile
}