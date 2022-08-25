const express =require('express');
const bodyParser =require('body-parser');
const mongoose = require('mongoose');
const Favourites = require('../models/favourites');
const Dishes = require('../models/dishes');
const User = require('../models/user');

const favRouter = express.Router();
const cors = require('./cors');
favRouter.use(bodyParser.json());
var authenticate = require('../authenticate');

favRouter.route('/:dishId')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {res.sendStatus(200);})
.get(cors.cors,  (req, res, next) => {
    Favourites.findById(req.params.dishId).populate('user._id').then((faves) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(faves);
    }, (err) => next(err)).catch((err) => next(err));
})
.post( cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {  //  
    const foundDish = Dishes.findById(req.params.dishId);
    console.log("FoundDish"+foundDish);
    console.log(req.user)  
    const foundUser = User.findById( req.user._id);
    console.log(foundUser)  
   //  console.log(foundUser);
    // Favourites.findOne({user.user_id: req.user._id}, function(err, foundUser){
     //   if (!err){
            if(!foundUser){ // create a new fav for this user
                console.log("User does not exit")
            } else { // update the existing list
                const newFav = new Favourites({
                    user: req.user,
                    dish: foundDish
                });
                newFav.save();
                res.send("Successfully added a new favourite: " + newFav)
                // function(err){
                //     if (!err){
                //         res.send("Successfully added a new favourite: " + newFav);
                //     } else {
                //         res.send(err);
                //     }
                // }

            }
     //   }
    })
// })
.put(cors.corsWithOptions,  authenticate.verifyUser,  (req, res, next) => {  // 
    const dish = Favourites.findOne( req.params.dishId);
    console.log("dish",dish);
    Favourites.Update({ dish_id:req.params.dishId}, 
        {$addToSet: req.body}, {upsert:true}, function(err){
        if (!err){
            res.send("Successfully updated favourites " );
        }else{
            res.send(err);
        };
    })
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {  // 
    const dish = Favourites.findOne( req.params.dishId);
    console.log("dish",dish);
    Favourites.deleteOne({ _id : req.params.dishId },function(err) {
                                if (!err) {
                                    res.send("Successfully deleted!")
                                } else {
                                    res.send(err);
                                }
                            } )
});
module.exports = favRouter;
// favRouter.route('/:dishId').options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
// .post(cors.corsWithOptions,  (req, res, next) => {
//     const user = User.findById(req.user._id);
// // if there are more than one dish in the array
//     if (req.dish.length > 0) {
//         Favourites.create({
//        user:user , { $addToSet: {  dish: dish}}
//     }).then((favs) => {
//         res.statusCode = 201;
//         res.setHeader("Content-Type", "application/json");
//         res.json(favs);
//         console.log("favourites added" + favs );
//     }, (err) => next(err)).catch((err) => next(err));
//     } else {

//     }
    
// })


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
      // const favorite = Favourites.findById(req.user.userId);
//     Favourites.findByIdAndRemove( req.params.dishId)
//      .then((res) => {
//          res.statusCode = 200;
//          res.setHeader('Content-Type', 'application/json');
//          res.json(res);
//      }, (err) => next(err))
//      .catch((err) => next(err));
//  });


// module.exports = favRouter;