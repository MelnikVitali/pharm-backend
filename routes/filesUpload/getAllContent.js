const passport = require("passport");

const File = require('../../models/File');
const Image = require('../../models/Image');

module.exports = (app) => {
    app.get('/content',
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
            try {
                const file = await File.find(req.query);
                const image = await Image.find(req.query);

                const result = [ ...file, ...image ];

                res.send({
                    status: 'Success',
                    result: result
                });
            } catch (err) {
                res.send({
                    status: 'Error',
                    message: err
                });
            }
        });
};
