const express =require('express');
const bodyParser =require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const dishRouter = express.Router();
const cors = require('./cors');
dishRouter.use(bodyParser.json());
var authenticate = require('../authenticate');

dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    Dishes.find({}).populate('comments.author')
        .then((dishes) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dishes);
        }, (err) => next(err)).catch((err) => next(err));
})
.post(cors.corsWithOptions,   (req, res, next) => {
    Dishes.create(req.body).then((dish) => {
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
        console.log("Dish Created");
    }, (err) => next(err)).catch((err) => next(err));
})

.put(cors.corsWithOptions,    (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
             $set: req.body
         }, { new: true})
         .then((leader) => {
             res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.json(leader);
             }, (err) => next(err))
             .catch((err) => next(err));
})

.delete(cors.corsWithOptions,   (req, res, next) => {
    Dishes.remove({}).then((result) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
    }, (err) => next(err)).catch((err) => next(err));
})

dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors,  (req, res, next) => {
    Dishes.findById(req.params.dishId).populate('comments.author').then((dishes) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dishes);
    }, (err) => next(err)).catch((err) => next(err));
})

.post(cors.corsWithOptions,   (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /dishes/' + req.params.dishId);
})

.put(cors.corsWithOptions, (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {
        new: true
    }).then((dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
    }, (err) => next(err)).catch((err) => next(err));
})

.delete(cors.corsWithOptions, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId).then((result) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
    }, (err) => next(err)).catch((err) => next(err));
});

dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishId).populate('comments.author').then((dish) => {
        if (dish != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments);
        } else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err)).catch((err) => next(err));
})
.post(cors.corsWithOptions, (req, res, next) => {
    Dishes.findById(req.params.dishId).then((dish) => {
        if (dish != null) {
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save().then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => next(err)).catch((err) => next(err));
        } else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err)).catch((err) => next(err));
})

.put( cors.corsWithOptions,  (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /dishes/' + req.params.dishId + '/comments');
})

.delete(cors.corsWithOptions,   (req, res, next) => {
    Dishes.findById(req.params.dishId).then((dish) => {
        if (dish != null) {
            console.log(dish);
            for (var i = (dish.comments.length - 1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save().then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => next(err)).catch((err) => next(err));
        } else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err)).catch((err) => next(err));
})

dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors,  (req, res, next) => {
    Dishes.findById(req.params.dishId).populate('comments.author').then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments.id(req.params.commentId));
        } else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err)).catch((err) => next(err));
})

.post(cors.corsWithOptions,   (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId);
})
.put(cors.corsWithOptions,  (req, res, next) => {
    Dishes.findById(req.params.dishId).then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId)) {
            if (dish.comments.id(req.params.commentId).author.toString() != req.user._id.toString()) {
                err = new Error('You are not authorized to edit this comment');
                err.status = 403;
                return next(err);
            }
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }

            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save().then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => next(err)).catch((err) => next(err));
        } else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err)).catch((err) => next(err));
})
.delete(cors.corsWithOptions,  (req, res, next) => {
    Dishes.findById(req.params.dishId).then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId)) {
            if (dish.comments.id(req.params.commentId).author.toString() != req.user._id.toString()) {
                err = new Error('You are not authorized to edit this comment');
                err.status = 403;
                return next(err);
            }
            dish.comments.id(req.params.commentId).remove();
            dish.save().then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => next(err)).catch((err) => next(err));
        } else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err)).catch((err) => next(err));
});

module.exports = dishRouter;

// dishRouter.route('/')
// .get((req, res, next) => {
//     Dishes.find({})
//     .populate('comments.author')
//     .then((dishes)  => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(dishes);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post(authenticate.verifyUser, (req, res, next) => {
//   Dishes.create(req.body)
//   .then((dish) => {
//     res.statusCode = 200;
//     console.log('Dish created', dish);
//     res.setHeader('Content-Type', 'application/json');
//     res.json(dishes);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .put(authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('Put operation is not supported on dishes '); 
// })
// .delete(authenticate.verifyUser, (req, res, next) => {
//     Dishes.remove({})
//     .then((res) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(dishes);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });

// dishRouter.route('/:dishID')
// .get( (req, res, next) => {
//    Dishes.findById(req.params.dishID)
//    .populate('comments.author')
//    .then((dish) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json(dish);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post(authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('Post operation is not supported on a dish/'+ 
//     req.params.dishID); 
// })
// .put(authenticate.verifyUser, (req, res, next) => {
//     Dishes.findByIdAndUpdate(req.params.dishID, {
//         $set: req.body
//     }, { new: true})
//     .then((dish) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(dish);
//         }, (err) => next(err))
//         .catch((err) => next(err));
// })
// .delete(authenticate.verifyUser, (req, res, next) => {
//     Dishes.findByIdAndRemove(req.params.dishID)
//     .then((res) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(dish);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });

