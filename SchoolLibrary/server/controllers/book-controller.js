const Book = require('mongoose').model('Book');
const User = require('mongoose').model('User');
const BookUser = require('mongoose').model('BookUser');
const entityHelper = require('../utilities/entityHelper');
const tagsHelper = require('../utilities/tagsHelper');

module.exports = {
    createGet: (req, res) => {
        res.render('book/create')
    },

    createPost: async (req, res) => {
        let book = req.body;
        let title = book.title;
        let author = book.author;
        let genre = book.genre;
        let publisher = book.publisher;

        if (!title || !author || !genre || !req.file || !publisher) {
            book.error = "Title, author, genre and image are required!";
            res.render('book/create', book);
            return;
        }

        try {
            entityHelper.addBinaryFileToEntity(req, book)
            tagsHelper.addTagsToBook(book.tags, book);
            await Book.create(book)
            res.redirect('/')
        } catch (err) {
            book.error = err.message;
            res.render('book/create', book)
        }
    },
    bookDetails: async (req, res) => {
        let id = req.params.id;
        try {
            let book = await Book.findById(id);
            entityHelper.addImageToEntity(book)
            res.render('book/details', book);
        } catch (err) {
            console.log(err)
            res.redirect('/book/all')
        }
    },

    editGet: async (req, res) => {
        let articleId = req.params.id;
        let book = await Book.findById(articleId);
        tagsHelper.removeUnnecessaryTags(book);
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
            res.render('book/edit', body)
            return;
        }
        try {
            let book = await Book.findById(bookId)
            book.title = title;
            book.author = author;
            book.genre = genre;
            book.description = body.description;
            console.log(body.tags)
            book.publisher = body.publisher;
            entityHelper.addBinaryFileToEntity(req, book);
            tagsHelper.addTagsToBook(body.tags, book);
            await book.save();
            res.redirect('/book/details/' + bookId);
        } catch (err) {
            console.log(err.message)
            body.error = 'Error occur try again!';
            res.render('book/edit', body);
        }
    },
    getAll: async (req, res) => {
        let books = await Book.find({isTaken: false})
            .sort({title: 1});
        entityHelper.addImagesToEntities(books);
        res.render('book/all', {books: books})
    },
    deleteGet: async (req, res) => {
        let id = req.params.id;

        try {
            let book = await Book.findById(id);
            res.render('book/delete', book)
        } catch (err) {
            res.redirect('/')
        }
    },
    deletePost: async (req, res) => {
        let id = req.params.id;

        try {
            await Book.findByIdAndRemove(id);
            res.redirect('/')
        } catch (err) {
            res.redirect('/')
        }
    },

    addToFavourite: async (req, res) => {
        let bookId = req.params.bookId
        let userId = req.user.id
        let index = req.user.favouriteBooks.indexOf(bookId)

        if (index === -1) {
            req.user.favouriteBooks.push(bookId)
            await User.findByIdAndUpdate(userId, {$set: req.user})
        }
        res.redirect('/book/details/' + bookId)
    },

    removeFromFavourites: async (req, res) => {
        let bookId = req.params.bookId
        let userId = req.user.id
        let bookIndex = req.user.favouriteBooks.indexOf(bookId)
        if (bookIndex !== -1) {
            req.user.favouriteBooks.splice(bookIndex, 1)
            await User.findByIdAndUpdate(userId, {$set: req.user})
        }

        res.redirect('/user/favouriteBooks')
    },
    getFavouriteBooks: async (req, res) => {
        let user = await User.findById(req.user.id).populate('favouriteBooks')
        entityHelper.addImagesToEntities(user.favouriteBooks);
        res.render('book/favouriteBooks', {books: user.favouriteBooks})
    },
    addToReadBooks: async (req, res) => {
        let bookId = req.params.id
        let userId = req.user.id

        let bookIndex = req.user.readBooks.indexOf(bookId)
        console.log(bookIndex)
        if (bookIndex === -1) {
            req.user.readBooks.push(bookId)
            await User.findByIdAndUpdate(userId, {$set: req.user})
        }
        res.redirect('/book/details/' + bookId)
    },
    getReadBooks: async (req, res) => {
        let user = await User.findById(req.user.id).populate('readBooks')
        entityHelper.addImagesToEntities(user.readBooks);
        res.render('book/readBooks', {books: user.readBooks})
    },
    getTakenBooks: async (req, res) => {
        let user = await User.findById(req.user.id).populate('takenBooks')
        entityHelper.addImagesToEntities(user.takenBooks);

        for (const book of user.takenBooks) {
            let bookUser = await BookUser.find({
                bookId: book.id,
                userId: req.user.id
            });

            book.date = bookUser[0].returnDate.toDateString();
        }

        res.render('book/takenBooks', {books: user.takenBooks})
    },
    removeFromReadBooks: async (req, res) => {
        let bookId = req.params.id
        let userId = req.user.id
        let bookIndex = req.user.readBooks.indexOf(bookId)
        if (bookIndex != -1) {
            req.user.readBooks.splice(bookIndex, 1)
            await User.findByIdAndUpdate(userId, {$set: req.user})
        }

        res.redirect('/user/readBooks')
    },
    searchBook: async (req, res) => {
        let tags = req.body.tags.split(',')
            .map(t => t.toLowerCase().trim());
        let books = await Book
            .find({ tags: { "$in" : tags}});

        entityHelper.addImagesToEntities(books);

        res.render('book/all', {books: books});
    },
}