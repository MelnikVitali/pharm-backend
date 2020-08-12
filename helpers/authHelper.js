const uuid = require('uuid').v4;
const jwt = require('jsonwebtoken');

const { tokens } = require('../configs/jwtTokens').jwt;

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
    Token.findOne({ userId })
        .exec()
        .then(() => Token.create({ tokenId, userId }));
};

const updateTokens = (userId, userName) => {
    const accessToken = generatorAccessToken(userId, userName);
    const refreshToken = generatorRefreshToken(userName);

    replaceDbRefreshToken(refreshToken.id, userId);

    return {
        accessToken,
        refreshToken: refreshToken.token,
    }
};

const socialAuth = (res, User, name, email) => {
    console.log(' email 1', email);
    User.findOne({ email }).exec((err, user) => {
        if (err) {
            console.log(' email 2', email);
            return res
                .status(400)
                .json({
                    error: 'Something went wrong...(User.findOne)'
                });
        } else if (user) {
            console.log(' email 3', email);
            const { _id, name } = user;

            const tokens = updateTokens(_id, name);

            res.cookie('refreshToken', tokens.refreshToken);

            user.updateOne({ confirmed: true }).exec();

            res.json({
                status: "Success",
                accessToken: tokens.accessToken,
                user: { _id, name }
            });
        } else {
            console.log(' email 4', email);
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
                            error: 'Something went wrong...(newUser.save)', newUser
                        });
                }

                const tokens = updateTokens(data._id, data.name);

                res.cookie('refreshToken', tokens.refreshToken);

                const { _id, name, email } = newUser;

                res.json({
                    status: "Success",
                    accessToken: tokens.accessToken,
                    user: { _id, name, email }
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
