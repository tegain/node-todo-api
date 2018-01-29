const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../server');
const { Todo } = require('../models/todo');

// Create dummy todos
const todos = [
	{ _id: new ObjectID(), text: 'First test todo' },
	{ _id: new ObjectID(), text: 'Second test todo' }
];

// Drop database before every test
beforeEach((done) => {
	/**
	 * Models and collections are pretty much the same as a model represents a collection
	 * and an instance of a model represents a single document.
	 * The difference is that calling methods (e.g. Model.create) on your model
	 * will invoke any validation and hooks you wrote.
	 *
	 * --> That's why Todo.remove() deletes all the todos
	 */
	Todo.remove({}).then(() => {
		// Add the dummy todos to database
		return Todo.insertMany(todos);
	}).then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		const text = 'Something to do';

		// Request todos url
		request(app)
			.post('/todos')
			.send({ text })
			.expect(200)
			.expect((res) => {
				// Expect the passed text to match the variable
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				// Test if todo is correctly added to database
				Todo.find({ text }).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it('should not create Todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2); // Length of dummy data
					done();
				}).catch((e) => done(e));
			});
	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todos docs', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return 404 when id is non-object', (done) => {
		request(app)
			.get('/todos/123')
			.expect(404)
			.end(done);
	});

	it('should return 404 if todo not found', (done) => {
		const id = new ObjectID().toHexString();

		request(app)
			.get(`/todos/${id}`)
			.expect(404)
			.end(done);
	});
});