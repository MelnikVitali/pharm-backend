const jwt = require('jsonwebtoken');

const User = require('../../models/User');

const transporter = require('../../configs/sendMail');
const emailSignUp = require('../../configs/emailSignUp');

const { tokens } = require('../../configs/jwtTokens').jwt;

module.exports = async (req, res) => {
    try {
        const { token } = req.body;

        if (token) {
            console.log('token ==>', token);
            const decoded = await jwt.decode(token);

            const user = await User.findOne({ email: decoded.email }).exec();

            if (!user) {
                return res
                    .status(400)
                    .json({ error: "Пользователь не найден" });
            }

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
                    await transporter.sendMail(emailSignUp(email, token, req.headers.origin), (error, response) => {
                        if (error) {
                            return res
                                .json({ errorSignUp: error.message })
                        } else {
                           return  res.status(200)
                                .json({
                                    message: `Письмо повторной подтверждения регистрации отправлено на указанный email : < ${email} >.\n\n` +
                                        ' Для входа в аккаунт, пожалуйста активируйте свою учетную запись!'
                                });
                        }
                    });
                }
            );

        }
    } catch (e) {
        return res.json({ error: 'Произошла ошибка при повторной активации аккаунта' });
    }
};

