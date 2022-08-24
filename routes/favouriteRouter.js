const express =require('express');
const bodyParser =require('body-parser');
const mongoose = require('mongoose');
const Favourites = require('../models/favourites');
const Dishes = require('../models/dishes');
const User = require('../models/users');

const favRouter = express.Router();
const cors = require('./cors');
favRouter.use(bodyParser.json());
var authenticate = require('../authenticate');

favRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {  //  authenticate.verifyUser, 
    Favourites.find({}).populate({path: "user", model: "User"}).then((favs) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favs);
        }, (err) => next(err)).catch((err) => next(err));
})
.post(cors.corsWithOptions, (req, res, next) => {  //  authenticate.verifyUser, 
    const dish = Dishes.findById(req.params.dishId);
    Favourites.find({"user.user_id": "req.user._id"}, function(err, foundUser){
        if (!err){
            if(!foundUser){ // create a new fav for this user
                console.log("User does not exit")
            } else { // update the existing list

            }
        }
    })


    Favourites.create({
        dish: dish, user:user
    }).save().then((favs) => {
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.json(favs);
        console.log("favourites added" + favs );
    }, (err) => next(err)).catch((err) => next(err));
})
.put(cors.corsWithOptions,    (req, res, next) => {  // authenticate.verifyUser,
    Favourites.findByIdAndUpdate()
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.remove({}).then((result) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
    }, (err) => next(err)).catch((err) => next(err));
})

favRouter.route('/:userId').options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.post(cors.corsWithOptions,  (req, res, next) => {
    const user = User.findById(req.params.userId);
// if there are more than one dish in the array
    Favourites.create({
       user:user , { $addToSet: {  dish: dish}}
    }).then((favs) => {
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.json(favs);
        console.log("favourites added" + favs );
    }, (err) => next(err)).catch((err) => next(err));
})


// favRouter.route('/:dishId/:userId').
// options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
// .get(cors.cors,  (req, res, next) => {
//     Favourites.findById(req.params.favId).then(favs) => {
//         if(favs.indexOf(req.body) === 0) {
//             Favourites.create(req.body).then((dish) => {
//                 res.statusCode = 201;
//                 res.setHeader("Content-Type", "application/json");
//                 res.json(favs);
//                 console.log("favourite Created");
//             }, (err) => next(err)).catch((err) => next(err));
//         } else {
//         res.statusCode = 200;
//          res.setHeader('Content-Type', 'application/json');
//          res.json(favs);
//         }  
//     };

// });
//  .post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
//     Favourites.create(req.user._id, req.body.dishId )
//     // Favourites.findById(req.params.dishId)
//     .then((fav) => {
//       res.statusCode = 200;
//       console.log('Favourites created', fav);
//       res.setHeader('Content-Type', 'application/json');
//       res.json(fav);
//       }, (err) => next(err))
//       .catch((err) => next(err));
//   })
//  .put(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
//     Favourites.findByIdAndUpdate(req.user, req.params.dishId, {
//          $set: req.body
//      }, { new: true})
//      .then((leader) => {
//          res.statusCode = 200;
//          res.setHeader('Content-Type', 'application/json');
//          res.json(leader);
//          }, (err) => next(err))
//          .catch((err) => next(err));
//  })
//  .delete(cors.corsWithOptions,authenticate.verifyUser,  (req, res, next) => {
      const favorite = Favourites.findById(req.params.user.userId);
//     Favourites.findByIdAndRemove( req.params.dishId)
//      .then((res) => {
//          res.statusCode = 200;
//          res.setHeader('Content-Type', 'application/json');
//          res.json(res);
//      }, (err) => next(err))
//      .catch((err) => next(err));
//  });


module.exports = favRouter;