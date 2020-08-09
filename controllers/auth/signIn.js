const bcrypt = require('bcrypt');

const validateLoginInput = require('../../utils/validation/login');
const authHelper = require('../../helpers/authHelper');
const User = require('../../models/User');

module.exports = async (req, res) => {
    const { email, password } = req.body;
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res
            .status(400)
            .json(errors);
    }

    try {
        const user = await User.findOne({ email }).exec();

        if (!user) {
            errors.error = "Неверный логин или пароль";

            return res
                .status(400)
                .json(errors);
        }

        if (!user.confirmed) {
            errors.error = "Аккаунт не активирован через электронную почту";

            return res
                .status(400)
                .json(errors);
        }

        try {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const { _id, name, email } = user;

                const tokens = await authHelper.updateTokens(_id, name);

                res.cookie('refreshToken', tokens.refreshToken, { sameSite: true });

                return res
                    .status(200)
                    .json({
                        status: 'Success',
                        accessToken: tokens.accessToken,
                        user: { _id, name, email }
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
