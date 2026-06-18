const Startup = require("../models/Startup");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Create Startup
const createStartup = async (req, res) => {
  try {
    const {
      title,
      tagline,
      description,
      domain,
      stage,
      fundingRequired,
      teamSize,
      website,
    } = req.body;

    // Prevent Duplicate Submissions
    const existingStartup = await Startup.findOne({ title: title, founder: req.user._id });
    if (existingStartup) {
      return res.status(400).json({ message: "You have already launched a startup with this exact same name! Please use a different name or edit your existing startup." });
    }

    const startup = await Startup.create({
      founder: req.user._id,
      title,
      tagline,
      description,
      domain,
      stage,
      fundingRequired,
      teamSize,
      website,
    });

    if (req.file) {
      const PitchDeck = require("../models/PitchDeck");
      
      // Store the buffer as base64 in the database
      const base64Data = req.file.buffer.toString('base64');
      await PitchDeck.create({
        startupId: startup._id,
        data: base64Data
      });

      // Point the startup to the dynamic backend route
      const serverUrl = `${req.protocol}://${req.get('host')}`;
      startup.pitchDeck = `${serverUrl}/api/startups/${startup._id}/pitchdeck`;
      await startup.save();
    }

    res.status(201).json(startup);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Startups + Search + Filter
const getAllStartups = async (req, res) => {
  try {
    const query = {};

    // Search by title
    if (req.query.search) {
      query.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    // Filter by domain
    if (req.query.domain) {
      query.domain = req.query.domain;
    }

    // Filter by stage
    if (req.query.stage) {
      query.stage = req.query.stage;
    }

    let startups = await Startup.find(query)
      .populate("founder", "name email role");

    // Sort by views
    if (req.query.sort === "views") {
      startups.sort((a, b) => b.views - a.views);
    }

    res.status(200).json(startups);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Startup By ID
const getStartupById = async (req, res) => {
  try {
    const startup = await Startup.findById(
      req.params.id
    ).populate(
      "founder",
      "name email role"
    );

    if (!startup) {
      return res.status(404).json({
        message: "Startup not found",
      });
    }

    startup.views += 1;
    await startup.save();

    res.status(200).json(startup);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Startup
const updateStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({
        message: "Startup not found",
      });
    }

    // Only owner can update
    if (
      startup.founder.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const updatedStartup = await Startup.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedStartup);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Startup
const deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({
        message: "Startup not found",
      });
    }

    // Only founder can delete
    if (
      startup.founder.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await startup.deleteOne();

    res.status(200).json({
      message: "Startup deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Request Mentor (Broadcast to all mentors)
const requestMentor = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    // Only founder can request
    if (startup.founder.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const MentorshipRequest = require("../models/MentorshipRequest");
    
    // Check if already requested
    const existingReq = await MentorshipRequest.findOne({ startupId: startup._id, status: 'pending' });
    if (existingReq) {
      return res.status(400).json({ message: "A mentorship request is already pending for this startup." });
    }

    const newRequest = await MentorshipRequest.create({
      startupId: startup._id,
      founderId: req.user._id
      // mentorId is intentionally left blank so it broadcasts to all
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Serve Pitch Deck from MongoDB
const getPitchDeck = async (req, res) => {
  try {
    const PitchDeck = require("../models/PitchDeck");
    const pitchDeck = await PitchDeck.findOne({ startupId: req.params.id });
    
    if (!pitchDeck) {
      // Fallback for old startups (Cloudinary or local)
      const startup = await Startup.findById(req.params.id);
      if (startup && startup.pitchDeck && startup.pitchDeck.startsWith('http')) {
        return res.redirect(startup.pitchDeck);
      }
      return res.status(404).send("Pitch Deck not found");
    }

    const buffer = Buffer.from(pitchDeck.data, 'base64');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="PitchDeck.pdf"');
    res.send(buffer);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createStartup,
  getAllStartups,
  getStartupById,
  updateStartup,
  deleteStartup,
  requestMentor,
  getPitchDeck,
};