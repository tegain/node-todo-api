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

	// Create new document in collection
	// `insertOne` need 2 arguments:
	// - Objectwith actual data (key:value)
	// - callback function when success or fail
	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	}
	//
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	// db.collection('Users').insertOne({
	// 	name: 'Thomas',
	// 	age: 28,
	// 	location: 'Lille'
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert user', err);
	// 	}
	//
	// 	console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
	// });

	// db.collection('Users').deleteOne({
	// 	name: 'Thomas'
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to remove document', err);
	// 	}
	//
	// 	console.log(result);
	// })

	db.close();
});