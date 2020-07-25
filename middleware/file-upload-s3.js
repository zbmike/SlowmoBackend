const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "video/mp4": "mp4",
};

aws.config.update({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
});

const s3 = new aws.S3();

const fileUpload = multer({
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: "slowmovideo",
    key: (req, file, cb) => {
      console.log(file);
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, Date.now().toString() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
