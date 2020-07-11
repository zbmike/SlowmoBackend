const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

let DUMMY_VIDEO = [
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

const getVideoById = (req, res, next) => {
  const videoId = req.params.vid;
  const video = DUMMY_VIDEO.find((v) => {
    return v.id === videoId;
  });

  if (!video) {
    throw new HttpError("Could not find a video for the provided id.", 404);
  }

  res.json({ video });
};

const getVideosByPartyId = (req, res, next) => {
  const partyId = req.params.pid;
  const videos = DUMMY_VIDEO.filter((v) => {
    return v.partyId === partyId;
  });

  if (!videos || videos.length === 0) {
    return next(
      new HttpError("Could not find videos for the provided party id.", 404)
    );
  }

  res.json({ videos });
};

const createVideo = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { thumbnail, url, partyId } = req.body;
  const createdVideo = {
    id: uuid(),
    thumbnail,
    url,
    partyId,
  };

  DUMMY_VIDEO.push(createdVideo);

  res.status(201).json({ video: createdVideo });
};

const updateVideo = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { thumbnail, url } = req.body;
  const videoId = req.params.vid;

  const updatedVideo = { ...DUMMY_VIDEO.find((v) => v.id === videoId) };
  const videoIndex = DUMMY_VIDEO.findIndex((v) => v.id === videoId);
  updatedVideo.thumbnail = thumbnail;
  updatedVideo.url = url;

  DUMMY_VIDEO[videoIndex] = updatedVideo;
  res.status(200).json({ video: updatedVideo });
};

const deleteVideo = (req, res, next) => {
  const videoId = req.params.vid;
  if (!DUMMY_VIDEO.find((v) => v.id === videoId)) {
    throw new HttpError("Could not find a video for that id.", 404);
  }
  DUMMY_VIDEO = DUMMY_VIDEO.filter((v) => v.id !== videoId);
  res.status(200).json({ message: "Video deleted." });
};

exports.getVideoById = getVideoById;
exports.getVideosByPartyId = getVideosByPartyId;
exports.createVideo = createVideo;
exports.updateVideo = updateVideo;
exports.deleteVideo = deleteVideo;
