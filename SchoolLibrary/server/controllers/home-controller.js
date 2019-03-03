const Book = require('mongoose').model('Book')
const entityHelper = require('../utilities/entityHelper')
module.exports = {
    index: async (req, res) => {
        let books = await Book.find({isTaken: false})
            .sort([['_id', -1]])
            .limit(4);
        entityHelper.addImagesToEntities(books)
        res.render('home/index', {books: books})
    }
}
