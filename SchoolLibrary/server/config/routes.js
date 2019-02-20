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

    app.get('/book/create', auth.isAuthenticated, controllers.book.createGet)
    app.post('/book/create',upload.single('image'), auth.isAuthenticated, controllers.book.createPost)
    app.get('/book/all',controllers.book.getAll)
    app.get('/book/details/:id',controllers.book.bookDetails)
    //
    app.get('/book/edit/:id',auth.isAuthenticated,controllers.book.editGet);
    app.post('/book/edit/:id',auth.isAuthenticated,controllers.book.editPost);
    // app.post('/book/search',controllers.book.search);
    app.all('*', (req, res) => {
        res.status(404)
        res.send('404 Not Found!')
        res.end()
    })
}
