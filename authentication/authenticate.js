var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User=require('../models/user');
const FacebookTokenStrategy=require('passport-facebook-token');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens



exports.local=passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//json web tokens
exports.getToken = (user)=> {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin=async(req,res,next)=>{
    if(req.user.admin){
        next();
    }
    else{
        var err=new Error("you are not authorized to acces this Route!!");
        err.statusCode=403;
        next(err);
    }
}

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: process.env.clientId,
    clientSecret: process.env.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!err && user !== null) {
            return done(null, user);
        }
        else {
            user = new User({ username: profile.displayName });//it will get his username from facebook
            user.facebookId = profile.id;//id also from facebook
            user.firstName = profile.name.givenName;//firstName
            user.lastName = profile.name.familyName;//lastName
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    });
}
));