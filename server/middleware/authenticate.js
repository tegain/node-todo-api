/**
 * Add authenticate middleware
 * @param req
 * @param res
 * @param next
 */

const { User } = require('../models/user');

const authenticate = (req, res, next) => {
	const token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if (!user) {
			return Promise.reject(); // Triggers `catch()`
		}

		req.user = user;
		req.token = token;
		next();
	}).catch((e) => {
		res.status(401).send();
	});
};

module.exports = { authenticate };