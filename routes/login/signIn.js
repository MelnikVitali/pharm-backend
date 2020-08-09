const signIn = require('../../controllers/auth/signIn');
const loginLimiter = require('../../controllers/authLimit');

module.exports = (app) => {
    app.post("/login", loginLimiter, signIn);
};
