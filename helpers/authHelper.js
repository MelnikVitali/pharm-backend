const uuid = require('uuid').v4;
const jwt = require('jsonwebtoken');

const { tokens } = require('../configs/jwtTokens').jwt;

const Token = require('../models/login/Token');

const generatorAccessToken = (userId, userName, deviceId) => {
    const payload = {
        userId,
        deviceId,
        name: userName,
        type: tokens.access.type,
    };

    const options = { expiresIn: tokens.access.expiresIn };

    return jwt.sign(payload, process.env.TOKEN_SECRET, options);
};

const generatorRefreshToken = (userName, deviceId) => {
    const payload = {
        id: uuid(),
        deviceId,
        name: userName,
        type: tokens.refresh.type
    };

    const options = { expiresIn: tokens.refresh.expiresIn };

    return {
        id: payload.id,
        token: jwt.sign(payload, process.env.TOKEN_SECRET, options)
    };
};

const replaceDbRefreshToken = (tokenId, userId, deviceId) => {
    return Token
        .findOneAndRemove({ userId, deviceId })
        .exec()
        .then(() => Token
            .create({ tokenId, userId, deviceId })
        );
};

const updateTokens = (userId, userName, deviceId) => {
    const accessToken = generatorAccessToken(userId, userName, deviceId);
    const refreshToken = generatorRefreshToken(userName, deviceId);

    replaceDbRefreshToken(refreshToken.id, userId, deviceId);

    return {
        accessToken,
        refreshToken: refreshToken.token,
    }
};

const socialAuth = (res, User, name, email) => {
    return User.findOne({ email }).exec((err, user) => {
        if (err) {
            return res
                .status(400)
                .json({
                    error: 'Something went wrong...(User.findOne)'
                });
        } else if (user) {
            const { _id, name, email } = user;

            const deviceId = uuid();

            const tokens = updateTokens(_id, name, deviceId);

            user.updateOne({ confirmed: true });

            return res
                .cookie('refreshToken', tokens.refreshToken)
                .json({
                    status: "Success",
                    accessToken: tokens.accessToken,
                    user: { _id, name, email, deviceId },
                });
        } else {
            const password = email + process.env.TOKEN_SECRET;

            const newUser = new User({
                name,
                email,
                password,
                confirmed: true
            });

            newUser.save((err, data) => {
                if (err) {
                    return res
                        .status(400)
                        .json({
                            error: 'Something went wrong...(newUser.save)'
                        });
                }

                const deviceId = uuid();

                const tokens = updateTokens(data._id, data.name, deviceId);

                const { _id, name, email } = newUser;

                return res
                    .cookie('refreshToken', tokens.refreshToken)
                    .json({
                        status: "Success",
                        accessToken: tokens.accessToken,
                        user: { _id, name, email, deviceId }
                    });
            });
        }
    });
}

module.exports = {
    updateTokens,
    socialAuth,
    generatorAccessToken,
    generatorRefreshToken,
    replaceDbRefreshToken
};
