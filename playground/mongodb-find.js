// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// Generate new unique ID
// const obj = new ObjectID();
// console.log(obj);

// Connect to database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');

	db.collection('Todos')
		// Find all documents and returns a cursor
		// .find()
		// Find todos by filtering query
		// .find({ completed: false })
		// Find by ObjectID
		.find({ _id: new ObjectID('5a64882b1c55bb81cffebbf3') })
		// Convert into an array and returns a Promise
		.toArray()
		.then((docs) => {
			console.log('Todos');
			// Returns array of todos objects
			console.log(JSON.stringify(docs, undefined, 2));
		}, (err) => {
			console.log('Unable to fetch todos', err);
		});

	db.collection('Todos')
		.find()
		.count()
		.then((count) => {
			console.log(`Todos count: ${count}`);
		}, (err) => {
			console.log('Unable to fetch todos', err);
		});

	const name = 'Thomas';
	db.collection('Users')
		.find({ name })
		.count()
		.then((count) => {
			console.log('Users');
			console.log(`Users named '${name}' count: ${count}`);
		});

	db.collection('Users')
		.find({ name })
		.toArray()
		.then((docs) => {
			console.log(JSON.stringify(docs, undefined, 2))
		}, (err) => {
			if (err) {
				console.log(`Unable to fetch users named ${name}`);
			}
		});
	// db.close();
});