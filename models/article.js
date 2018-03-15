let mongoose = require('mongoose');

//lets Create the Article Schema
let articleSchema = mongoose.Schema({
	title:{
		type: String,
		required: true,//this error message would be displayed in the Terminal console, which is not what we want, so we use express messages to display it properly
	},
	author:{
		type: String,
		required: true,
	},
	body:{
		type: String,
		required: true,
	}
});
//we want to export this model, and make it available to all other modules
let Article = module.exports = mongoose.model('Article', articleSchema);

//npm install -save express-messages express-session connect-flash express-validator