const passport = require("passport");

const upload = require('../../middlewares/uploadFilesMiddleware');

module.exports = (app) => {
    app.post('/content',
        passport.authenticate("jwt", { session: false }),
        upload.uploadFiles,
        upload.saveFiles
    );
};
