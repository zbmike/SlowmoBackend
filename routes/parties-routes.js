const express = require("express");
const { check } = require("express-validator");

const partiesController = require("../controllers/parties-controllers");

const router = express.Router();

router.get("/", partiesController.getParties);

router.post(
  "/",
  [check("name").not().isEmpty(), check("image").not().isEmpty()],
  partiesController.createParty
);

module.exports = router;
