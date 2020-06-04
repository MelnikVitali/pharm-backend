const upload = require('../../middlewares/uploadFilesMiddleware');

module.exports = (app) => {
    app.post('/content',
        upload.uploadFiles,
        upload.saveFiles
    );
};
