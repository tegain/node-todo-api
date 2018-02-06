const mongoose = require('mongoose');

// Define model for a Todo
// @validators: http://mongoosejs.com/docs/validation.html
const Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minLength: 3,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	},
	_creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
});

module.exports = { Todo };