// dishRouter.route('/:disID/comments')
// .get((req, res, next) => {
//     Dishes.findById(reeq.params.dishID)
//     .populate('comments.author')
//     .then((dish)  => {
//         if (dish!= null) {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(dish.comments);
//         }
//         else {
//             err = new Error('Dish ' + req.params.dishID + ' Not found')
//             err.status = 404;
//             return next(err)
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post(authenticate.verifyUser, (req, res, next) => {
//     Dishes.findById(reeq.params.dishID)
//     .then((dish)  => {
//         if (dish!= null) {
//         req.body.author = req.user._id
//         dish.comments.push(req.body);
//         dish.save().then((dish) =>{
//             Dishes.findById(dish._id)
//                 .populate('comments.author')
//                 .then((dish) => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json(dish);
//                 })
//         }, (err) => next(err));
   
//         }
//         else {
//             err = new Error('Dish ' + req.params.dishID + ' Not found')
//             err.status = 404;
//             return next(err)
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .put(authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('Put operation is not supported on /dishes/ '+
//     req.params.dishID + '/comments'); 
// })
// .delete(authenticate.verifyUser, (req, res, next) => {
//     Dishes.findById(reeq.params.dishID)
//     .then((dish)  => {
//         if (dish!= null) {
//             for (var i = (dish.comments.length -1); i>=0; i--){
//             dish.comments.id(dish.comments[i]._id).remove();
//         }
//         dish.save().then((dish) =>{
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(dish);
//         }, (err) => next(err));
//         }
//         else {
//             err = new Error('Dish ' + req.params.dishID + ' Not found')
//             err.status = 404;
//             return next(err)
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });

// dishRouter.route('/:disID/comments/:commentID')
// .get( (req, res, next) => {
//    Dishes.findById(req.params.dishID)
//    .populate('comments.author')   
//    .then((dish) => {
//     if (dish!= null && dish.comments.id(req.params.commentID) != null && dish.comments.author.id===req.user._id ) {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(dish.comments.id(req.params.commentID) );
//         }
//         else if (dish== null) {
//             err = new Error('Dish ' + req.params.dishID + ' Not found')
//             err.status = 404;
//             return next(err)
//         } else if ( dish.comments.author.id!=req.user_id) { 
//             err = new Error('You are not authorised to delete this comment')
//             err.status = 403;
//             return next(err);
//         } else {
//             err = new Error('Comment ' + req.params.commentID + ' Not found')
//             err.status = 404;
//             return next(err)
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post(authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('Post operation is not supported on a dish/'+ 
//     req.params.dishID + '/comments/'+ req.params.commentID); 
// })
// .put(authenticate.verifyUser, (req, res, next) => {
//     Dishes.findById(req.params.dishID)
//     .then((dish) => {
//      if (dish!= null && dish.comments.id(req.params.commentID) != null && dish.comments.author.id===req.user._id) {
//         if (req.body.rating) {
//             dish.comments.id(req.params.commentID).rating = req.body.rating;
//         }if (req.body.comment) {
//             dish.comments.id(req.params.commentID).comment = req.body.comments;
//         }
//         dish.save().then((dish) =>{
//             Dishes.findById(dish._id).populate('comments.author')
//             .then((dish) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(dish);
//             })
//         }, (err) => next(err))
//     }
//     else if (dish== null) {
//         err = new Error('Dish ' + req.params.dishID + ' Not found')
//         err.status = 404;
//         return next(err);
//     } else if ( dish.comments.author.id!=req.user_id) { 
//         err = new Error('You are not authorised to perform an update on this comment')
//         err.status = 403;
//         return next(err);
//     }  else {
//         err = new Error('Comment ' + req.params.commentID + ' Not found')
//         err.status = 404;
//         return next(err);
//     }
//     }, (err) => next(err))
//      .catch((err) => next(err));
// })
// .delete(authenticate.verifyUser, (req, res, next) => {
//     Dishes.findById(reeq.params.dishID)
//     .then((dish)  => {
//         if (dish!= null && dish.comments.id(req.params.commentID) != null) {
//         dish.comments.id(req.params.commentID).remove();
//         dish.save()
//         .then((dish) =>{
//             Dishes.findById(dish._id).populate('comments.author')
//             .then((dish) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(dish);
//             })
//         }, (err) => next(err));
//         }
//         else if (dish== null) {
//             err = new Error('Dish ' + req.params.dishID + ' Not found')
//             err.status = 404;
//             return next(err);
//         } else {
//             err = new Error('Comment ' + req.params.commentID + ' Not found')
//             err.status = 404;
//             return next(err);
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });

// module.exports = dishRouter;