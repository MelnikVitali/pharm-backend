const refreshToken = require("../../controllers/auth/refreshTokens");

module.exports = (app) => {
    app.post("/refresh-tokens", refreshToken);
};

