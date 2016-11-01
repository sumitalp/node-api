// BASE SETUP
// =======================================================================================

// call the packages we need
var express = require('express');
var app     = express();
var bodyParser = require('body-parser');
var morgan    = require('morgan');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model

var mongoose = require('mongoose');
//mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database
mongoose.Promise = global.Promise;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

// For Public folder to access images or other stuffs
app.use('/static', express.static(__dirname+'/public'));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 9000;
// use morgan to log requests to the console
app.use(morgan('dev'));

// ROUTES FOR OUR API
// =======================================================================================
var router = express.Router();      // get an instance of the express Router

//middleware to use for all requests
router.use(function(req, res, next) {
    console.log('Something is happening.');
    let url_parts = req.url.split('/');
    console.log(url_parts[url_parts.length - 1]);
    
    //let sc = require('html-metadata');
    //sc('https://www.npmjs.com/package/html-metadata').then(function(metadata){
    //    console.log(metadata);
    //});
    //let webshot = require('webshot');
    //webshot('google.com', 'public/images/google.png', function(err){
    //    if(err)
    //            console.log(err);
    //        });
    
    if ( ['authenticate', 'registration'].indexOf(url_parts[url_parts.length - 1].toLowerCase()) < 0 ){
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        //console.log(['authenticate', 'registration'].indexOf(url_parts[url_parts.length - 1]));
        // decode token
        if (token) {
      
          // verifies secret and checks exp
          jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
            if (err) {
              return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
              // if everything is good, save to request for use in other routes
              req.decoded = decoded;
              // console.log(jwt.decode(token));
              console.log(req.decoded._doc._id);
              next();
            }
          });
      
        } else {
          // if there is no token
          // return an error
          return res.status(403).send({ 
              success: false, 
              message: 'No token provided.' 
          });
          
        }
    } else {
        next();
    }
    
});

// test route to make sure everything is working (accessed at GET http://localhost:9000/api/)
router.get('/', function(req, res) {
   res.json({message: 'hooray! welcome to our api!'}); 
});

// REGISTER OUR ROUTES -----------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// more routes for our API will happen here
// on routes that end in /bears
// -------------------------------------------------
var bearRouter = require('./routers/bear.routes');
app.use('/api/bears', bearRouter);

// on routes that end in /users
// -------------------------------------------------
var userRouter = require('./routers/user.routes')(app);
app.use('/api/users', userRouter);

// on routes that end in /users
// -------------------------------------------------
var bookmarkRouter = require('./routers/bookmark.routes');
app.use('/api/bookmarks', bookmarkRouter);


// START THE SERVER
// ========================================================================================
app.listen(port);
console.log('Magic happens on port '+ port);
