const mongoose = require('mongoose');
const validator = require('validator');

// Define model for a User
// @validators: http://mongoosejs.com/docs/validation.html
const User = mongoose.model('User', {
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: (value) => validator.isEmail(value), // Boolean
			message: '{VALUE} is not a valid email.'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [
		{
			access: {
				type: String,
				required: true
			},
			token: {
				type: String,
				required: true
			}
		}
	]
});

module.exports = { User };