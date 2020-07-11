const express = require("express");
const { check } = require("express-validator");

const videosControllers = require("../controllers/videos-controllers");

const router = express.Router();

router.get("/:vid", videosControllers.getVideoById);

router.get("/party/:pid", videosControllers.getVideosByPartyId);

router.post(
  "/",
  [check("url").not().isEmpty(), check("thumbnail").not().isEmpty()],
  videosControllers.createVideo
);

router.patch(
  "/:vid",
  [check("url").not().isEmpty(), check("thumbnail").not().isEmpty()],
  videosControllers.updateVideo
);

router.delete("/:vid", videosControllers.deleteVideo);

module.exports = router;
