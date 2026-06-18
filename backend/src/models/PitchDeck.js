const mongoose = require("mongoose");

const pitchDeckSchema = new mongoose.Schema({
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Startup",
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PitchDeck", pitchDeckSchema);
