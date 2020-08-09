const fs = require('fs');
const path = require('path');
const passport = require("passport");

const File = require('../../models/File');
const uploadUrls = require('../../constans/uploadUrls');

module.exports = (app) => {
    app.delete('/files/:id',
        passport.authenticate("jwt", { session: false }),
        async (req, res) => {
            try {
                const file = await File.findById(req.params.id);

                if (file === null) {
                    const errorMessage = `File with _id: ${req.params.id} not found!`
                    console.error(errorMessage);

                    return res
                        .status(400)
                        .json({
                            status: 'Error',
                            error: errorMessage
                        });
                }

                const fileName = file.fileName;

                await fs.unlink(
                    path.join(__dirname, `../../${uploadUrls.fileUploadUrl}`, fileName),
                    (err) => {
                        if (err) {
                            console.log(err.message);

                            return res
                                .status(400)
                                .json({
                                    status: 'Error',
                                    error: err.message
                                });
                        }

                        console.log(`Successfully deleted local file ${fileName}`);
                    });

                const result = await File.findByIdAndRemove(req.params.id);

                await res.send({
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
