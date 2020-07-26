const express = require("express");
const { check } = require("express-validator");

const partiesController = require("../controllers/parties-controllers");
const fileUpload = require("../middleware/file-upload-s3");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", (req, res, next) => res.status(200));

router.use(checkAuth);

router.get("/user/:uid", partiesController.getPartiesByUserId);

router.post(
  "/",
  fileUpload.single("image"),
  [check("name").not().isEmpty()],
  partiesController.createParty
);

module.exports = router;
