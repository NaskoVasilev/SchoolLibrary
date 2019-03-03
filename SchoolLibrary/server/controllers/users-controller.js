const encryption = require('../utilities/encryption')
const User = require('mongoose').model('User')
const notificationController = require('./notification-controller')

module.exports = {
    registerGet: (req, res) => {
        res.render('users/register')
    },
    registerPost: (req, res) => {
        let reqUser = req.body;

        if (reqUser.password !== reqUser.repeatPassword) {
            res.render('users/register',{error: "Passwords must match!"});
            return;
        }

        if (!reqUser.username || !reqUser.password) {
            res.render('users/register',{error: "Username and password are required!"});
            return
        }

        let salt = encryption.generateSalt()
        let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

        User.create({
            username: reqUser.username,
            salt: salt,
            hashedPass: hashedPassword,
            firstName: reqUser.firstName,
            lastName: reqUser.lastName,
            class: reqUser.class,
            numberInClass: reqUser.numberInClass
        }).then(user => {
            req.logIn(user, (err, user) => {
                if (err) {
                    req.session.globalError = err
                    res.render('users/register', user)
                    return;
                }

                res.redirect('/')
            })
        }).catch(err=>{
            res.render('users/register',{error:err})
        })
    },
    loginGet: (req, res) => {
        res.render('users/login')
    },
    loginPost: (req, res) => {
        let reqUser = req.body
        User
            .findOne({username: reqUser.username}).then(user => {
            if (!user) {
                res.render('users/login',{error: 'Invalid credentials'})
                return
            }

            if (!user.authenticate(reqUser.password)) {
                res.render('users/login',{error:'Invalid credentials!'})
                return
            }

            req.logIn(user, (err, user) => {
                if (err) {
                    req.session.globalError = err
                    res.redirect('users/login')
                    return;
                }

                res.redirect('/')
            })
        })

        notificationController.addUserNotification(reqUser)
    },
    logout: (req, res) => {
        req.logout()
        res.redirect('/')
    }
}
