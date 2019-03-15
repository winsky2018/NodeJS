const mongoose = require('mongoose')
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const User = mongoose.model("users");
const keys = require('../config/keys')


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;






module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        //如果验证成功，会打印出对应的信息
        // console.log(jwt_payload)

        User.findById(jwt_payload.id)
            .then(user => {
                if(user){
                    return done(null, user)
                }

                return done(null, false)
                
            })
            .catch(err => {console.log(err)})
        
    }));
}