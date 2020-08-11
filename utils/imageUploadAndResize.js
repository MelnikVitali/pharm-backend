const sharp = require('sharp');
const path = require('path');
// const { v4: uuidv4 } = require('uuid');

// const uploadUrls = require('./../constans/uploadUrls');

const resizeAndSaveImages = async (file) => {
    const fileName = file.originalname;

    const newFileName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;

    // const newFileId = uuidv4();
    //
    // await sharp(file.buffer)
    //     // .resize(640, 320)
    //     .webp({ lossless: true })
    //     .toFile(`${uploadUrls.imageUploadUrl}/${newFileId}.webp`,
    //         (err, data) => {
    //             if (err) {
    //                 console.error(err);
    //             }
    //
    //             console.log(`The file ${newFileId} was compressed with extension .${data.format} and saved`);
    //         });
    //
    const resizedImage = await sharp(file.buffer)
        .webp({ quality: 80 })
        .toBuffer()

    return Promise.resolve({
        imageName: `${newFileName}.webp`,
        originalName: file.originalname,
        isImage: true,
        isRejected: false,
        base64: Buffer.from(resizedImage, 'binary').toString('base64')
    });
};

module.exports = resizeAndSaveImages;
