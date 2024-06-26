const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy


passport.serializeUser((user,done)=>{
    done(null,user)
})
passport.deserializeUser((user,done)=>{
    done(null,user)
})

passport.use(new GoogleStrategy({
    clientID:'1036546106926-ej0n74ofnqtgubv7nk4um9hhhsnbl234.apps.googleusercontent.com',
    clientSecret:'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',
    callbackURL:'http://localhost:3000/users/google/calback',
    scope:["profile","email"]
},
    
function(request,accessToken,refreshToken,profile,done){
    if(profile){
        return console.log("profile",profile);
    }
    return done(null,profile)
}
))

