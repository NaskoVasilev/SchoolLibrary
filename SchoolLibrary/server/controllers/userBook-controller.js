const Book = require('mongoose').model('Book');
const User = require('mongoose').model('User');
const BookUser = require('mongoose').model('BookUser');

module.exports = {
    giveBook: (req, res) => {
        res.render('admin/giveBook')
    },
    giveBookPost: async (req, res) => {
        let bookId = req.params.id;
        let body = req.body;
        let username = body.username;
        let classNumber = body.class;
        let numberInClass = body.numberInClass;
        let returnDate = body.returnDate;
        let targetUser;
        try {
            let users = await User.find({username: username, class: classNumber, numberInClass: numberInClass});
            targetUser = users[0];
        } catch (err) {
            console.log("There is no such user in the database");
            return;
        }

        if (!targetUser) {
            res.render('admin/giveBook', {error: 'There is no such user in the database!'})
            return
        }

        let addInBookUser = BookUser.create({
            userId: targetUser.id,
            bookId: bookId,
            returnDate: returnDate
        });
        let findTargetBook = Book.findById(bookId);

        try {
            let result = await Promise.all([findTargetBook, addInBookUser]);
            let targetBook = result[0];

            targetBook.isTaken = true;
            let saveBook = targetBook.save();

            targetUser.takenBooks.push(bookId);
            let saveUser = User.findByIdAndUpdate(targetUser.id, {$set: targetUser})
            await Promise.all([saveBook, saveUser]);

            res.redirect('/book/all')
        } catch (err) {
            console.log(err)
            res.render('admin/giveBook', {error: 'Error occur try again!'})
        }
    },
    returnBook: (req, res) => {
        res.render('admin/returnBook')
    },
    returnBookPost: async (req, res) => {
        let bookId = req.params.id;
        let body = req.body;
        let username = body.username;
        let classNumber = body.class;
        let numberInClass = body.numberInClass;
        console.log(body)

        let targetUser;
        try {
            let users = await User.find({username: username, class: classNumber, numberInClass: numberInClass});
            targetUser = users[0];
        } catch (err) {
            console.log("There is no such user in the database");
            return;
        }

        if(!targetUser){
            res.render('admin/returnBook', {error: 'There is no such user in the database!'})
            return
        }

        let index = targetUser.takenBooks.indexOf(bookId)
        if (index === -1) {
            console.log("The selected user did not take such a book")
            res.render('admin/returnBook', {error: 'The selected user did not take such a book'})
            return;
        }

        try {
            let bookUserPromise = BookUser.find({userId: targetUser.id, bookId: bookId})
            let targetBookPromise = Book.findById(bookId);

            let result = await Promise.all(bookUserPromise, targetBookPromise);
            let bookUser = result[0];
            let targetBook = result[1];

            let bookUserSave = bookUser.isReturned = true;
            let targetBookSave = targetBook.isTaken = false;
            targetUser.takenBooks.splice(index, 1);
            let userSave = targetUser.save();

            await Promise.all([bookUserSave, targetBookSave, userSave])
        } catch (err) {
            res.render('admin/returnBook', {error: 'Error occur try again!'})
        }
    }
}