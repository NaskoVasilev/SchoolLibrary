const mongoose = require('mongoose');

let bookSchema = new mongoose.Schema({
    title: {type: String, required: "Title is required!"},
    author: {type: String, required: "Author is required!"},
    publisher: {type: String, required: "Publisher is required!"},
    description: {type: String},
    genre: {type: String, required: "Genre is required!"},
    tags: [{type: String}],
    image: {data: mongoose.Schema.Types.Buffer, contentType: String},
    isTaken: {type: mongoose.Schema.Types.Boolean, default: false}
})

let Book = mongoose.model('Book', bookSchema);

module.exports = Book;