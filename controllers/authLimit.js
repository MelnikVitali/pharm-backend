const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, //5
    statusCode: 429,
    message: {
        error: 'Слишком много аккаунтов создано с этого IP, повторите попытку через 15 минут'
    }
});
