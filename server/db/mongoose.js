const mongoose = require('mongoose');

// Tell Mongoose which Promise library to use
// Here, use the built-in library
mongoose.Promise = global.Promise;
// Mongoose connect to DB
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };