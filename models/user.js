var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	password: String,
	email: String,
	name: String,
	location: String
	},
	{ discriminatorKey : 'user_level'}

);

var ClientSchema = mongoose.Schema(
	{},
	{
		discriminatorKey : 'user_level'
	}
)

var LawyerSchema = mongoose.Schema(
		{
			specialization : String
		},
		{
			discriminatorKey : 'user_level'
		}
)
var User  = module.exports =  mongoose.model('User', UserSchema);
var Client =	User.discriminator('Client', ClientSchema);
var Lawyer =	User.discriminator('Lawyer', LawyerSchema);

module.exports = {
		Client:	Client,
		Lawyer: Lawyer	
}

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByEmail = function(email, callback){
	var query = {email: email};
	User.findOne(query, callback);
}

module.exports.getUserByEmailAndRole = function(email,user_level, callback){
	var query = {
			email: email,
			user_level: user_level
	};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

// Lawyer methods
module.exports.Lawyer.getLawyerBySpecialization = function(specialization, callback){
	var query = {
		specialization: specialization,
		user_level: "Lawyer"
	};
	User.find(query, callback);
}

module.exports.Lawyer.getLawyerByEmail = function(email, callback){
	var query = {
		email: email,
		user_level: "Lawyer"
	};
	User.findOne(query, callback);
}
module.exports.Lawyer.getLawyerByName = function(name, callback){
	var query = {
		name: name,
		user_level: "Lawyer"
	};
	User.find(query, callback);
}

module.exports.Lawyer.getLawyerByLocation = function(location, callback){
	var query = {
		location: location,
		user_level: "Lawyer"
	};
	User.find(query, callback);
}

// Client methods
module.exports.Client.getClientByEmail = function(email, callback){
	var query = {
		email: email,
		user_level: "Client"
	};
	User.findOne(query, callback);
}
module.exports.Client.getClientByName = function(name, callback){
	var query = {
		name: name,
		user_level: "Client"
	};
	User.find(query, callback);
}

module.exports.Client.getClientByLocation = function(location, callback){
	var query = {
		location: location,
		user_level: "Client"
	};
	User.find(query, callback);
}
