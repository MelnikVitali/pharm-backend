const LanguageShema = require('../../models/Language');

module.exports = (app) => {
    app.post('/delete-language', async (req, res) => {
        const { language } = req.body;

        try {
            const result = await LanguageShema.findOneAndDelete({ language }).exec();
            if (!result) {
                return res.json({ message: 'This language does not exist!' });
            }

            res.send({
                status: "Success",
                message: 'Language successfully deleted!',
                result
            });

        } catch (err) {
            res.send({
                status: "Error",
                message: err.message
            });
        }
    });
};
