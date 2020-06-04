const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message:
        `You've made too many failed attempts in a short period of time, please try again after 15 minutes`,
});
