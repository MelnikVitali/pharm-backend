const activateAccount = require("../../controllers/auth/activateAccount");

module.exports = (app) => {
    app.post("/email-activation", activateAccount);
};