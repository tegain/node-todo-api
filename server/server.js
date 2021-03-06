require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');
const { ObjectID } = require('mongodb');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// Add new todos Endpoint
app.post('/todos', authenticate, (req, res) => {

	// Create new to-do with the request element
	const todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	// Then save it to database
	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		// Manually send 400 status when error
		res.status(400).send(e);
	})
});

app.get('/todos', authenticate, (req, res) => {
	// Fetch todos only for the matching user
	Todo.find({ _creator: req.user._id }).then((todos) => {
		// Returns an object instead of array,
		// so it's easier if we want to add more properties
		res.send({ todos });
	}, (e) => {
		// Manually send 400 status when error
		res.status(400).send(e);
	})
});

app.get('/todos/:id', authenticate, (req, res) => {
	const id = req.params.id;

	// Validate id using isValid()
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findOne({ _id: id, _creator: req.user._id }).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}

		res.status(200).send({ todo });
	}).catch((e) => res.status(400).send());
});

app.delete('/todos/:id', authenticate, (req, res) => {
	// Get the ID
	const id = req.params.id;

	// Validate the ID
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findOneAndRemove({ _id: id, _creator: req.user._id}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}

		res.status(200).send({ todo });
	}).catch((e) => {
		res.status(400).send();
	});
});

app.patch('/todos/:id', authenticate, (req, res) => {
	const id = req.params.id;
	/**
	 * Pick only the properties passed in the array
	 * @doc: https://lodash.com/docs/4.17.4#pick
	 */
	const body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		// Set 'completedAt' timestamp
		body.completedAt = new Date().getTime();
	} else {
		// Reset properties if the `completed` property isn't a boolean or isn't completed
		body.completed = false;
		body.completedAt = null;
	}

	// Update the to-do in the database
	Todo.findOneAndUpdate({ _id: id, _creator: req.user._id}, {
			$set: body
		}, {
			// Return the new to-do (similar to MongoDB `returnOriginal`)
			new: true
		})
		.then((todo) => {
			if (!todo) {
				return res.status(404).send();
			}

			res.status(200).send({ todo });
		})
		.catch((e) => {
			res.status(400).send();
		});
});

app.post('/users', (req, res) => {
	const body = _.pick(req.body, ['email', 'password']);
	const user = new User(body);

	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e.message);
	});
});

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

app.post('/users/login', (req, res) => {
	const body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user) => {
		/**
		 * Generate new token for the matching user
		 * Add the token to the headers
		 */
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch((err) => {
		res.status(400).send(err);
	});
});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
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