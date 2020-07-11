const express = require("express");

const videosControllers = require("../controllers/videos-controllers");

const router = express.Router();

router.get("/:vid", videosControllers.getVideoById);

router.get("/party/:pid", videosControllers.getVideosByPartyId);

router.post("/", videosControllers.createVideo);

router.patch("/:vid", videosControllers.updateVideo);

router.delete("/:vid", videosControllers.deleteVideo);

module.exports = router;
