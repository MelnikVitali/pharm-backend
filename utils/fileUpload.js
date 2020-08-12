const fs = require('fs');
const path = require('path')

const uploadUrls = require('./../constans/uploadUrls');

const saveDocuments = async (file) => {
    await fs.writeFile(
        path.join(__dirname, `./../${uploadUrls.fileUploadUrl}`, file.originalname),
        file.buffer,
        (err) => {
            if (err) {
                console.error(err);
            }

            console.log(`The file ${file.originalname} was successfully  saved`);
        });

    const extension = file.originalname.split('.').pop();

    return Promise.resolve({
        name: file.originalname,
        originalName: file.originalname,
        fileType: extension,
        isImage: false,
        isRejected: false
    });
};

module.exports = saveDocuments;
