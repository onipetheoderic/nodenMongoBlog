const express = require('express');
const router = express.Router();
//Article Model
let Article = require('../models/article');//we therefore load this to the homepage

//User Model
let User = require('../models/user');




//Load The Edit Form, the Edit action is a combo of Read(GET) and Create(Post)
router.get('/edit/:id', ensureAuthenticated, function(req, res){//when it is clicked, apply the findById method to it
	Article.findById(req.params.id, function(err, article){ //this is sending the single article object to the article.pug page
		if(article.author != req.user._id){
			res.redirect('/');
			req.flash('danger', 'Not Authorized');
		}
		res.render('edit_article', {
			title: 'Edit article',
			article:article
		});
	});
});
//The Update method of the Edit form
router.post('/edit/:id', function(req, res){
	let article = {};//we create an empty article object

	article.title = req.body.title;
	article.author = req.user._id;
	article.body = req.body.body;
//we need to specify the id we are going to query or update
	let query = {_id:req.params.id}
	//for us to update we need to specify the query and the object we want to update
	Article.update(query, article, function(err){
		if(err){
			console.log(err);
			return;
		} else {
			req.flash('success', 'Article Updated');//this would parse the success to the alert in the message.pug template, and display the message Article Updated
			res.redirect('/');//we go back to the home page
		}
	});
});

//THE DELETE REQUEST IS A LITTLE Bit different, We are going to be make use of AJAX REQUEst
//Delete Request in Node needs an Ajax request, so the main.js is created to handle it
router.delete('/:id', ensureAuthenticated, function(req, res){ //this is the delete request
	if(!req.user._id){
		res.status(500).send(); //this is to check if the user is logged in
	}
	let query = {_id:req.params.id}

	Article.findById(req.params.id, function(err, article){
		if(article.author != req.user._id){
			res.status(500).send();
		} else {

		Article.remove(query, function(err){
			if(err){
				console.log(err);
			} 
			res.send('Success')//since we made a request and it is successful, we are expecting a response, so we send a response that everyting is ok
		});

		}
	});

	
});


//npm install -save express-messages express-session connect-flash express-validator
//to add an Article, we configure the route
router.get('/add', ensureAuthenticated, function(req, res){
	//lets render another template
	//here we create add.pug template 
	res.render('add_article', {
		title: "Add Article" 
	});

});
///we need to install the node body parser
router.post('/add', function(req, res){
	req.checkBody('title', 'Title is required Nuker').notEmpty(); //so now we are saying that the title field cannot be empty
	// req.checkBody('author', 'Author is required Nuker').notEmpty(); //so now we are saying that the title field cannot be empty
	req.checkBody('body', 'Body is required Nuker').notEmpty(); //so now we are saying that the title field cannot be empty

	//GET ERRORS IF There are any
	let errors = req.validationErrors();
		if(errors){ //if there are any errors all we wanna do is to re-render the template
			res.render('add_article', {
				title: 'Add Article',//we want it to still maintain the title variable name
				errors: errors
			});
		} else {
			let article = new Article();
			article.title = req.body.title;
			//we are going to make article.author to be equals to our current user id
			article.author = req.user._id;//this is the current user, becos wen we logged in we have the request.user object
			article.body = req.body.body;

			article.save(function(err){
				if(err){
					console.log(err);
					return;
				} else {
					req.flash('success', 'Article Added');
					res.redirect('/');//we go back to the home page
				}
			});

		}
	});

//Get Single Article, this must be at the bottom to avoid confusion, this is like the details page
router.get('/:id', function(req, res){//when it is clicked, apply the findById method to it
	Article.findById(req.params.id, function(err, article){ //this is sending the single article object to the article.pug page
		//since article.author is the one holding the userId, we parse it in
		User.findById(article.author, function(err, user){//we use the findById method to get the complete user object and store it in the user variable, so we now use a function to collect it
			res.render('article', {
				article:article,
				author: user.name//we now use string interpolation to display this in the browser
			});
		});	
	});
});


//Access Control, we create a function to provide validation in the backend
//it checks to see if the current user making the request is logged In or Not
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){ //if the user sending the request in authenticated, then do this
		return next();
	} else {
		req.flash('danger', 'please Login');
		res.redirect('/users/login');
	}
}


//npm install --save passport passport-local bcryptjs
module.exports = router;