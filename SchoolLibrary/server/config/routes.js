const controllers = require('../controllers')
const auth = require('./auth')
const multer = require('multer')
let upload = multer({ dest: './public/images' })

module.exports = (app) => {
    app.get('/', controllers.home.index);

    app.get('/users/register', controllers.users.registerGet);
    app.post('/users/register', controllers.users.registerPost);
    app.get('/users/login', controllers.users.loginGet);
    app.post('/users/login', controllers.users.loginPost);
    app.get('/users/logout', controllers.users.logout);

    app.get('/book/create', upload.single('image'), auth.isAuthenticated, controllers.book.createGet)
    app.post('/book/create', auth.isAuthenticated,upload.single('image'), controllers.book.createPost)
    app.get('/book/all',controllers.book.getAll);
    app.get('/book/details/:id',controllers.book.bookDetails);
    app.get('/book/edit/:id',auth.isAuthenticated,controllers.book.editGet);
    app.post('/book/edit/:id', upload.single('image'), auth.isAuthenticated,controllers.book.editPost);

    app.get('/book/delete/:id', auth.isAuthenticated, controllers.book.deleteGet)
    app.post('/book/delete/:id', auth.isAuthenticated, controllers.book.deletePost)

    app.get('/user/add/favourite/:bookId', auth.isAuthenticated, controllers.book.addToFavourite)
    app.get('/user/remove/favourite/:bookId', auth.isAuthenticated, controllers.book.removeFromFavourites)
    app.get('/user/favouriteBooks', auth.isAuthenticated, controllers.book.getFavouriteBooks)
    app.get('/user/add/book/read/:id', auth.isAuthenticated, controllers.book.addToReadBooks)
    app.get('/user/remove/book/read/:id', auth.isAuthenticated, controllers.book.removeFromReadBooks)
    app.get('/user/readBooks', auth.isAuthenticated, controllers.book.getReadBooks)
    app.get('/user/takenBooks', auth.isAuthenticated, controllers.book.getTakenBooks)

    app.get('/user/book/giveBook/:id', auth.isInRole('Admin'), controllers.userBook.giveBook)
    app.post('/user/book/giveBook/:id', auth.isInRole('Admin'), controllers.userBook.giveBookPost)

    app.get('/user/book/return/:id', auth.isInRole('Admin'), controllers.userBook.returnBook)
    app.post('/user/book/return/:id', auth.isInRole('Admin'), controllers.userBook.returnBookPost)

    app.get('/admin/get/user/books', auth.isInRole('Admin'), controllers.admin.getTakenBooksForUser)
    app.post('/admin/get/user/books', auth.isInRole('Admin'), controllers.admin.getTakenBooksForUserPost)
    app.get('/admin/takenBooks', auth.isInRole('Admin'), controllers.admin.getTakenBooks)
    app.get('/admin/expiredBooks', auth.isInRole('Admin'), controllers.admin.getAllExpiredBooks)
    app.post('/admin/notify/user/:userId', auth.isInRole('Admin'), controllers.admin.notifyUser)
    app.get('/admin/notifyUser', auth.isInRole('Admin'), controllers.admin.notifyUserGet)
    app.post('/admin/notifyUser', auth.isInRole('Admin'), controllers.admin.notifyUserPost)
    app.get('/admin/users', auth.isInRole('Admin'), controllers.admin.getAllUsers)

    app.get('/user/notification/all', auth.isAuthenticated, controllers.notification.getNotificationsByUser)
    app.get('/user/notification/delete/:id', auth.isAuthenticated, controllers.notification.deleteNotification)
    app.post('/book/search',controllers.book.searchBook);
    app.all('*', (req, res) => {
        res.status(404)
        res.send('404 Not Found!')
        res.end()
    })
}
