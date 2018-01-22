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
			// http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#findOneAndUpdate
		.findOneAndUpdate({
			_id: new ObjectID('5a65de2b25a5c0590c99847c')
		}, {
			// https://docs.mongodb.com/manual/reference/operator/update/set/#up._S_set
			$set: {
				completed: true
			}
		}, {
			// http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#findOneAndUpdate
			returnOriginal: false
		})
		.then((result) => {
			console.log(result)
		});

	db.collection('Users')
			.findOneAndUpdate({
				_id: new ObjectID('5a639bacae25c102275cc672')
			}, {
				$set: {
					name: 'ThomasE'
				},
				// https://docs.mongodb.com/manual/reference/operator/update/inc/
				$inc: {
					age: 1
				}
			}, {
				returnOriginal: false
			})
			.then((result) => {
				console.log(result);
			});

	// db.close();
});