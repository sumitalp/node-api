var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');
var config = require('../config'); // get our config file
var User = require('../app/models/user');

//router.use(function(req, res, next) {
//    console.log('Something is happening inside user.');
//    next();
//});

module.exports = function(app) {
    router.route('/')
        .get(function(req, res) {
            User.find(function(err, users) {
                if (err)
                    res.send(err);
                    
                res.json(users);
            });
        });
        
    router.route('/registration')
        .post(function(req, res) {
            var user = new User();  // create a new instance of the User Model
            user.name = req.body.name; // set the users name (comes from the request)
            user.username = req.body.username;
			user.password = user.hashPassword(req.body.password);
            user.admin  = req.body.admin;
            
            // save the user and check for errors
            user.save(function(err) {
                if (err)
                    res.send(err);
                    
                res.json({message: 'User Created.'});
            });
        });

    // on routes that end in /users/authenticate
    // -----------------------------------------------------
    router.route('/authenticate')
        .post(function(req, res) {
            // find the user
            User.findOne({username: req.body.username}, function(err, user) {
                if (err) throw err;
                
                if (!user) {
                    res.json({ success: false, message: 'Authentication failed. User not found.' });
                } else if (user) {
              
                    // check if password matches
					console.log(user.validPassword(req.body.password));
                    if (!user.validPassword(req.body.password)) {
                      res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                    } else {
              
                      // if user is found and password is right
                      // create a token
                      var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn: 1440 // expires in 24 hours
                      });
              
                      // return the information including token as JSON
                      res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                      });
                    }   
              
                }
            });
        });
    
    // on routes that end in /users/:user_id
    // -------------------------------------------------
    router.route('/:user_id')
        // get the user with that id (accessed at GET http://localhost:9000/api/users/:user_id)
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err)
                    res.send(err);
                    
                res.json(user);
            });
        })
        // update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
        .put(function(req, res) {
    
            // use our user model to find the user we want
            User.findById(req.params.user_id, function(err, user) {
    
                if (err)
                    res.send(err);
    
                user.name = req.body.name;  // update the users info
				user.username = req.body.username;
				user.password = user.hashPassword(req.body.password);
    
                // save the user
                user.save(function(err) {
                    if (err)
                        res.send(err);
    
                    res.json({ message: 'User updated!' });
                });
    
            });
        })
        // delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
        .delete(function(req, res) {
            User.remove({
                _id: req.params.user_id
            }, function(err, user) {
                if (err)
                    res.send(err);
    
                res.json({ message: 'Successfully deleted' });
            });
        });
    return router;
};
