const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

app.use(bodyParser.json());

// Add new todos Endpoint
app.post('/todos', (req, res) => {

	// Create new todo with the request element
	const todo = new Todo({
		text: req.body.text
	});

	// Then save it to database
	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		// Manually send 400 status when error
		res.status(400).send(e);
	})
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		// Returns an object instead of array,
		// so it's easier if we want to add more properties
		res.send({ todos });
	}, (e) => {
		// Manually send 400 status when error
		res.status(400).send(e);
	})
});

app.listen(3000, () => {
	console.log('Started on port 3000');
});

module.exports = { app };


// const newTodo = new Todo({
// 	text: 'Cook dinner'
// });
//
// // actually save the todo in database
// // save() returns a promise
// // newTodo.save().then((doc) => {
// // 	console.log('Saved todo', doc);
// // }, (e) => {
// // 	console.log('Unable to save todo:', e);
// // });
//
// const newTodo2 = new Todo({
// 	text: 'Feed cat',
// 	completed: true,
// 	completedAt: Date.now()
// });
//
// newTodo2.save().then((doc) => {
// 	console.log('Todo saved', JSON.stringify(doc, undefined, 2));
// }, (e) => {
// 	console.log('Unable to save todo', e);
// });
//
// // User
//
//
// const newUser = new User({
// 	email: 'thomas@example.com'
// });
//
// newUser.save().then((doc) => {
// 	console.log('User saved', doc);
// }, (e) => {
// 	console.log('Unable to create user', e)
// });