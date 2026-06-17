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

//pitch desk
const uploadPitchDeck = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({
        message: "Startup not found",
      });
    }

    if (
      startup.founder.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "StartupSphere/PitchDecks",
            resource_type: "raw",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer)
          .pipe(uploadStream);
      });
    };

    const result = await uploadFromBuffer();

    startup.pitchDeck = result.secure_url;

    await startup.save();

    res.status(200).json({
      message: "Pitch deck uploaded successfully",
      pitchDeck: startup.pitchDeck,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createStartup,
  getAllStartups,
  getStartupById,
  updateStartup,
  deleteStartup,
};