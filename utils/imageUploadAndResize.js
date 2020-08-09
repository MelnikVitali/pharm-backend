const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const uploadUrls = require('./../constans/uploadUrls');

const resizeAndSaveImages = async (file) => {
    const newFileId = uuidv4();

    await sharp(file.buffer)
        // .resize(640, 320)
        .webp({ lossless: true })
        .toFile(`${uploadUrls.imageUploadUrl}/${newFileId}.webp`,
            (err, data) => {
                if (err) {
                    console.error(err);
                }

                console.log(`The file ${newFileId} was compressed with extension .${data.format} and saved`);
            });

    await sharp(file.buffer)
        // .resize(640, 320)
        .png()
        .toFile(`${uploadUrls.imageUploadUrl}/${newFileId}.png`,
            (err, data) => {
                if (err) {
                    console.error(err);
                }
                console.log(`The file ${newFileId} was compressed with extension .${data.format} and saved`);
            });

    return Promise.resolve({
        imageName: newFileId,
        originalName: file.originalname,
        isImage: true,
        isRejected: false,
        base64: new Buffer(file, 'binary').toString('base64')
    });
};

module.exports = resizeAndSaveImages;
