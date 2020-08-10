const jwt = require('jsonwebtoken');

const Token = require('../../models/login/Token');
const authHelper = require('../../helpers/authHelper');


module.exports = async (req, res) => {
    let payload;

    try {
        const refreshToken = req.cookies.refreshToken;

        payload = jwt.verify(refreshToken, process.env.TOKEN_SECRET);

        if (payload.type !== 'refresh') {
            return res
                .status(401)
                .json({
                    status: 'Error',
                    message: 'Invalid token!'
                });
        }
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res
                .status(401)
                .json({
                    status: 'Error',
                    message: 'Token expired!'
                });
        } else if (err instanceof jwt.JsonWebTokenError) {
            return res
                .status(401)
                .json({
                    status: 'Error',
                    message: 'Invalid token!'
                });
        }
    }

    try {
        const token = await Token.findOne({ tokenId: payload.id }).exec();

        if (token === null) {
            return res
                .status(401)
                .json({
                    status: 'Error',
                    message: 'Invalid token. BD!'
                });
        }

        const newAccessToken = authHelper.generatorAccessToken(token.userId, payload.name);

        return res.json({
            status: "Success",
            accessToken: newAccessToken
        });
    } catch (err) {
        return res
            .status(401).json({
                status: 'Error',
                message: err.message
            });
    }
};

