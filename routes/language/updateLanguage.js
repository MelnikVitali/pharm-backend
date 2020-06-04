const LanguageShema = require('../../models/Language');

module.exports = (app) => {
    app.put('/update-language/', async (req, res) => {
        const { language } = req.body;
        const lan = req.params.lan;
        try {
            const langForUpdate = await LanguageShema.findOne({ language }).exec();
            if (langForUpdate) {
                return res.json({ message: 'Can not update. This language is already exist!' });
            }
            const result = await LanguageShema.findOneAndUpdate(lan, { language }).exec();
            if (!result) {
                return res.json({ message: 'The language that you want to update does not exist!' });
            }

            res.send({
                status: "Success",
                message: 'Language successfully updated!',
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
