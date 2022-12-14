const express =require('express');
const bodyParser =require('body-parser');
const mongoose = require('mongoose');
const Favourites = require('../models/favourite');
const Dishes = require('../models/dishes');
const User = require('../models/user');

const favRouter = express.Router();
const cors = require('./cors');
favRouter.use(bodyParser.json());
var authenticate = require('../authenticate');

favRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user: req.user._id})
    .populate('user').populate('dishes')
    .then( (fav) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fav);
    }, (err) => next(err))
    .catch( (err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user: req.user._id}, (err, fav) => {
        if(err) {
            next(err);
        }
        else if(fav) {
            req.body.forEach( (dish) => {
                if( fav.dishes.indexOf(dish._id) === -1 ) {
                    fav.dishes.push(dish._id);
                }
            });
            fav.save()
            .then( (fav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err) => next(err))
            .catch( (err) => next(err));
        }
        else {
            const dishArr = [];
            req.body.forEach( (dish) => {
                dishArr.push(dish._id);
            });
            Favorites.create({
                user: req.user._id,
                dishes: dishArr
            })
            .then( (fav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err) => next(err))
            .catch( (err) => next(err));
        }
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /favorites'); 
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOneAndDelete({user: req.user._id}, (err, resp) => {
        if(err) {
            next(err);
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }
    });
});

favRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation is not supported on /favorites/' + req.params.dishId); 
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user: req.user._id}, (err, fav) => {
        if(err) {
            next(err);
        }
        else if(fav) {
            if( fav.dishes.indexOf(req.params.dishId) === -1 ) {
                fav.dishes.push(req.params.dishId);
                fav.save()
                .then( (fav) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                }, (err) => next(err))
                .catch( (err) => next(err));
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }
        }
        else {
            Favourites.create({
                user: req.user._id,
                dishes: [req.params.dishId]
            })
            .then( (fav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err) => next(err))
            .catch( (err) => next(err));
        }
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/' + req.params.dishId); 
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user: req.user._id}, (err, fav) => {
        if(err) {
            next(err);
        }
        else if(fav) {
            fav.dishes = fav.dishes.filter( (dish) => !dish._id.equals(req.params.dishId));
            fav.save()
            .then( (fav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err) => next(err))
            .catch( (err) => next(err));
        }
        else {
            const error = new Error('Your favourites list is empty');
            error.status = 400;
            next(error);
        }
    })
});

module.exports = favRouter;