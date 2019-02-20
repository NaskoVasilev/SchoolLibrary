const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const handlebars = require('express-handlebars')

module.exports = (app) => {
  app.engine('.hbs', handlebars({
    defaultLayout: 'main.hbs'
  }))
  app.set('view engine', '.hbs')
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(session({
    secret: 'neshto-taino!@#$%',
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    if (req.user) {
      res.locals.currentUser = req.user;
      if(req.user.roles.includes('Admin')){
        res.locals.isAdmin = true;
      }
    }
    next()
  })

  app.use(express.static('public'))

  console.log('Express ready!')
}
