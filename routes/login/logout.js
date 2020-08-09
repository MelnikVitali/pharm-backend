const logout = require('../../controllers/auth/logout');

module.exports = (app) => {
    app.post("/logout", logout);
};
