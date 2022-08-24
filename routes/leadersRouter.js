const express =require('express');
const bodyParser =require('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
const cors = require('./cors');
var authenticate = require('../authenticate');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());
leaderRouter.route('/').options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    Leaders.find({})
    .then((leaders)  => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Leaders.create(req.body)
  .then((leaders) => {
    res.statusCode = 200;
    console.log('Leaders created', leaders);
    res.setHeader('Content-Type', 'application/json');
    res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put( cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation is not supported on leaders '); 
})
.delete(cors.corsWithOptions,authenticate.verifyUser,  (req, res, next) => {
    Leaders.remove({})
    .then((res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
});

leaderRouter.route('/:leaderID').options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors,  (req, res, next) => {
    Leaders.findById(req.params.leaderID)
    .then((leader) => {
     res.statusCode = 200;
     res.setHeader('Content-Type', 'application/json');
     res.json(leader);
     }, (err) => next(err))
     .catch((err) => next(err));
 })
 .post(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('POST operation not supported on /leaders/'+ res.params.leaderID);
})
 .put(cors.corsWithOptions,   (req, res, next) => {
     Leaders.findByIdAndUpdate(req.params.leaderID, {
         $set: req.body
     }, { new: true})
     .then((leader) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(leader);
         }, (err) => next(err))
         .catch((err) => next(err));
 })
 .delete(cors.corsWithOptions,  (req, res, next) => {
     Leaders.findByIdAndRemove(req.params.leaderID)
     .then((res) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(leader);
     }, (err) => next(err))
     .catch((err) => next(err));
 });


module.exports = leaderRouter;