const repeatActivateAccount = require("../../controllers/auth/repeatActivateAccount");

module.exports = (app) => {
    app.post("/repeat-email", repeatActivateAccount);
};