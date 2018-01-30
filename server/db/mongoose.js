require('dotenv').config();
const mongoose = require('mongoose');

// Tell Mongoose which Promise library to use
// Here, use the built-in library
mongoose.Promise = global.Promise;
// Mongoose connect to DB
const DBURI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.envDB_HOST}/node-todo-api`;
mongoose.connect(DBURI || 'mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };