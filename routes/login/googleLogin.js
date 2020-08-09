const socialLogin = require("../../controllers/auth/socialLogin");

module.exports = (app) => {
    app.post("/google-login", socialLogin.googleLogin);
};
