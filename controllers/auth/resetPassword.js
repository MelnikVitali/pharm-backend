const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../../models/User');


module.exports = (req, res) => {
    const { resetLink, newPassword } = req.body;

    if (resetLink) {
        jwt.verify(resetLink, process.env.TOKEN_SECRET, async (error) => {
            if (error) {
                return res
                    .status(400)
                    .json({ error: 'Неверная или просроченная ссылка сброса пароля.' });
            }

            await User.findOne({ resetLink }, async (error, user) => {
                if (error || !user) {
                    return res
                        .status(400)
                        .json({ error: `Пользователь не найден.` });
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

                    res
                        .status(200)
                        .send({
                            message: `Ваш пароль успешно обновлен. Contact to: <${process.env.EMAIL_FROM}>`
                        })
                });
        });
    } else {
        return res
            .status(401)
            .json({ error: 'Ошибка аутендификации' });
    }
};
