const multer = require('multer');

const File = require('../models/File');
const Image = require('../models/Image');

const resizeAndSaveImages = require('../utils/imageUploadAndResize');
const saveDocuments = require('../utils/fileUpload');

const imageMimeTypes = require('../constans/imageMimeTypes');
const docsMimeTypes = require('../constans/docsMimeTypes');
const allowedFileExtensions = require('../constans/allowedFileExtensions');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (imageMimeTypes.includes(file.mimetype) || docsMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(`Please upload only ${allowedFileExtensions.join(', ')} file extensions.`, false);
    }
};

const multerLimits = {
    fieldSize: 20 * 1024 * 1024
};

const upload = multer({
    storage: multerStorage,
    limits: multerLimits,
    fileFilter: multerFilter
});

const uploadMulterFiles = upload.array('myFiles', 10);

const uploadFiles = (req, res, next) => {
    uploadMulterFiles(req, res, err => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res
                    .status(400)
                    .json({
                        status: 'Error',
                        error: `Too many files to upload.`
                    });
            }
        } else if (err) {
            return res
                .status(400)
                .json({
                    status: 'Error',
                    error: err
                });
        }

        if (req.files.length <= 0) {
            return res
                .status(400)
                .json({
                    status: 'Error',
                    error: `You must select at least 1 image.`
                });
        }

        next();
    });
};

const saveFiles = async (req, res, next) => {
    if (!req.files) return next();

    const result = await Promise.allSettled(
        req.files.map(async (file) => {
            const fileInDatabase = await File.findOne({ originalName: file.originalname });
            const imageInDatabase = await Image.findOne({ originalName: file.originalname });

            if (fileInDatabase || imageInDatabase) {
                console.log(`'Rejected': A file with the same name already exists!`);

                return Promise.reject({
                    status: 'Rejected',
                    reason: `A file with the same name ${file.originalname} already exists.`,
                    fileName: file.originalname,
                    fileType: file.originalname.split('.').pop(),
                    isRejected: true
                });
            }

            const checkedImage = imageMimeTypes.includes(file.mimetype) && imageInDatabase === null;
            const checkedFile = docsMimeTypes.includes(file.mimetype) && fileInDatabase === null;

            switch (true) {
                case checkedImage:
                    return resizeAndSaveImages(file);

                case checkedFile :
                    return saveDocuments(file);

                default:
                    return Promise.resolve(file);
            }
        })
    );

    const filterResult = result.map(file => file.value ? file.value : file.reason);

    const images = [];
    const files = [];
    const rejectedFiles = [];

    filterResult.forEach(file => {
        switch (true) {
            case (file.isImage && !file.isRejected):
                images.push(file);
                break;

            case (!file.isImage && !file.isRejected):
                files.push(file);
                break;

            case file.isRejected:
                rejectedFiles.push(file);
                break;

            default:
                return file;
        }
    })

    if (rejectedFiles.length === req.files.length) {
        const errorMessage = `All files with such names already exist!`;
        console.log(errorMessage);

        return res
            .status(400)
            .json({
                status: 'Error',
                error: errorMessage
            });
    }

    const insertedFiles = new Promise((resolve, reject) => {
        File.insertMany(files, (err, result) => {
            if (err) {
                reject(err);
            }

            resolve(result);
        });
    });

    const insertedImages = new Promise((resolve, reject) => {
        Image.insertMany(images, (err, result) => {
            if (err) {
                reject(err);
            }

            resolve(result);
        });
    });

    try {
        const resultFiles = await insertedFiles;
        const resultImages = await insertedImages;

        await res.json({
            status: 'Success',
            saved: [ ...resultFiles, ...resultImages ],
            rejected: [...rejectedFiles]
        });
    } catch (err) {
        await res.send({
            status: "Error",
            message: err.message
        });
    }
};

module.exports = {
    uploadFiles: uploadFiles,
    saveFiles: saveFiles
};
