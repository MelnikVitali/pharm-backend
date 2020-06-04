const uuid = require('uuid').v4;
const jwt = require('jsonwebtoken');
const { tokens, secret } = require('../configs/db').jwt;

const Token = require('../models/login/Token');

const generatorAccessToken = (userId ) => {
    const payload = {
        userId,
        type: tokens.access.type,
    };

    const options = { expiresIn: tokens.access.expiresIn };
    console.log(options);

    return jwt.sign(payload, secret, options);
};

const generatorRefreshToken = () => {
    const payload = {
        id: uuid(),
        type: tokens.refresh.type
    };

    const options = { expiresIn: tokens.refresh.expiresIn };

    return {
        id: payload.id,
        token: jwt.sign(payload, secret, options)
    };
};

const replaceDbRefreshToken = async (tokenId, userId) => {
    Token.findOne({ userId })
        .exec()
        .then(() => Token.create({ tokenId, userId }));
};

module.exports = {
    generatorAccessToken,
    generatorRefreshToken,
    replaceDbRefreshToken
};
