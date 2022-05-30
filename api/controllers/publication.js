'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination')
var Publication = require('../models/publication');
var Follow = require('../models/follow');

function probando(req, res)
{
    res.status(200).send({
        message: 'Hola desde EL CONTROLADOR DE PUBLICACIONES'
    });
}

function savePublication(req, res)
{
    var params = req.body;

    if(!params.namePublication || !params.text) 
    {
        return res.status(200).send({message: 'Debes ponerle un nombre y texto a tu publicación'});
    }

    var publication = new Publication();
    publication.namePublication = params.namePublication;
    publication.text = params.text;
    publication.file = params.file;
    publication.createdAt = moment().unix();
    publication.eventDate = params.eventDate;
    publication.user = req.user.sub;

    publication.save((err, publicationStored) =>
    {
        if(err) return res.status(500).send({message: 'Error al guardar la publicación'});
        if(!publicationStored) return res.status(500).send({message: 'La publicación no ha sido guardada'});

        return res.status(200).send({publication: publicationStored});
    })
}

function getPublications(req, res) 
{
    var page = 1;

    if(req.params.page)
    {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    //var userId = req.user.sub;

    Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => 
    {

        if(err) return res.status(500).send({message: 'Error al devolver el seguimiento'});

        var followsClean = [];

        follows.forEach((follow) => 
        {
            followsClean.push(follow.followed);
        });

        followsClean.push(req.user.sub)

        Publication.find({user: {"$in": followsClean}}).sort('-createdAt').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {

            if(err) return res.status(500).send({message: 'Error al devolver el publicaciones'});

            if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

            return res.status(200).send({

                totalItems: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                itemsPerPage: itemsPerPage,
                publications: publications
            })


        });

    });
}

function getPublicationsUser(req, res) 
{
    var page = 1;

    if(req.params.page)
    {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    var userId = req.user.sub;

    if(req.params.userId)
    {
        userId = req.params.userId;
    }

    Publication.find({user: userId}).sort('-createdAt').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {

        if(err) return res.status(500).send({message: 'Error al devolver el publicaciones'});

        if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

        return res.status(200).send({

            totalItems: total,
            pages: Math.ceil(total/itemsPerPage),
            page: page,
            itemsPerPage: itemsPerPage,
            publications: publications
        })
    });
}

function getPublication(req, res)
{
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) =>
    {
        if(err) return res.status(500).send({message: 'Error al devolver el publicaciones'});

        if(!publication) return res.status(404).send({message: 'No existe la publicación'});

        return res.status(200).send({publication});
    })
}

function deletePublication(req, res)
{
    var publicationId = req.params.id;



    Publication.find({'user': req.user.sub, '_id':publicationId}).remove((err) => {

        if(err) return res.status(500).send({message: 'Error al eliminar publicaciones'});
        return res.status(200).send({message: 'Publicación eliminada correctamente'});
    });
}

function uploadImage(req, res)
{
    var publicationId = req.params.id;

    if(req.files)
    {
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('/');
        var fileName = fileSplit[2];
        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'gif' || fileExt == 'jpeg')
        {
            Publication.findOne({'user':req.user.sub, '_id':publicationId}).exec((err, publication) =>
            {
                if(publication)
                {
                     //Actualizar documento de la publicación

                    Publication.findByIdAndUpdate(publicationId, {file: fileName}, {new:true}, (err, publicationUpdated) =>
                    {
                        if(err) return res.status(500).send({message: 'Error en la petición'});
                        if(!publicationUpdated) return res.status(404).send({message: 'No se ha podido actualizar'});

                        return res.status(200).send({publication: publicationUpdated});
                    });
                
                } else {

                    return removeFilesoOfUploads(res, filePath, 'No tienes permiso para actualizar esta publicación');
                }

            });
           
            
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
    var pathFile = './uploads/publications/' + imageFile;

    fs.exists(pathFile, (exists) =>
    {
        if(exists)
        {
            res.sendFile(path.resolve(pathFile));
        
        } else {

            res.status(200).send({message: 'No existe la imagen...'})
        }
    })
}

module.exports = {

    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile,
    getPublicationsUser
}