const fs = require('fs');
const path = require('path')

const saveDocuments = async (file) => {
    await fs.writeFile(
        path.join(__dirname, '/../public/uploads/files', file.originalname),
        file.buffer,
        (err) => {
            if (err) {
                console.log(err);
            }
            console.log(`The file ${file.originalname} was successfully  saved`);
        });

    const extension = file.originalname.split('.').pop();

    return Promise.resolve({
        fileName: file.originalname,
        originalName: file.originalname,
        fileType: extension,
        isImage: false,
        isRejected: false
    });
};

module.exports = saveDocuments;
