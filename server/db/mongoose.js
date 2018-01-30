// require('dotenv').config();
const mongoose = require('mongoose');

// Tell Mongoose which Promise library to use
// Here, use the built-in library
mongoose.Promise = global.Promise;
// Mongoose connect to DB
const DB_REMOTE_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/node-todo-api`;
const DB_LOCAL_URI = 'mongodb://localhost:27017/TodoApp';
const DB_CONNECT_URI = process.env.DB_USER ? DB_REMOTE_URI : DB_LOCAL_URI;

mongoose.connect(DB_CONNECT_URI);

module.exports = { mongoose };