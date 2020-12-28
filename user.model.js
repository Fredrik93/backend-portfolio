const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: String,
    lastname: String,
    experience: String

});

module.exports = mongoose.model('aUserSchema', UserSchema);