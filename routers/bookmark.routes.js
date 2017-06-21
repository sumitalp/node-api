var express = require('express');
var router = express.Router();
var scrape = require('html-metadata');
var webshot = require('webshot');
var Bookmark = require('../app/models/bookmark');

router.use(function(req, res, next) {
    console.log('Something is happening inside bookmark.');
    next();
});
router.route('/')
    .post(function(req, res) {
        var bookmark = new Bookmark();  // create a new instance of the Bookmark Model
        // bookmark.title = req.body.name; // set the bookmarks name (comes from the request)
        bookmark.url = req.body.url;
        bookmark.personalNotes = req.body.personalNotes;
        bookmark.users.push(req.decoded._doc._id);
        
        scrape(bookmark.url).then(function(metadata){
            bookmark.title = metadata.general.title;
            console.log(metadata.general);
            
            if (metadata.general.openGraph)
                bookmark.description = metadata.general.openGraph.description;
                
            let slugify_title = bookmark.title.replace(/ /g, '-');
            webshot(bookmark.url, 'public/images/'+slugify_title+'.png', function(err){
                if (err){
                    console.log(err);
                }
                    
                bookmark.imageUrl = '/static/images' +slugify_title + '.png';
                // save the bookmark and check for errors
                bookmark.save(function(err) {
                    if (err)
                        res.send(err);
                        
                    res.json({message: 'Bookmark Created.'});
                });
            });
        
        });
       
       //res.json({message: 'Something went wrong'}); 
        
    })
    .get(function(req, res) {
        Bookmark.find(function(err, bookmarks) {
            if (err)
                res.send(err);
                
            res.json(bookmarks);
        });
    });
    
// on routes that end in /bookmarks/:bookmark_id
// -------------------------------------------------
router.route('/:bookmark_id')
    // get the bookmark with that id (accessed at GET http://localhost:9000/api/bookmarks/:bookmark_id)
    .get(function(req, res) {
        Bookmark.findById(req.params.bookmark_id, function(err, bookmark) {
            if (err)
                res.send(err);
                
            res.json(bookmark);
        });
    })
    // update the bookmark with this id (accessed at PUT http://localhost:8080/api/bookmarks/:bookmark_id)
    //.put(function(req, res) {
    //
    //    // use our bookmark model to find the bookmark we want
    //    Bookmark.findById(req.params.bookmark_id, function(err, bookmark) {
    //
    //        if (err)
    //            res.send(err);
    //
    //        bookmark.name = req.body.name;  // update the bookmarks info
    //
    //        // save the bookmark
    //        bookmark.save(function(err) {
    //            if (err)
    //                res.send(err);
    //
    //            res.json({ message: 'Bookmark updated!' });
    //        });
    //
    //    });
    //})
    // delete the bookmark with this id (accessed at DELETE http://localhost:8080/api/bookmarks/:bookmark_id)
    .delete(function(req, res) {
        Bookmark.remove({
            _id: req.params.bookmark_id
        }, function(err, bookmark) {
            if (err)
                res.send(err);
    
            res.json({ message: 'Successfully deleted' });
        });
    });

module.exports = router;