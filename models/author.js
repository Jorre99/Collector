const mongoose = require('mongoose')

// add schema
const authorSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 2},
    date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Author', authorSchema)