const path = require('path');
const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const PhotoService = require('./photo-service');
const photoRouter = express.Router();
const UsersService = require('../users/users-service');
const jsonParser = express.json();


photoRouter
.route('/')
.all(requireAuth)
// .all(checkIfPhotoExists)
.post(jsonParser, async (req, res, next) => {
    //This route is used to delete an individual photo by photo url.  Using a post because cannot pass a request body in DELETE method, and cannot send url as a paramater/query string
    try {
        const photo = await PhotoService.getPhotoByUrl(req.app.get('db'), req.body.photo)
        if(!photo) {
            return res.status(404).json({error: 'Photo does not exist'})
        }
        await PhotoService.deletePhoto(req.app.get('db'), photo.id)
        return res.status(204).end();
    } catch(error) {
        next(error);
    }
//    PhotoService.deletePhotoByUrl(req.app.get('db'), req.body.photo)
//    .then(() => {
//        res.status(204).end()
//    })
//    .catch(next);
})

async function checkIfPhotoExists (req, res, next) {
    try {
        const photo = await PhotoService.getPhotoByUrl(req.app.get('db'), req.body.photo)
        if(!photo) {
            return res.status(404).json({
                error: 'photo not found'
            })
        }
        res.photo = photo;
    } catch(error) {
        next(error)
    }
}


module.exports = photoRouter;