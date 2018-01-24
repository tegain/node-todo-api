const mongoose = require('mongoose');

// Define model for a User
// @validators: http://mongoosejs.com/docs/validation.html
const User = mongoose.model('User', {
	email: {
		type: String,
		required: true,
		trim: true,
		minLength: 1
	}
});

module.exports = { User };