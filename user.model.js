const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    name: {
        type: String
    },
    lastname: {
        type: String
    },
    experience: {
        type: Number
    }
});

module.exports = mongoose.model('User', User);