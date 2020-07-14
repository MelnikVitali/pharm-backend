const auth = require("../../controllers/auth");

module.exports = (app) => {
    app.post("/register", auth.signUp);

    app.post("/email-activation", auth.activateAccount);
};
