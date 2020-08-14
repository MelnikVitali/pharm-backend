const Token = require('../../models/login/Token');

module.exports = async (req, res) => {
    try {
        const { userId, deviceId } = req.body;

        const token = await Token.findOneAndDelete({ userId, deviceId }).exec();

        if (token === null) {
            return res
                .status(400)
                .json({
                    status: 'Error',
                    message: 'Токен не найден'
                });
        }

        return res
            .status(200)
            .json({
            status: "Success",
            message: "Тoкен успешно удален"
        });

    } catch (err) {
        return res
            .status(400)
            .send({ error: "Не удалось удалить токен" });
    }
};
