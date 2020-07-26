const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const videoSchema = new Schema({
  url: { type: String, required: true },
  partyId: { type: mongoose.Types.ObjectId, required: true, ref: "Party" },
});

module.exports = mongoose.model("Video", videoSchema);
