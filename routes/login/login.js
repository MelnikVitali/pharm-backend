const auth = require('../../controllers/auth');
const loginLimiter = require('../../controllers/authLimit');

exports.login = (app) => {
    app.post("/login", loginLimiter, auth.signIn);
};

exports.refreshToken = (app) => {
    app.post("/refresh-tokens", auth.refreshTokens);
};
