var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema   = mongoose.Schema;

// set up a mongoose model and pass it using module.exports

var userSchema = new Schema({
	username: String,
    name: String,
    password: String,
    admin: Boolean    
});

// checking if password is valid using bcrypt
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

// this method hashes the password and sets the users password
userSchema.methods.hashPassword = function(password){
    var user = this;

    // hash the password
    bcrypt.hash(password, null, null, function(err, hash) {
        if (err)
			return next(err);

		user.password = hash;
    });
}

module.exports = mongoose.model('User', userSchema);


