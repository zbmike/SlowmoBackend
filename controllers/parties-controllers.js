const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Party = require("../models/party");
const User = require("../models/user");

const getParties = async (req, res, next) => {
  let parties;
  try {
    parties = await Party.find({});
  } catch (err) {
    const error = new HttpError(
      "Failed to fetch parties, please try again.",
      500
    );
    return next(error);
  }
  res.json({
    parties: parties.map((party) => party.toObject({ getters: true })),
  });
};

const createParty = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { name } = req.body;
  const createdParty = new Party({
    name,
    image: req.file.location,
    videos: [],
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating party failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdParty.save({ session: sess });
    user.parties.push(createdParty);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating party failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ party: createdParty });
};

exports.getParties = getParties;
exports.createParty = createParty;
