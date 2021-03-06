const Image = require("../../models/Image");
const passport = require("passport");

module.exports = (app) => {
    app.get('/pictures',
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
            try {
                const result = await Image.find(req.query).sort({ date: -1 });

                res.send(result);
            } catch (err) {
                res
                    .status(500)
                    .send({ error: 'Error while getting list of images' });
            }
        });
};
