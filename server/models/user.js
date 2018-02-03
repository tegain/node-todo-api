const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
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

/**
 * Static methods act on the whole Collection
 * (instances) Methods act on document
 */

/**
 * Chose which user data will be returned from the server
 * (only id and email)
 * @returns {*}
 */
UserSchema.methods.toJSON = function () {
	// Use ES5 to have correct `this` binding
	const user = this;
	const userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

/**
 * Create JWT token
 * @returns {Promise|*|PromiseLike<T>|Promise<T>}
 */
UserSchema.methods.generateAuthToken = function () {
	const user = this;

	// Set access type
	const access = 'auth';

	// Create new token
	const token = jwt.sign({
		_id: user._id.toHexString(),
		access
	}, 'secret123').toString();

	// Push the created token to the user
	user.tokens.push({
		access,
		token
	});

	// Return the token
	return user.save().then(() => {
		return token;
	})
};

// Create model method
UserSchema.statics.findByToken = function (token) {
	const User = this;
	let decoded;

	try {
		decoded = jwt.verify(token, 'secret123');
	} catch (e) {
		return Promise.reject();
	}

	// Need quotes to go to nested objects
	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	})
};

// Define model for a User
// @validators: http://mongoosejs.com/docs/validation.html
const User = mongoose.model('User', UserSchema);

module.exports = { User };