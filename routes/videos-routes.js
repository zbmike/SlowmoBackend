const express = require("express");

const HttpError = require("../models/http-error");

const router = express.Router();

const DUMMY_VIDEO = [
  {
    id: "v1",
    thumbnail:
      "https://www.videostudiopro.com/static/vsp/images/pages/seo/tips/make/slow-motion-video.jpg",
    url: "http://techslides.com/demos/sample-videos/small.mp4",
    partyId: "p1",
  },
  {
    id: "v2",
    thumbnail:
      "https://image.pbs.org/video-assets/amw1aWn-asset-mezzanine-16x9-esHyPoR.JPG?crop=384x215&?format=jpg",
    url: "http://techslides.com/demos/sample-videos/small.mp4",
    partyId: "p2",
  },
];

router.get("/:vid", (req, res, next) => {
  const videoId = req.params.vid;
  const video = DUMMY_VIDEO.find((v) => {
    return v.id === videoId;
  });

  if (!video) {
    throw new HttpError("Could not find a video for the provided id.", 404);
  }

  res.json({ video });
});

router.get("/party/:pid", (req, res, next) => {
  const partyId = req.params.pid;
  const video = DUMMY_VIDEO.find((v) => {
    return v.partyId === partyId;
  });

  if (!video) {
    return next(
      new HttpError("Could not find a video for the provided party id.", 404)
    );
  }

  res.json({ video });
});

module.exports = router;
