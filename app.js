const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');//path is included in nodejs by default
const mongoose = require('mongoose'); //after we have installed mongoose

const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport'); 
const config = require('./config/database');


//lets now use mongoose to connect to the database
mongoose.connect('mongodb://localhost:27017/nodekb');


const app = express();// here we set the app to the xpress function, to Initialize d app

//lets now import the Article Model
let Article = require('./models/article');//we therefore load this to the homepage

let db = mongoose.connection;


app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//EXPRESS SESSION MIDDLEWARE copied from https://github.com/expressjs/session
app.use(session({
  secret: 'keyboard cat',
  resave: true,//we change it to true
  saveUninitialized: true,
  // cookie: { secure: true }
}));

// EXPRESS MESSAGES MIDDLEWARE copied from https://github.com/expressjs/express-messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);//this is basically setting a global variable called messages to the express messages module
  next();
});


// Express-validator MiddleWare copied from https://github.com/ctavan/express-validator/issues/238
 app.use(expressValidator({
   errorFormatter: function(param, msg, value) {
       var   namespace = param.split('.'),
             root      = namespace.shift(),
             formParam = root;

     while(namespace.length) {
       formParam += '[' + namespace.shift() + ']';
     }
     return {
       param : formParam,
       msg   : msg,
       value : value
     };
   }
 }));

 //PassPort config
require('./config/passport')(passport);

//passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//this is to set a global variable for the user, to know if the user is logged in or not
app.get('*', function(req, res, next){
	res.locals.user = req.user || null;
	next();
});




//with mongoose installed we would be able to create our models
//mongoose force us to structure our database on an application level not on a database level
//dis is to prevent undesirable data being saved by the users to the db

//lets now check connection by giving a msg if we are actually connected\
db.once('open', function(){
	console.log("connected to Mongo db");//now we see connected to mongodb in the windows console
});


//lets first of all check for db errors
db.on('error', function(err){
	console.log(err);
});


//Load View Engine
//__dirname means the current directory, which is in a folder called views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');//we define the view engine here


//for the body parser to work we need to include these middlewares 

// Setting up basic middleware for all Express requests

//lets now create the routes



//Home Routes
app.get('/', function(req, res){ //it takes in two argument the request and the response
	//instead of saying res.send after installing the templating engine we say res.render
	// res.send('hello world');//it will basically send hello world to the browser
	Article.find({}, function(err, articles){//to get all the articles and parse it to the callback function
		//let check if there is an error, so the name of the collection must be articles

		if(err){
			console.log(err);
		} else {
		res.render('index', {
		title:'Articles',//here we stored the msg in the variable hello, if we want to see the changes restart the server
		articles: articles//we give the articles object a variable name
		}); //that is the index template in the view
	}
		
	//we can also pass values to our views from the route, by storing the value we want to parse to a variable
	//so we display the variable by saying #{title}

	});
	

});

//Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
//so we now tell it that anything that goes into /article will go into the article file
app.use('/articles', articles);
//so now we get rid of all the /articles cuz it is now a default for all requests
app.use('/users', users);

//lets add the submit post request

//the get request alone isnt enough it has to listen to a port
//to start Server
app.listen(3000, function(){//this takes a callback, that is if we want to run something when we start listening to the port
	console.log("Server started on port 3000...")
});


//lets Install a templating engine called PUG
//It uses Indentation instead of using html tags, similar to Haml
// npm install --save pug

//the REason we install nodemon is to monitor changes in the node server,
//cus wen we make changes to the javascript we have to restart the server
//npm install -g nodemon, after installing it, instead of typing npm start we type nodemon, so after installing it, we only have to click
//the refresh button for it to notice the changes


//to keep our code dry we create a layout template file and extend it to other views
//we indent and we say block content, that  is where the output would be






//for us to run things like npm start to start the homepage defaultly we configure it
//we say start node app, which is proportional to start node app.js
// we say npm install --save express
//now automatically we have dependency object created in the package.json after installing the express
//now lets import the express module, we would be using const becos it is not going to change



//mongo commands
//show dbs
//use nodekb
//db.createCollection('article');
//show collections
//db.article.insert({title:"ArticleONe",author:"theoderic",body:"best article one"});

//to display all the records in the article table we say
//db.article.find();
//db.article.insert({title:"Articletwo",author:"theoderico",body:"Articletwo"})
//db.article.find();
//to make it look a little bit nicer to display: db.article.find().pretty()
//to delete a record, u need to copy the id db.articles.remove({"_id" : ObjectId("5aaa67ca622b58198ca7fb80")})



// now that we have inserted two records lets now install mongoose.js
//npm install --save mongoose