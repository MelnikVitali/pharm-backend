const sharp = require('sharp');

const resizeAndSaveImages = async (file) => {
    const fileName = file.originalname;

    const newFileName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;

    const resizedImage = await sharp(file.buffer)
        .webp({ quality: 80 })
        .toBuffer()

    return Promise.resolve({
        name: `${newFileName}.webp`,
        originalName: file.originalname,
        isImage: true,
        isRejected: false,
        base64: Buffer.from(resizedImage, 'binary').toString('base64')
    });
};

module.exports = resizeAndSaveImages;
