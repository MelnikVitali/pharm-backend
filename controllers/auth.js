const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const emailSignUp = require('../configs/emailSignUp')
const emailForgotPassword = require('../configs/emailForgotPassword')
const transporter = require('../configs/sendMail');

const authHelper = require('../helpers/authHelper');

const { tokens } = require('../configs/db').jwt;

const User = require('../models/User');
const Token = require('../models/login/Token');

const validateRegisterInput = require('../utils/validation/register');
const validateLoginInput = require('../utils/validation/login');

const updateTokens = (userId, userName) => {
    const accessToken = authHelper.generatorAccessToken(userId, userName);
    const refreshToken = authHelper.generatorRefreshToken(userName);

    authHelper.replaceDbRefreshToken(refreshToken.id, userId);

    return {
        accessToken,
        refreshToken: refreshToken.token,
    }
};

const signUp = async (req, res) => {

    let { name, email, password, confirmPassword } = req.body;
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
            if (password !== confirmPassword) {
                errors.password2 = "Пароли не совпадают!";

                return res.status(400).json(errors);
            }
            const newUser = new User({
                name,
                email,
                password,
                activateAccount: false

            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, async (err, hash) => {
                    if (err) {
                        throw err
                    }

                    newUser.password = hash;

                    try {
                        const user = await newUser.save();

                        const payload = {
                            userId: user._id,
                            name: user.name,
                            email: user.email,
                        };


                        jwt.sign(
                            payload,
                            process.env.TOKEN_SECRET,
                            { expiresIn: tokens.accessSignUp.expiresIn },
                            async (err, token) => {
                                await transporter.sendMail(emailSignUp(email, token), (error, response) => {
                                    if (error) {
                                        return res.json({
                                            errorSignUp: error.message
                                        })
                                    } else {
                                        console.log('here is the res: ', response);
                                        res.status(200).json({ message: 'Письмо подтверждения регистрации отправлено на указанный email. Для входа в аккаунт, пожалуйста активируйте свою учетную запись!' });
                                    }
                                });
                            }
                        );
                    } catch (e) {
                        return res.json({ errorSignUp: 'Произошла ошибка при создании токена' });
                    }
                });
            });
        }
    } catch (e) {
        return res.send({ error: "Не удалось создать токен" });
    }
};

const activateAccount = async (req, res) => {
    const { token } = req.body;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (error, decodedToken) => {
            if (error) {
                return res
                    .status(400)
                    .json({
                        error: `Неверная или просроченная ссылка активации.  Contact to: <${process.env.EMAIL_FROM}>`

                    });
            }

            const { email } = decodedToken;

            User.findOne({ email }).exec((error, user) => {
                if (error) {
                    console.log("Error in signup while account activation: ", error);

                    return res.status(400).json({ error: "Невалидная ссылка" });
                }

                return user.updateOne({ confirmed: true }, async (err, success) => {
                    if (err) {
                        console.error("Error in signup while account activation: ", error);

                        return res.status(400).json({ error: 'Ошибка активации аккаунта' });
                    }
                    res.json({
                        message: `Регистрация через электронное письмо - прошла успешно!  Contact to: <${process.env.EMAIL_FROM}>`
                    })
                })
            });
        });
    } else {
        return res.json({ error: 'Something went wrong!' })
    }
}

const signIn = async (req, res) => {
    const { email, password } = req.body;
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    try {
        const user = await User.findOne({ email }).exec();

        if (!user) {
            errors.error = "Неверный логин или пароль";

            return res
                .status(400)
                .json(errors);
        }

        if (user.confirmed === false) {
            errors.error = "Аккаунт не активирован через электронную почту";

            return res
                .status(400)
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
                errors.error = "Неверный логин или пароль"

                return res
                    .status(400)
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

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (email === '') {
        res.status(400).send('email required');
    }

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: 'Пользователь с таким email не найден.' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '20m' });

        return user.updateOne({ resetLink: token }, async (err, success) => {
            if (err) {
                return res.status(400).json({ error: 'Reset password link error' });
            }

            console.log('sending mail');

            await transporter.sendMail(emailForgotPassword(email, token), (error, response) => {
                if (error) {
                    return res.json({
                        error: error.message
                    })
                } else {
                    res.status(200).json({ message: 'Письмо для сброса пароля отправлено на указанный email, пожалуйста, активируйте свою учетную запись' });
                }
            });
        });
    });
};

const resetPassword = (req, res) => {
    const { resetLink, newPassword } = req.body;
    if (resetLink) {
        jwt.verify(resetLink, process.env.TOKEN_SECRET, async (error, decodedData) => {
            if (error) {
                return res.status(400).json({ error: 'Невалидная ссылка!' });
            }
            await User.findOne({ resetLink }, async (error, user) => {
                if (error || !user) {
                    return res.status(400).json({ error: `Пользователь не найден.` });
                }
                await bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newPassword, salt, async (err, hash) => {
                        await user.updateOne({
                            password: hash,
                            resetLink: null,
                        })

                    });
                });
            })
                .then(() => {
                    console.log('password updated');
                    res.status(200).send({ message: `Ваш пароль успешно обновлен. Contact to: <${process.env.EMAIL_FROM}>` })
                });
        });
    } else {
        return res.status(401).json({ error: 'Ошибка аутендификации' });
    }
};

const refreshTokens = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    let payload;

    try {
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
                    message: 'Invalid token!'
                });
        }

        const tokens = updateTokens(token.userId, payload.name);

        res.cookie('refreshToken', tokens.refreshToken);

        res.json({ accessToken: tokens.accessToken });
    } catch (err) {
        return res
            .status(401).json({
                status: 'Error',
                message: err.message
            });
    }
};

module.exports = {
    activateAccount,
    resetPassword,
    forgotPassword,
    refreshTokens,
    signUp,
    signIn
};
