
const LanguageShema = require('../../models/Language');

module.exports = (app) => {
    app.post( '/add-language', async ( req, res ) => {
        const { language } = req.body;

        try {
            const languageDb = await LanguageShema.findOne( { language } ).exec();
            if ( !languageDb ) {
                const newLang = new LanguageShema( { language: language });
                const result = await newLang.save();
                res.send( {
                    status: "Success",
                    message: 'Language successfully added!',
                    result
                } );
            } else if ( languageDb.language === language ) {
                return res.json( { message: 'This language is already exist!' } );
            }
        } catch (err) {
            res.send( {
                status: "Error",
                message: err.message
            } );
        }
    });
};
