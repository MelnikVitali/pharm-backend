const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authHelper = require('../helpers/authHelper');

const { secret } = require('../configs/db').jwt;

const User = require('../models/User');
const Token = require('../models/login/Token');

const validateRegisterInput = require('../utils/validation/register');
const validateLoginInput = require('../utils/validation/login');

const updateTokens = (userId, userName) => {
    const accessToken = authHelper.generatorAccessToken(userId, userName);
    const refreshToken = authHelper.generatorRefreshToken(userName);

    authHelper.replaceDbRefreshToken(refreshToken.id, userId );

    return {
        accessToken,
        refreshToken: refreshToken.token,
    }
};

const signUp = async (req, res) => {
    let { name, email, password, password2 } = req.body;
    email = email && email.toLowerCase();

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            errors.email = "Пользователь с таким email уже зарегистрирован!";

            return res.status(400).json(errors);
        } else {
            if (password !== password2) {
                errors.password2 = "Пароли не совпадают!";
                return res.status(400).json(errors);
            }
            const newUser = new User({
                name,
                email,
                password,
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, async (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;

                    try {
                        const user = await newUser.save();

                        const payload = {
                            userId: user._id,
                            name: user.name,
                            email: user.email,
                            password: user.password,
                        };

                        jwt.sign(
                            payload,
                            secret,
                            { expiresIn: 3600 * 24 * 30 },
                            (err, token) => {
                                return res.json({
                                    "status": "Success",
                                    accessToken: token,
                                    user: payload
                                });
                            }
                        );
                    } catch (e) {
                        return res.json({ error: 'Error occurred while generating token' });
                    }
                });
            });
        }
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
            errors.email = "Пользователя с таким email не найдено!";

            return res
                .status(404)
                .json(errors);
        }

        try {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const tokens = await updateTokens(user._id, user.name);

                res.cookie('refreshToken', tokens.refreshToken);

                return res.json({
                    status: 'Success',
                    accessToken: tokens.accessToken
                });

            } else {
                errors.password = "Неправильный пароль!"

                return res
                    .status(401)
                    .json(errors);
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
    const refreshToken = req.cookies.refreshToken;

    let payload;

    try {
        payload = jwt.verify(refreshToken, secret);

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

        const tokens = updateTokens(token.userId, payload.name);

        res.cookie('refreshToken', tokens.refreshToken);

        res.json({ accessToken: tokens.accessToken });
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
