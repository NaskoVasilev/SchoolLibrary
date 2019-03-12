const Book = require('mongoose').model('Book');
const User = require('mongoose').model('User');
const BookUser = require('mongoose').model('BookUser');
const Notification = require('mongoose').model('Notification');
const entityHelper = require('../utilities/entityHelper')

module.exports = {
    getTakenBooksForUser: (req, res) => {
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

            if(!user){
                res.render('admin/findUser', {error: 'There is no such user!'})
            }

        } catch (err) {
            res.redirect('/', {error: 'There is no such user in the database'})
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

module.exports.getTakenBooks = async (req, res) => {
    let booksUsers = await BookUser
        .find({isReturned: false})
        .sort([['_id', -1]])
        .populate('userId')
        .populate('bookId')

    entityHelper.populateBookUserEntities(booksUsers);
    res.render('admin/allTakenBooks',
        {booksUsers: booksUsers, heading: "All taken books"})
}

module.exports.getAllExpiredBooks = async (req, res) => {
    let booksUsers = await BookUser
        .find({
            isReturned: false,
            returnDate: {$lt: Date.now()}
        })
        .sort([['_id', -1]])
        .populate('userId')
        .populate('bookId')

    entityHelper.populateBookUserEntities(booksUsers);
    res.render('admin/allTakenBooks',
        {booksUsers: booksUsers, heading: "Expired books!"})
}

module.exports.notifyUser = async (req, res) =>{
    let userId = req.params.userId;
    let book = req.body;

    let content = `Please return: "${book.title}" written by ${book.author}, 
    published by ${book.publisher}`;
    console.log(content)
    console.log(userId)
    await Notification.create({
        userId: userId,
        content: content
    });
    res.redirect('/admin/takenBooks');
}

module.exports.notifyUserGet = (req, res) => {
    res.render('notification/add')
}

module.exports.notifyUserPost = async (req, res) => {
    let body = req.body;
    let userClass = body.class;
    let numberInClass = body.numberInClass;
    let user;

    try {
        let users = await User.find({
            class: userClass,
            numberInClass: numberInClass
        });
        user = users[0];
        if(!user){
            res.render('notification/add', {error: 'There is no such user!'})
            return;
        }
    }catch (err) {
        res.render('notification/add', {error: 'There is no such user!'})
        return;
    }

    await Notification.create({
        userId: user.id,
        content: body.message
    })
    res.redirect('/');
}

module.exports.getAllUsers = (req, res) =>{
    User.find({ roles: { "$nin" : ["Admin"]}})
        .then(users => {
            res.render('admin/users', {users: users});
        })
}