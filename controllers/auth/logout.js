const Token = require('../../models/login/Token');

module.exports = async (req, res) => {
    try {
        const { userId } = req.body;

        const token = await Token.findOneAndDelete({ userId }).exec();

        if (token === null) {
            return res
                .status(400)
                .json({
                    status: 'Error',
                    message: 'Invalid delete token!'
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
