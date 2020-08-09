const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const transporter = require('../../configs/sendMail');
const emailSignUp = require('../../configs/emailSignUp');

const { tokens } = require('../../configs/jwtTokens').jwt;

const validateRegisterInput = require('../../utils/validation/register');
const User = require('../../models/User');

module.exports = async (req, res) => {
    let { name, email, password, confirmPassword } = req.body;
    email = email && email.toLowerCase();

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res
            .status(400)
            .json(errors);
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            errors.email = "Пользователь с таким email уже зарегистрирован!";

            return res
                .status(400)
                .json(errors);
        } else {
            if (password !== confirmPassword) {
                errors.password2 = "Пароли не совпадают!";

                return res
                    .status(400)
                    .json(errors);
            }

            const newUser = new User({
                name,
                email,
                password,
                confirmed: false
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, async (err, hash) => {
                    if (err) {
                        throw err
                    }

                    newUser.password = hash;

                    try {
                        const user = await newUser.save();

                        const { _id, name, email } = user;

                        const payload = {
                            userId: _id,
                            name: name,
                            email: email,
                        };

                        jwt.sign(
                            payload,
                            process.env.TOKEN_SECRET,
                            { expiresIn: tokens.accessEmailConfirm.expiresIn },
                            async (err, token) => {
                                await transporter.sendMail(emailSignUp(email, token), (error, response) => {
                                    if (error) {
                                        return res
                                            .status(400)
                                            .json({ errorSignUp: error.message })
                                    } else {
                                        console.log('here is the res: ', response);

                                        res
                                            .status(200)
                                            .json({
                                                message: `Письмо подтверждения регистрации отправлено на указанный email : < ${email} >.\n\n` +
                                                    'Для входа в аккаунт, пожалуйста активируйте свою учетную запись!'
                                            });
                                    }
                                });
                            }
                        );
                    } catch (e) {
                        return res
                            .status(400)
                            .json({ errorSignUp: 'Произошла ошибка при создании токена' });
                    }
                });
            });
        }
    } catch (e) {
        return res
            .status(400)
            .send({ error: "Не удалось создать токен" });
    }
};


