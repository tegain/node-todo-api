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

	// deleteMany
	// db.collection('Todos')
	// 	.deleteMany({ text: 'Eat lunch' })
	// 	.then((result) => {
	// 		console.log(result);
	// 	});

	// deleteOne
	// db.collection('Todos')
	// 	.deleteOne({ text: 'Eat lunch' })
	// 	.then((result) => {
	// 		console.log(result);
	// 	});

	// findOneAndDelete
	// Delete AND returns deleted objects
	// db.collection('Todos')
	// 	.findOneAndDelete({ completed: false })
	// 	.then((result) => {
	// 		console.log(result) // returns todos object
	// 	});

	// db.collection('Users')
	// 	.deleteMany({ name: 'Mike' })
	// 	.then((result) => {
	// 		console.log(result.result);
	// 	});

	db.collection('Users')
		.findOneAndDelete({ _id: new ObjectID('5a64835c31fae5391a536abc') })
		.then((result) => {
			console.log(result);
		});

	// db.close();
});