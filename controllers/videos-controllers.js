const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Video = require("../models/video");
const Party = require("../models/party");

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

  let partyWithVideos;
  try {
    partyWithVideos = await Party.findById(partyId).populate("videos");
  } catch (err) {
    const error = new HttpError(
      "Fetching videos failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!partyWithVideos) {
    return next(
      new HttpError("Could not find videos for the provided party id.", 404)
    );
  }

  res.json({
    videos: partyWithVideos.videos.map((video) =>
      video.toObject({ getters: true })
    ),
    thumbnail: partyWithVideos.image,
    name: partyWithVideos.name,
  });
};

const createVideo = async (req, res, next) => {
  const partyId = req.params.pid;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const createdVideo = new Video({
    url: req.file.location,
    partyId,
  });

  let party;
  try {
    party = await Party.findById(partyId);
  } catch (err) {
    const error = new HttpError(
      "Uploading video failed, please try again.",
      500
    );
    return next(error);
  }
  if (!party) {
    const error = new HttpError("Could not find party for provided id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdVideo.save({ session: sess });
    party.videos.push(createdVideo);
    await party.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Uploading video failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ video: createdVideo });
};

const deleteVideo = async (req, res, next) => {
  const videoId = req.params.vid;
  let video;
  try {
    video = await Video.findById(videoId).populate("partyId");
  } catch (err) {
    const error = new HttpError("Failed to delete video, try again", 500);
    return next(error);
  }

  if (!video) {
    const error = new HttpError("Could not find video for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await video.remove({ session: sess });
    video.partyId.videos.pull(video);
    await video.partyId.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Failed to delete video, try again", 500);
    return next(error);
  }
  res.status(200).json({ message: "Video deleted." });
};

exports.getVideoById = getVideoById;
exports.getVideosByPartyId = getVideosByPartyId;
exports.createVideo = createVideo;
exports.deleteVideo = deleteVideo;
