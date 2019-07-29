const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    email: String,
    pass: String,
})

module.exports = mongoose.model('User', schema);