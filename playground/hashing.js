const { SHA256 } = require('crypto-js');
const bcrypt = require('bcryptjs');

const password = 'abc123!';

/**
 * Bcrypt works in two steps:
 * 1. first, add a salt, which adds a random part to the password (to prevent someone storing all passwords with their hash)
 * 2. actually hash the password with the random part
 */
bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(password, salt, (err, hash) => {
		console.log(hash);
	});
});

const hashedPwd = '$2a$10$imAUI/p8TvpU2EcMNe.//eRcR.Xb.qDKV/Ib3e7qaaOenOD2RMIqG';

bcrypt.compare(password, hashedPwd, (err, res) => {
	console.log(res);
});

// const message = 'I am user number 3';
// const hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// const data = {
// 	id: 4
// };
//
// const token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
// 	console.log('Data was not changed')
// } else {
// 	console.log('Data was changed. Don\'t trust.');
// }