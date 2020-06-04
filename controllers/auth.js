const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');

const authHelper = require('../helpers/authHelper');

const { secret } = require('../configs/db').jwt;

const User = require('../models/User');
const Token = require('../models/login/Token');

const validateRegisterInput = require('../utils/validation/register');
const validateLoginInput = require('../utils/validation/login');

const updateTokens = (userId) => {
    const accessToken = authHelper.generatorAccessToken(userId);
    const refreshToken = authHelper.generatorRefreshToken();

    authHelper.replaceDbRefreshToken(refreshToken.id, userId);

    return {
        accessToken,
        refreshToken: refreshToken.token,
    }
};

const signUp = async (req, res) => {
    let { name, email, password } = req.body;

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
    });

    try {
        const newUser = new User({
            name,
            email,
            password,
            avatar
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, async (err, hash) => {
                if (err) throw err;
                newUser.password = hash;

                try {
                    const user = await newUser.save();

                    const payload = {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        avatar
                    };

                    jwt.sign(
                        payload,
                        secret,
                        { expiresIn: 3600 * 24 * 30 },
                        (err, token) => {
                            res.cookie("jwt", token);

                            return res.json({
                                "status": "Success",
                                token,
                                user: payload
                            });
                        }
                    );
                } catch (e) {
                    return res.json({ error: 'Error occurred while generating token' });
                }
            });
        });
    } catch (e) {
        return res.send({ error: "Could not create token" });
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    try {
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return res
                .status(404)
                .send({
                    message: "User Not found."
                });
        }

        try {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const tokens = await updateTokens(user._id);

                return res.json({

                    status: 'Success',
                    tokens
                });
            } else {
                return res
                    .status(401)
                    .json({
                        status: 'Error',
                        accessToken: null,
                        message: 'Invalid Password!'
                    });
            }
        } catch (err) {
            return res
                .status(500)
                .json({
                    status: 'Error',
                    message: err.message
                });
        }
    } catch (err) {
        return res
            .status(500)
            .json({
                status: 'Error',
                message: err.message
            });
    }
};

const refreshTokens = async (req, res) => {
    const { refreshToken } = req.body;
    console.log(refreshToken);
    let payload;

    try {
        payload = jwt.verify(refreshToken, secret);
        console.log(payload);

        if (payload.type !== 'refresh') {
            return res
                .status(400)
                .json({
                    status: 'Error',
                    message: 'Invalid token!'
                });
        }
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res
                .status(400)
                .json({
                    status: 'Error',
                    message: 'Token expired!'
                });
        } else if (err instanceof jwt.JsonWebTokenError) {
            return res
                .status(400)
                .json({
                    status: 'Error',
                    message: 'Invalid token!'
                });
        }
    }

    try {
        const token = await Token.findOne({ tokenId: payload.id }).exec();

        if (token === null) {
            throw new Error('Invalid token!');
        }

        const tokens = updateTokens(token.userId);

        res.json(tokens);
    } catch (err) {
        return res
            .status(400).json({
                status: 'Error',
                message: err.message
            });
    }
};

module.exports = {
    refreshTokens,
    signUp,
    signIn
};
