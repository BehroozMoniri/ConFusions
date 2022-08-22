 
const express =require('express');
const promoRouter = express.Router();
const cors = require('./cors');
const bodyParser =require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const Promotions = require('../models/promotions');
 
promoRouter.use(bodyParser.json()); 

promoRouter.route('/')
.options(cors.corsWithOptions,authenticate.verifyUser,  (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    Promotions.find({})
    .then((promos)  => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin,   (req, res, next) => {
    Promotions.create(req.body)
  .then((promos) => {
    res.statusCode = 200;
    console.log('promo created', promos);
    res.setHeader('Content-Type', 'application/json');
    res.json(promos);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation is not supported on promos '); 
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
    Promotions.remove({})
    .then((res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, (err) => next(err))
    .catch((err) => next(err));
});

promoRouter.route('/:promoID')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {res.sendStatus(200);})
.get(cors.cors,  (req, res, next) => {
    Promotions.findById(req.params.promoID)
    .then((promo) => {
     res.statusCode = 200;
     res.setHeader('Content-Type', 'application/json');
     res.json(promo);
     }, (err) => next(err))
     .catch((err) => next(err));
 })
 .post( cors.corsWithOptions,  (req, res, next) => {
     res.statusCode = 403;
     res.end('Post operation is not supported on a promo/'+ 
     req.params.promoID); 
 })
 .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoID, {
         $set: req.body
     }, { new: true})
     .then((promo) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(promo);
         }, (err) => next(err))
         .catch((err) => next(err));
 })
 .delete( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoID)
     .then((res) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(promo);
     }, (err) => next(err))
     .catch((err) => next(err));
 });

module.exports = promoRouter;