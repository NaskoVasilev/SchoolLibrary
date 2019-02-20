const Book = require('mongoose').model('Book');
const User = require('mongoose').model('User');
const utilityFunctions = require('../utilities/utilFunctions')

module.exports = {
    createGet: (req, res) => {
        res.render('book/create')
    },

    createPost: async (req, res) => {
        let book = req.body;
        let title = book.title;
        let author = book.author;
        let genre = book.genre;

        if (!title || !author || !genre || !req.file) {
            book.error = "Title, author, genre and image are required!";
            res.render('book/create', book)
            return;
        }

        imageUrl = utilityFunctions.normaliezeImagePath(req.file.path);

        try {
            book.image = imageUrl;
            await Book.create(book)
            res.redirect('/')
        } catch (err) {
            book.error = err.message;
            res.render('book/create', book)
        }
    },

    getAll: async (req, res) => {
        let books = await Book.find({})
            .sort({title: 1});
        res.render('book/all', {books})
    },

    bookDetails: async (req, res) => {
        let id = req.params.id;
        try {
            let book = await Book.findById(id);
            res.render('book/details', book);
        } catch (err) {
            console.log(err)
            res.redirect('/book/all')
        }
    },

    editGet: async (req, res) => {
        let articleId = req.params.id;
        let book = await Book.findById(articleId);
        res.render('book/edit', book)
    },

    editPost: async (req, res) => {
        let body = req.body;
        let bookId = req.params.id;
        let title = body.title;
        let author = body.author;
        let genre = body.genre;

        if (!title || !author || !genre || !req.file) {
            body.error = "Title, author, genre and image are required!";
            res.render('book/edit/' + bookId, body)
            return;
        }
        try {
            imageUrl = utilityFunctions.normaliezeImagePath(req.file.path);
            let book = await Book.findById(bookId)
            book.title = title;
            book.author = author;
            book.genre = genre;
            book.description = body.description;
            book.image = imageUrl;

            await book.save()
            res.redirect('/book/details/' + bookId)
        } catch (err) {
            res.render('book/edit', {error: err.message})
        }
    },
    getAll: async (req, res)=>{
        let books = await Book.find();
        res.render('book/all', {books: books})
    }


// search: async (req, res) => {
//     let criteria = req.body.criteria.toLowerCase();
//     let articles = await Article.find();
//     let targetArticles = articles.filter(a => a.title.toLowerCase().includes(criteria))
//
//     res.render('book/searchResult', {articles: targetArticles, criteria: criteria})
// }
}