const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Party = require("../models/party");

const DUMMY_PARTIES = [
  {
    id: "p1",
    name: "Andy&Mai's Wedding",
    image:
      "https://images.ctfassets.net/77l22z9el0aa/68X8glzRII6myuoYsI6E0S/02ceb485340fcf2ea2227e99b164be21/3963534.jpg?fm=jpg&fl=progressive&q=75&w=2000",
    videos: 3,
  },
];

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
  const { name, image } = req.body;

  let existingParty;
  try {
    existingParty = await Party.findOne({ name });
  } catch (err) {
    const error = new HttpError(
      "Failed to create Party, please try again later.",
      500
    );
    return next(error);
  }
  if (existingParty) {
    throw new HttpError("Could not create party with same name.", 422);
  }

  const createdParty = new Party({
    name,
    image,
    videos: [],
  });

  try {
    await createdParty.save();
  } catch (err) {
    const error = new HttpError(
      "Failed to create Party, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ party: createdParty.toObject({ getters: true }) });
};

exports.getParties = getParties;
exports.createParty = createParty;
