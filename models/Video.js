const mongoose = require('mongoose');
const User = require('./User')
const Schema = mongoose.Schema;

const schema = Schema({
    name: String, 
    path: String, 
    thumbnail_path: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Video', schema);