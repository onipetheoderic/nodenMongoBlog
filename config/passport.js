// I think the major function of this module is to encrypt the password field in the form
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('./database');
//we are going to bring in bcrypt so that we can compare our passwords
const bcrypt = require('bcryptjs');

module.exports = function(passport){//the done is the callback function
	passport.use(new LocalStrategy(function(username, password, done){//these are the two credentials we need to login

		let query = {username:username};
		User.findOne(query, function(err, user){//we use the username to find the user, then use bcrypt to compare the password if the match, then lets rolla
			if(err) throw err;
			if(!user){
				return done(null, false, {message: 'No user found'});
			}

			//Match Password using the bcrypt compare, user.password is the password in the database, it compares it with the 
			//one that is typed
			//so this function will have an err and a boolean value object called isMatch
			bcrypt.compare(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){//if it is true, that means that the password is Valid
					return done(null, user);

				}else{
					return done(null, false, {message: 'Wrong Password'});
				}

			});

		});
	}));
	//http://www.passportjs.org/docs/downloads/html/ search for 
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		  });
	});
}