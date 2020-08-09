const signUp = require("../../controllers/auth/signUp");

module.exports = (app) => {
    app.post("/register", signUp);
};
