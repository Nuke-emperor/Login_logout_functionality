if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const Session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./passportConfig.js')


initializePassport(passport,
    email =>  users.find(user => user.email === email),
    id =>  users.find(user => user.id === id))

// middlewares
app.set('view engine','ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(Session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialize: false,
    
}))

app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())

const users = []

app.get('/', checkAuthenticatedUser, (req, res) => {
    res.render('home')
})
    

app.get('/login', checkNotAuthenticatedUser,(req, res) => {
    res.render('login')
})

app.delete('/logout', (req, res, next) => {
    req.logOut(next )
    res.redirect('/login')
}) 
    

app.get('/register', checkNotAuthenticatedUser, (req, res) => {
    res.render('register')
})
    


app.post('/login', checkNotAuthenticatedUser, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash:true
        
    }) )

    app.post('/register', checkNotAuthenticatedUser, async(req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            users.push({
                id: Date.now().toString(),
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                
            })
            res.redirect('/login')
        }
        catch { res.redirect('/register') }
})

 function checkAuthenticatedUser  (req, res, next) {
    if (req.isAuthenticated()) {
         return next()
    } 
    res.redirect('/login')  
}

 function checkNotAuthenticatedUser  (req, res, next) {
    if (req.isAuthenticated()) {
      return  res.redirect('/')  
    } 
     next()
}


app.listen(3000,
console.log('[+]server started.....')


)

