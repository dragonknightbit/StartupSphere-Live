const mongoose = require("mongoose");

const startupSchema = new mongoose.Schema(
  {
    founder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    tagline: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    domain: {
      type: String,
      required: true,
    },

    stage: {
      type: String,
      enum: [
        "Idea",
        "Prototype",
        "MVP",
        "Early Revenue",
        "Scaling",
      ],
      default: "Idea",
    },

    fundingRequired: {
      type: Number,
      default: 0,
    },

    teamSize: {
      type: Number,
      default: 1,
    },

    website: {
      type: String,
      default: "",
    },

    pitchDeck: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Draft",
        "AI Evaluated",
        "Needs Improvement",
        "Approved",
      ],
      default: "Draft",
    },

    aiScore: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Startup",
  startupSchema
);