const jwt = require('jsonwebtoken');

const User = require('../../models/User');

module.exports = async (req, res) => {
    const { token } = req.body;

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (error, decodedToken) => {
            if (error) {
                return res
                    .status(400)
                    .json({
                        error: 'Неверная или просроченная ссылка активации.\n\n' +
                            `Contact to: < ${process.env.EMAIL_FROM} >`
                    });
            }

            const { email } = decodedToken;

            User.findOne({ email }).exec((error, user) => {
                if (error) {
                    console.error("Error in signup while account activation: ", error);

                    return res
                        .status(400)
                        .json({ error: "Невалидная ссылка" });
                }

                return user.updateOne({ confirmed: true }, async (err) => {
                    if (err) {
                        console.error("Error in signUp while account activation: ", error);

                        return res
                            .status(400)
                            .json({ error: 'Ошибка активации аккаунта' });
                    }

                    return res
                        .status(200)
                        .json({
                            message: 'Регистрация через электронное письмо - прошла успешно!\n\n'
                                + `Contact to: < ${process.env.EMAIL_FROM} >`
                        });
                });
            });
        });
    } else {
        return res
            .status(400)
            .json({ error: 'Something went wrong!' });
    }
};