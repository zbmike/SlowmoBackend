const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Video = require("../models/video");

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

const getVideoById = async (req, res, next) => {
  const videoId = req.params.vid;
  let video;
  try {
    video = await Video.findById(videoId); // add .exec() to make it a promise
  } catch (err) {
    const error = new HttpError("Failed to fetch video, try again", 500);
    return next(error);
  }

  if (!video) {
    const error = new HttpError(
      "Could not find a video for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ video: video.toObject({ getters: true }) });
};

const getVideosByPartyId = async (req, res, next) => {
  const partyId = req.params.pid;

  let videos;
  try {
    videos = await Video.find({ partyId });
  } catch {
    const error = new HttpError("Failed to fetch video, try again", 500);
    return next(error);
  }

  if (!videos || videos.length === 0) {
    return next(
      new HttpError("Could not find videos for the provided party id.", 404)
    );
  }

  res.json({ videos });
};

const createVideo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { thumbnail, url, partyId } = req.body;
  const createdVideo = new Video({
    thumbnail,
    url,
    partyId,
  });
  try {
    await createdVideo.save();
  } catch (err) {
    const error = new HttpError("Failed to create video, try again", 500);
    return next(error);
  }

  DUMMY_VIDEO.push(createdVideo);

  res.status(201).json({ video: createdVideo });
};

const updateVideo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { thumbnail, url } = req.body;
  const videoId = req.params.vid;

  let video;

  try {
    video = await Video.findById(videoId);
  } catch (err) {
    const error = new HttpError("Failed to update video, try again", 500);
    return next(error);
  }

  video.thumbnail = thumbnail;
  video.url = url;

  try {
    await video.save();
  } catch (err) {
    const error = new HttpError("Failed to update video, try again", 500);
    return next(error);
  }
  res.status(200).json({ video: video.toObject({ getters: true }) });
};

const deleteVideo = async (req, res, next) => {
  const videoId = req.params.vid;

  let video;
  try {
    video = await Video.findById(videoId);
  } catch (err) {
    const error = new HttpError("Failed to delete video, try again", 500);
    return next(error);
  }

  try {
    await video.remove();
  } catch (err) {
    const error = new HttpError("Failed to delete video, try again", 500);
    return next(error);
  }
  res.status(200).json({ message: "Video deleted." });
};

exports.getVideoById = getVideoById;
exports.getVideosByPartyId = getVideosByPartyId;
exports.createVideo = createVideo;
exports.updateVideo = updateVideo;
exports.deleteVideo = deleteVideo;
