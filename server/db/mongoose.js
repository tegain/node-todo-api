// require('dotenv').config();
const mongoose = require('mongoose');

// Tell Mongoose which Promise library to use
// Here, use the built-in library
mongoose.Promise = global.Promise;
// Mongoose connect to DB
mongoose.connect(process.env.MONGODB_URI);

module.exports = { mongoose };