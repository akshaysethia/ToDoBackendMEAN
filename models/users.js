const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    taskname: {
        type: String,
        default: ''
    },
    taskinfo: {
        type: String,
        default: ''
    },
    duedate: {
        type: Date,
        default: Date.now()
    },
    priority: {
        type: String,
        default: 'None'
    }
}, {
    timestamps: true
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: '',
        unique: true
    },
    username: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    tasks: [todoSchema]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;