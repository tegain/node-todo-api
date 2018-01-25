const { ObjectID } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

/**
 * http://mongoosejs.com/docs/queries.html
 * @type {string}
 */

const id = '5a69cfe356c4d37b33443d35';

if (!ObjectID.isValid(id)) {
	return console.log('Invalid ID.')
}

// Mongoose automatically convert id to ObjectID
// Todo.find({ _id: id }).then((todos) => {
// 	console.log('Todos', todos);
// });

// Preferred when trying to ger by unique idea, so if there is no result,
// it returns NULL instead of an empty array
// Todo.findOne({ _id: id }).then((todo) => {
// 	console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo) => {
// 	if (!todo) {
// 		return console.log('ID not found.');
// 	}
//
// 	console.log('Todo by ID', todo);
// }).catch((e) => {
// 	console.log(e)
// });

const userId = '5a679b929dff253963d01320';

User.findById(userId).then((user) => {
	if (!user) {
		return console.log('User not found.');
	}

	console.log('User by ID', user);
}).catch((e) => console.log(e));