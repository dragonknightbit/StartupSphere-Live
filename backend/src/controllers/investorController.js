const Startup = require("../models/Startup");
const InvestorInterest = require("../models/InvestorInterest");

const browseStartups = async (req, res) => {
  try {
    const query = { status: 'Approved' };
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.domain) query.domain = req.query.domain;
    if (req.query.stage) query.stage = req.query.stage;

    let startups = await Startup.find(query).populate("founder", "name email role");

    if (req.query.sort === "fundingRequired") {
      startups.sort((a, b) => b.fundingRequired - a.fundingRequired);
    } else {
      startups.sort((a, b) => b.createdAt - a.createdAt);
    }
    
    res.status(200).json(startups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const expressInterest = async (req, res) => {
  try {
    const { startupId, message } = req.body;
    const interest = await InvestorInterest.create({
      investorId: req.user._id,
      startupId,
      message
    });
    res.status(201).json(interest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyInterests = async (req, res) => {
  try {
    const interests = await InvestorInterest.find({ investorId: req.user._id }).populate('startupId');
    res.status(200).json(interests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecommendedStartups = async (req, res, next) => {
  try {
    const user = req.user; // from auth middleware
    if (!user || user.role !== 'investor') {
      return res.status(403).json({ message: "Access denied. Only investors get recommendations." });
    }

    // Find startups that match user's preferred domains or stages
    // Since we just added this feature, fallback to AI Score sorting if preferences are empty
    let query = { status: 'Approved' };
    
    if (user.preferredDomains && user.preferredDomains.length > 0) {
      query.domain = { $in: user.preferredDomains };
    }

    const startups = await Startup.find(query)
      .populate("founder", "name email profileImage")
      .sort({ "aiScore.innovation": -1, views: -1 })
      .limit(10); // Top 10 matches

    res.status(200).json(startups);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  browseStartups,
  expressInterest,
  getMyInterests,
  getRecommendedStartups
};
