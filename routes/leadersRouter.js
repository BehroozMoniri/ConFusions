const express =require('express');
const bodyParser =require('body-parser');
const leadersRouter = express.Router();

leadersRouter.use(bodyParser.json());
leadersRouter.route('/')
.all( (req, res, next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('You will see all the leaders here!');
})
.post( (req, res, next) => {
    res.end('Will add a new leader: '+req.body.name + ' with details: ' +
     req.body.description); 
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation is not supported on leaders '); 
})
.delete( (req, res, next) => {
    res.end('Deleting all dishes!');
});

leadersRouter.route('/:leaderID')
.all( (req, res, next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get( (req, res, next) => {
    res.end('You will view details of leader: ' +
    req.params.leaderID + ' here!');
})
.post(  (req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation is not supported on leader: '+ 
    req.params.leaderID); 
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.write('Updating the leader...' + req.params.leaderID + ' is not allowed!\n');
    // res.end('Will update the dish: ' + req.body.name + 'with details: '+
    // req.body.description); 
})
.delete(  (req, res, next) => {
    res.end('Deleting the dish: ' + req.params.leaderID);
});

module.exports = leadersRouter;