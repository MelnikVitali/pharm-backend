const path = require('path');

module.exports = (app) => {
    app.get('/file-upload', (req, res) => {
        res.sendFile(path.join(
            __dirname,
            '../../public',
            'file-upload.html'
        ));
    });
};
