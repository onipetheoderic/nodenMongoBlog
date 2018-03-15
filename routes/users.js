const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//Bring In User Model
let User = require('../models/user');

//Route to the Registration Form
router.get('/register', function(req, res){
	res.render('register');
});

//Registration Process
router.post('/register', function(req, res){//here we would be getting the values from the field and saving it to a constant variable
	const name = req.body.name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;


	req.checkBody('name', 'name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	//lets add an extra validation for the email to check if it is valid
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Password do not match').equals(req.body.password);


	let errors = req.validationErrors();
	if(errors){
		res.render('register', {
			errors:errors
		});

	} else {
		let newUser = new User({
			name:name,
			email:email,
			username:username,
			password:password,
		});//before we save it we need to harsh the password using Bcrypt 

		bcrypt.genSalt(10, function(err, salt){ //10 is the number of characters we want it to generate, so we generate the salt
			bcrypt.hash(newUser.password, salt, function(err, hash){//we parse in the salt and the password
				if(err){
					console.log(err);
				} 
				newUser.password = hash;
				newUser.save(function(err){//we get the error using a callback function if any
					if(err){
						console.log(err);
						return;
					}else{
						req.flash('success', 'You are now registered and can now login');
						res.redirect('/users/login');
					}
				});

			});

		})
	}
});
//Login Form
router.get('/login', function(req, res){
	res.render('login');
});
//Login Process
router.post('/login', function(req, res, next){ //the local is the name of the authentication strategy
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true//this is responsible for displaying the message specified if there was an error in the login form
	})(req, res, next);
});

//LogOut function
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You are logged Out');
	res.redirect('/users/login');
});

module.exports = router;