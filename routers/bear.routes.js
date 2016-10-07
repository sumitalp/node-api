var express = require('express');
var router = express.Router();
var Bear = require('../app/models/bear');

router.use(function(req, res, next) {
    console.log('Something is happening inside bear.');
    next();
});
router.route('/')
    .post(function(req, res) {
        var bear = new Bear();  // create a new instance of the Bear Model
        bear.name = req.body.name; // set the bears name (comes from the request)
        
        // save the bear and check for errors
        bear.save(function(err) {
            if (err)
                res.send(err);
                
            res.json({message: 'Bear Created.'});
        });
    })
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);
                
            res.json(bears);
        });
    });
    
// on routes that end in /bears/:bear_id
// -------------------------------------------------
router.route('/:bear_id')
    // get the bear with that id (accessed at GET http://localhost:9000/api/bears/:bear_id)
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
                
            res.json(bear);
        });
    })
    // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function(req, res) {

        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function(err, bear) {

            if (err)
                res.send(err);

            bear.name = req.body.name;  // update the bears info

            // save the bear
            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear updated!' });
            });

        });
    })
    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

module.exports = router;