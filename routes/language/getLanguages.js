const LanguageShema = require('../../models/Language');

module.exports = (app) => {
    app.get('/languages', async (req, res) => {

        try {
            const result = await LanguageShema.find({}).exec();

            res.send({
                status: "Success",
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
