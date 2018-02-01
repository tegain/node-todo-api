const jwt = require('jsonwebtoken');

const data = {
	id: 10
};

/**
 * Create a signature with the data object and the secret key
 */
const token = jwt.sign(data, 'secret123');
console.log('token', token);

/**
 * Decode the created token
 * (needs the secret key to verify the signature)
 */
const decoded = jwt.verify(token, 'secret123');
console.log('decoded', decoded);