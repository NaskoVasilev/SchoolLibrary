const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
    app.get('/', controllers.home.index);

    app.get('/users/register', controllers.users.registerGet);
    app.post('/users/register', controllers.users.registerPost);
    app.get('/users/login', controllers.users.loginGet);
    app.post('/users/login', controllers.users.loginPost);
    app.get('/users/logout', controllers.users.logout);

    // app.get('/article/create',auth.isAuthenticated, controllers.article.createGet)
    // app.post('/article/create',auth.isAuthenticated, controllers.article.createPost)
    // app.get('/article/all',controllers.article.getAll)
    // app.get('/article/details/:id',controllers.article.articleDeatils)
    //
    // app.get('/article/edit/:id',auth.isAuthenticated,controllers.article.editGet);
    // app.post('/article/edit/:id',auth.isAuthenticated,controllers.article.editPost);
    // app.get('/article/history/:id',auth.isAuthenticated,controllers.article.getHistory)
    // app.get('/article/editDetails/:id',auth.isAuthenticated,controllers.article.showEdit)
    //
    // app.get('/article/lock/:id',auth.isInRole('Admin'),controllers.article.lockArticle)
    // app.get('/article/unlock/:id',auth.isInRole('Admin'),controllers.article.unlockArticle)
    //
    // app.get('/article/latest',controllers.article.getLatestArticle);
    // app.post('/article/search',controllers.article.search);
    app.all('*', (req, res) => {
        res.status(404)
        res.send('404 Not Found!')
        res.end()
    })
}
