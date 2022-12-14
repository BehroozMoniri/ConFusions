var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var FacebookTokenStrategy = require('passport-facebook-token');
var jwt = require('jsonwebtoken');
var config = require('./config');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 14400});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                console.log(user);
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

// exports.verifyUser = function (req, res, next) {
//     // var token = req.body.token || req.query.token || req.headers['x-access-token']|| req.headers.authorization.split(" ")[1];
//     var token = req.headers.authorization.split(" ")[1]
//     // console.log(token)
//     // decode token 
//     if (token) {
//         // verifies secret and checks exp
//         jwt.verify(token, config.secretKey, function (err, decoded) {
//             if (err) {
//                 var err = new Error('You are not authenticated!');
//                 err.status = 401;
//                 return next(err);
//             } else {
//                 // if everything is good, save to request for use in other routes
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//     } else {
//         // if there is no token  // return an error
//         var err = new Error('No token provided!'+ token);
//         err.status = 403;
//         return next(err);
//     }
// };
 

exports.verifyUser = passport.authenticate('jwt', {session: false});
// exports.verifyUser = passport.authenticate('jwt', {session: true});

exports.verifyAdmin = function (req, res, next) {
    if (req.user.admin) {
        next();
    } else {
        var err = new Error('You are not authorized to perform this operation');
        err.status = 403;
        return next(err);
    }
};

exports.facebook = passport.use(new 
    FacebookTokenStrategy({
        clientID : config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({facebookId: profile.id}, (err, user) => {
            if (err) {
                return done(err, false);
            } if (!err && user !== null) {
                return done(null, user);
            } else {
                user = new User({ username: profile.displayName});
                user.facebookId = profile.id;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                user.save (( err, user) => {
                    if (err) 
                    return done(err, false);
                    else 
                    return done(null, user);
                })
            }
        });
    }
));