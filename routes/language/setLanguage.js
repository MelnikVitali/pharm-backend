const LanguageShema = require('../../models/Language');
const mongoose = require('mongoose');

module.exports = (app) => {
    app.post('/set-language', async (req, res) => {
        const { language } = req.body;
        try {
            const result = await LanguageShema.findOne({ language }).exec();
            if (!result) {
                res.send({
                    status: "Error",
                    message: "This language is missing"
                });
            }

            mongoose.setDefaultLanguage(language);

            res.send({
                status: "Success",
                message: 'Language successfully changed!',
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
