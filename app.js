var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');
const url = config.mongoUrl;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leadersRouter');
const promoRouter = require('./routes/promoRouter');
const uploadRouter = require('./routes/uploadRouter');
const mongoose =require('mongoose');
const Dishes = require('./models/dishes');
const Leaders = require('./models/leaders');
const Promotions = require('./models/promotions');


// const url = 'mongodb://127.0.0.1:27017/confusion';
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => {console.log(err); });

var app = express();
// if request is comming to secure port will send it to next
app.all('*', (req,res,next) => {
  if (req.secure) { 
    return next()
  } else {    // if the request is not secure will redirect to the secure port 
    res.redirect(307, 'http://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});
var session = require('express-session');
var FileStore = require('session-file-store')(session);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(session({
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter); 
app.use('/promotions', promoRouter); 
app.use('/leaders', leaderRouter); 
app.use('/imageUpload', uploadRouter); 

// function auth (req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     var err = new Error('You are not authenticated!');
//     err.status = 403;
//     next(err);
//   }
//   else {
//         next();
//   }
// };

// function auth (req, res, next) {
//   console.log(req.session);
//   if (!req.session.user) {
//     var authHeader = req.headers.authorization;
//     if (!authHeader) {
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');                        
//         err.status = 401;
//         next(err);
//         return;
//       }
//       var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//       var user = auth[0];
//       var pass = auth[1];
//       if (user == 'admin' && pass == 'password') {
//           req.session.user = 'admin';
//           next(); // authorized
//       } else {
//           var err = new Error('You are not authenticated!');
//           res.setHeader('WWW-Authenticate', 'Basic');
//           err.status = 401; // forbidden message
//           next(err);
//       }
//   }
//   else {
//       if (req.session.user === 'admin') {
//           console.log('req.session: ',req.session);
//           next();
//       }
//       else {
//           var err = new Error('You are not authenticated!');
//           err.status = 401;
//           next(err);
//       }
//   }
// }
// use the authentication function
// app.use(auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
