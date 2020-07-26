const express = require("express");
const { check } = require("express-validator");

const videosControllers = require("../controllers/videos-controllers");
const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload-s3");

const router = express.Router();

router.use(checkAuth);

router.get("/:vid", videosControllers.getVideoById);

router.get("/party/:pid", videosControllers.getVideosByPartyId);

router.post(
  "/party/:pid",
  fileUpload.single("video"),
  videosControllers.createVideo
);

router.delete("/:vid", videosControllers.deleteVideo);

module.exports = router;
