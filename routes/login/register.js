const auth = require("../../controllers/auth");

module.exports = (app) => {
    app.get("/register", async (req, res) => {
            res.send('register page');
        }
    );

    app.post("/register", auth.signUp);
};
