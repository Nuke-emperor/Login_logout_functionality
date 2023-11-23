const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
    function authenticateUser(email, password, done) {
        const user = getUserByEmail(email)

        if (user == null) {
            return done(null, false, { message: 'no such user with this email' })
        }

        try {
            if (bcrypt.compare(password, user.password)) {
                return done(null, user)
            }
            else { return done(null, false, { message: 'incorrect password' }) }
        } catch (e) {
            return done(e)
        }
    }
    

    
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser) )
    passport.serializeUser((user, done) => done(null,user.id))
    passport.deserializeUser((id, done) => {return done(null, getUserById(id)) })

} 
    

module.exports = initialize