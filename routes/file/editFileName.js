const fs = require('fs');
const path = require('path');

const File = require('../../models/File');

module.exports = (app) => {
    app.put('/files/:id', async (req, res) => {
        try {
            const file = await File.findById(req.params.id);

            if (file === null) {
                const errorMessage = `File with _id: ${req.params.id} not found!`;
                console.log(errorMessage);

                return res
                    .status(400)
                    .json({
                    status: 'Error',
                    error: errorMessage
                });
            }

            if (!(req.body.fileName).trim()) {
                const errorMessage = `The file name must be specified.`;
                console.log(errorMessage);

                return res
                    .status(400)
                    .json({
                        status: 'Error',
                        error: errorMessage
                    });
            }

            const oldFileName = file.fileName;
            const newFileName = `${(req.body.fileName).trim()}.${file.fileType}`;

            await fs.rename(
                path.join(__dirname, '/../../public/uploads/files', oldFileName),
                path.join(__dirname, '/../../public/uploads/files', newFileName),
                (err) => {
                    if (err) {
                        return res
                            .status(400)
                            .json({
                            status: 'Error',
                            error: err.message
                        });
                    }

                    console.log(`Successfully renamed local file ${oldFileName} to new name ${newFileName}`);
                }
            );

            const updatedFile = {
                fileName: newFileName
            };

            const result = await File.findByIdAndUpdate(req.params.id, updatedFile, { new: true });

            res.send({
                status: 'Success',
                result: result
            });
        } catch (err) {
            res.send({
                status: 'Error',
                message: err.message
            });
        }
    });
};
