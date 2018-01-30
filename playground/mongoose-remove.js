const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

// Todo.findOneAndRemove({ _id: '5a70c2f250afe1a3a4744bf1' }).then((todo) => {
// 	console.log(todo); // Return doc
// });

Todo.findByIdAndRemove('5a70c2f250afe1a3a4744bf1').then((todo) => {
	console.log(todo); // Return doc
}).catch(e => console.log(e));