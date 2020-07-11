const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const DUMMY_PARTIES = [
  {
    id: "p1",
    name: "Andy&Mai's Wedding",
    image:
      "https://images.ctfassets.net/77l22z9el0aa/68X8glzRII6myuoYsI6E0S/02ceb485340fcf2ea2227e99b164be21/3963534.jpg?fm=jpg&fl=progressive&q=75&w=2000",
    videos: 3,
  },
];

const getParties = (req, res, next) => {
  res.json({ parties: DUMMY_PARTIES });
};

const createParty = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { name, image } = req.body;
  const hasParty = DUMMY_PARTIES.find((p) => p.name === name);

  if (hasParty) {
    throw new HttpError("Could not create party with same name.", 422);
  }

  const createdParty = {
    id: uuid(),
    name,
    image,
    videos: 0,
  };

  DUMMY_PARTIES.push(createdParty);

  res.status(201).json({ user: createdParty });
};

exports.getParties = getParties;
exports.createParty = createParty;
