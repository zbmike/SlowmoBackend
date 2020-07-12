const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const videoSchema = new Schema({
  thumbnail: { type: String, required: true },
  url: { type: String, required: true },
  partyId: { type: String, required: true },
});

module.exports = mongoose.model("Video", videoSchema);
