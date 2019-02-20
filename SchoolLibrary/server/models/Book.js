const mongoose = require('mongoose');

let bookSchema = new mongoose.Schema({
    title: {type: String, required: "Title is required!"},
    author: {type: String, required: "Author is required!"},
    description: {type: String},
    genre: {type: String, required: "Genre is required!"},
})

let Book = mongoose.model('Book', bookSchema);

module.exports = Book;