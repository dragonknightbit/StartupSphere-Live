const User = require("../models/User");
const Startup = require("../models/Startup");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStartups = await Startup.countDocuments();
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const totalInvestors = await User.countDocuments({ role: 'investor' });

    const startupsByDomain = await Startup.aggregate([
      { $group: { _id: '$domain', count: { $sum: 1 } } }
    ]);

    const startupsByStage = await Startup.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 } } }
    ]);

    const recentStartups = await Startup.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('founder', 'name');

    res.status(200).json({
      totalUsers,
      totalStartups,
      totalMentors,
      totalInvestors,
      startupsByDomain,
      startupsByStage,
      recentStartups
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
