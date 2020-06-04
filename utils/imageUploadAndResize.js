const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const resizeAndSaveImages = async (file) => {
    const newFileId = uuidv4();

    await sharp(file.buffer)
        // .resize(640, 320)
        .webp({ lossless: true })
        .toFile(`./public/uploads/images/${newFileId}.webp`,
            (err, data) => {
                if (err) {
                    console.log(err);
                }
                console.log(`The file ${newFileId} was compressed with extension .${data.format} and saved`);
            });

    await sharp(file.buffer)
        .resize(640, 320)
        .png()
        .toFile(`./public/uploads/images/${newFileId}.png`,
            (err, data) => {
                if (err) {
                    console.log(err);
                }
                console.log(`The file ${newFileId} was compressed with extension .${data.format} and saved`);
            });

    return Promise.resolve({
        imageName: newFileId,
        originalName: file.originalname,
        isImage: true,
        isRejected: false
    });
};

module.exports = resizeAndSaveImages;
