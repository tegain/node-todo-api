const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { ObjectID } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

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

app.get('/todos/:id', (req, res) => {
	const id = req.params.id;

	// Validate id using isValid()
		// If not valid, stop then 404 with empty body

	// If valid, findById()
		// Success
			// if todo, send it back
			// if not todo, send back 404 with empty body
		// Error
			// 400 / send back empty body
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findById(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}

		res.status(200).send({ todo });
	}).catch((e) => res.status(400).send());
});

app.delete('/todos/:id', (req, res) => {
	// Get the ID
	const id = req.params.id;

	// Validate the ID
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}

		res.status(200).send({ todo });
	}).catch((e) => {
		res.status(400).send();
	});
});

app.listen(port, () => {
	console.log(`Started on port ${port}`);
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