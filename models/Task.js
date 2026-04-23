const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true
    },
    description: { type: String, required: true },
    completed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        default: null
    },
    category: {
        type: String,
        enum: ['Work', 'Personal', 'Shopping', 'Health', 'Other'],
        default: 'Other'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Task', TaskSchema);