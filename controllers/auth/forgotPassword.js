const jwt = require('jsonwebtoken');

const User = require('../../models/User');

const transporter = require('../../configs/sendMail');
const emailForgotPassword = require('../../configs/emailForgotPassword')

const { tokens } = require('../../configs/jwtTokens').jwt;

module.exports = async (req, res) => {
    const { email } = req.body;

    if (email === '') {
        res
            .status(400)
            .send('email required');
    }

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res
                .status(400)
                .json({ error: 'Пользователь с таким email не найден.' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.TOKEN_SECRET,
            { expiresIn: tokens.accessForgotPassword.expiresIn });

        return user.updateOne({ resetLink: token }, async (err) => {
            if (err) {
                return res
                    .status(400)
                    .json({ error: 'Reset password link error' });
            }

            await transporter.sendMail(emailForgotPassword(email, token), (error) => {
                if (error) {
                    return res
                        .status(400)
                        .json({ error: error.message })
                } else {
                    return res
                        .status(200)
                        .json({
                            message: 'Письмо для сброса пароля отправлено на указанный email'
                        });
                }
            });
        });
    });
};
