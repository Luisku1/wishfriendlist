'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination')
var WishObject = require('../models/wishObject');
var Follow = require('../models/follow');

function saveWishObject(req, res)
{
    var params = req.body;

    if(!params.name || !params.price) 
    {
        return res.status(200).send({message: 'Se deben especificar nombre y precio del producto'});
    }

    var wishObject = new WishObject();
    wishObject.name = params.name;
    wishObject.price = params.price;
    wishObject.objectUrl = params.objectUrl;
    wishObject.user = req.user.sub;

    wishObject.save((err, wishObjectStored) =>
    {
        if(err) return res.status(500).send({message: 'Error al guardar la publicación'});
        if(!wishObjectStored) return res.status(500).send({message: 'La publicación no ha sido guardada'});

        return res.status(200).send({wishObject: wishObjectStored});
    })
}

function getWishObjectsUser(req, res) 
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

    WishObject.find({user: userId}).sort('-createdAt').populate('user').paginate(page, itemsPerPage, (err, wishList, total) => {

        if(err) return res.status(500).send({message: 'Error al devolver la lista de deseos'});

        if(!wishList) return res.status(404).send({message: 'No hay objetos en la lista'});

        return res.status(200).send({

            totalItems: total,
            pages: Math.ceil(total/itemsPerPage),
            page: page,
            itemsPerPage: itemsPerPage,
            wishList: wishList
        })
    });
}

function deleteWishObject(req, res)
{
    var wishObjectId = req.params.id;



    WishObject.find({'user': req.user.sub, '_id':wishObjectId}).remove((err) => {

        if(err) return res.status(500).send({message: 'Error al eliminar objetos '});
        return res.status(200).send({message: 'Publicación eliminada correctamente'});
    });
}

module.exports = {

    saveWishObject,
    getWishObjectsUser,
    deleteWishObject
}