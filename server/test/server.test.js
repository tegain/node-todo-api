const expect = require('expect');
const request = require('supertest');
const { app } = require('../server');
const { Todo } = require('../models/todo');

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
	Todo.remove({}).then(() => done());
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
				Todo.find().then((todos) => {
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
						expect(todos.length).toBe(0);
						done();
					}).catch((e) => done(e));
				})
	});
});