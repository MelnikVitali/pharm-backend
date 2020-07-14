const auth = require('../../controllers/auth');

module.exports = (app) => {
    app.put("/forgot-password", auth.forgotPassword);
};
