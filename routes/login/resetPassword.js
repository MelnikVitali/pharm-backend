const resetPassword = require('../../controllers/auth/resetPassword');

module.exports = (app) => {
    app.put("/reset-password", resetPassword);
};
