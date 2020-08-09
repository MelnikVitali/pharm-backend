const forgotPassword = require('../../controllers/auth/forgotPassword');

module.exports = (app) => {
    app.put("/forgot-password", forgotPassword);
};
