var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var BookmarkSchema = new Schema({
    title: String,
    imageUrl: String,
    url: String,
    personalNotes: String,
    description: String,
    users: [
        {type: Schema.Types.ObjectId, ref: 'User'}
    ],
    isPrivate: Boolean,
    created: Date,
    updated: Date
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);