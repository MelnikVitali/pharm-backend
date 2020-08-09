const socialLogin = require("../../controllers/auth/socialLogin");

module.exports = (app) => {
    app.post("/facebook-login", socialLogin.facebookLogin);
};
