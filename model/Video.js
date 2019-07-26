const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = Schema({
    name: String, 
    path: String, 
    thumbnail: String
});

module.exports = mongoose.model('Video', videoSchema);