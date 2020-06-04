const auth = require("../../controllers/auth");
const checkDuplicateUsernameOrEmail = require("../../middlewares/checkDuplicateUsernameOrEmail");

module.exports = (app) => {
    app.get("/register", async (req, res) => {
            res.send('register page');
        }
    );

    app.post("/register",
        checkDuplicateUsernameOrEmail,
        auth.signUp);

  }
