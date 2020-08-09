const passport = require("passport");

const path = require('path');

module.exports = (app) => {
    app.get('/file-upload',
        passport.authenticate("jwt", { session: false }),
        (req, res) => {
            res.sendFile(path.join(
                __dirname,
                '../../public',
                'file-upload.html'
            ));
        });
};
