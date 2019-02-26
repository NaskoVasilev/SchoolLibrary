const Book = require('mongoose').model('Book');
const User = require('mongoose').model('User');
const BookUser = require('mongoose').model('BookUser');
const entityHelper = require('../utilities/entityHelper')

module.exports = {
    getTakenBooksForUser: (req, res)=>{
        res.render('admin/findUser')
    },
    getTakenBooksForUserPost: async (req, res) => {
        let body = req.body;
        let username = body.username;
        let classNumber = body.class;
        let numberInClass = body.numberInClass;
        let user;
        try {
            let users = await User.find({
                username: username,
                class: classNumber,
                numberInClass: numberInClass
            }).populate('takenBooks')

            user = users[0];
        } catch (err) {
            res.redirect('/', {error:'There is no such user in the database'})
            return
        }

        entityHelper.addImagesToEntities(user.takenBooks);

        res.render('admin/takenBooks', {
            books: user.takenBooks,
            user: user,
            hasNotBooks: user.takenBooks.length === 0
        })
    }
}