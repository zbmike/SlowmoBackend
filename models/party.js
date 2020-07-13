const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const partySchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  videos: [{ type: mongoose.Types.ObjectId, required: true, ref: "Video" }],
});

module.exports = mongoose.model("party", partySchema);
