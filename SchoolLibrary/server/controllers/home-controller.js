const Book = require('mongoose').model('Book')
module.exports = {
    index: (req, res) => {
        res.render('home/index')
    }
}
