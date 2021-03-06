const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
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
 *
 * Gets automatically called when respond to Express server
 * @See https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/questions/1930840
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
	}, process.env.JWT_SECRET_KEY).toString();

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

UserSchema.methods.removeToken = function (token) {
	const user = this;

	/**
	 * $pull removes item from an array with certain property
	 * @doc https://docs.mongodb.com/manual/reference/operator/update/pull/
 	 */
	return user.update({
		// If the `tokens` object has a property that matches the `token` argument,
		// it gets removed
		$pull: {
			tokens: { token }
		}
	})
};

UserSchema.pre('save', function (next) {
	const user = this;

	// Prevent re-hashing hashs everytime the script runs even if the password hasn't been modified.
	// this will run only when password is modified.
	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

// Create model method
UserSchema.statics.findByToken = function (token) {
	const User = this;
	let decoded;

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
	} catch (e) {
		return Promise.reject();
	}

	// Need quotes to go to nested objects
	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

UserSchema.statics.findByCredentials = function (email, password) {
	const User = this;

	// Find user matching the passed email
	return User.findOne({ email }).then((user) => {
		if (!user) {
			return Promise.reject({ 'error': 'No user matching' });
		}

		// Compare provided password and database-hashed one
		return bcrypt.compare(password, user.password).then((res) => {
			if (!res) {
				return Promise.reject({ 'error': 'Incorrect password' });
			}

			// If they match, return user to server/server.js
			return user;
		});
	})
};

// Define model for a User
// @validators: http://mongoosejs.com/docs/validation.html
const User = mongoose.model('User', UserSchema);

module.exports = { User };