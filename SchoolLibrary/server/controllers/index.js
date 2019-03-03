const home = require('./home-controller')
const users = require('./users-controller')
const book = require('./book-controller')
const userBook = require('./userBook-controller')
const admin = require('./admin-controller')
const notification = require('./notification-controller')

module.exports = {
    home: home,
    users: users,
    book: book,
    userBook: userBook,
    admin: admin,
    notification: notification
}
