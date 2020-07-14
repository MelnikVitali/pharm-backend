const auth = require('../../controllers/auth');

module.exports = (app) => {
    app.put("/reset-password", auth.resetPassword);
};
