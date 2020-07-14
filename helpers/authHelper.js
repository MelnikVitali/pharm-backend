const uuid = require('uuid').v4;
const jwt = require('jsonwebtoken');

const { tokens } = require('../configs/db').jwt;

const Token = require('../models/login/Token');

const generatorAccessToken = (userId, userName) => {
    const payload = {
        userId,
        name: userName,
        type: tokens.access.type,
    };

    const options = { expiresIn: tokens.access.expiresIn };

    return jwt.sign(payload, process.env.TOKEN_SECRET, options);
};

const generatorRefreshToken = (userName) => {
    const payload = {
        id: uuid(),
        name: userName,
        type: tokens.refresh.type
    };

    const options = { expiresIn: tokens.refresh.expiresIn };

    return {
        id: payload.id,
        token: jwt.sign(payload, process.env.TOKEN_SECRET, options)
    };
};

const replaceDbRefreshToken = (tokenId, userId) => {
    Token.findOneAndRemove({ userId })
        .exec()
        .then(() => Token.create({ tokenId, userId }));
};

module.exports = {
    generatorAccessToken,
    generatorRefreshToken,
    replaceDbRefreshToken
};
