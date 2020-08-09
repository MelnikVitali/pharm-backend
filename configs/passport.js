const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/User');

module.exports = function (passport) {
    const opts = {};

    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.TOKEN_SECRET;
    opts.exp = '';

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {

        User.findById(jwt_payload.userId, function (err, user) {
            if (err) {
                console.error('error in passport');

                return done(err, false);
            }

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
};
