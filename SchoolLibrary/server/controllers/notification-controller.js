const Book = require('mongoose').model('Book');
const User = require('mongoose').model('User');
const BookUser = require('mongoose').model('BookUser');
const Notification = require('mongoose').model('Notification');

module.exports.addUserNotification = async (reqUser) => {
    let userArr = await User.find({username: reqUser.username})
    let user = userArr[0];

    let bookUsers = await BookUser.find({
        userId: user._id,
        isReturned: false,
        returnDate: {$lt: Date.now()}
    })

    let promises = []
    for (const bookUser of bookUsers) {
        let bookId = bookUser.bookId;
        let book = await Book.findById(bookId);
        let returnDate = bookUser.returnDate.toDateString();
        let content = `Book with title: "${book.title}", author: ${book.author}
        , publisher: ${book.publisher} had to be returned in ${returnDate}!`;

        let notifications = await Notification
            .find({userId: user.id, content: content});

        if(notifications.length === 0){
            let promise = Notification.create({
                userId: user.id,
                content: content
            })
            promises.push(promise);
        }
    }

    if (promises.length > 0) {
        await Promise.all(promises)
    }
}

module.exports.getNotificationsByUser = async (req, res) =>{
    let userId = req.user.id;
    let notifications = await Notification.find({userId: userId});
    res.render('notification/all', {notifications: notifications});
}

module.exports.deleteNotification = async (req, res) => {
    let id = req.params.id;

    try {
         await Notification.findByIdAndRemove(id);
         res.redirect('/user/notification/all')
    }catch (err) {
        res.redirect('/user/notification/all')
    }
}