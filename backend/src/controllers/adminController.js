const User = require("../models/User");
const Startup = require("../models/Startup");

const getAllUsers = async (req, res) => {
  try {
    const query = {};
    if (req.query.role) query.role = req.query.role;
    const users = await User.find(query).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.deleteOne();
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStartups = async (req, res) => {
  try {
    const startups = await Startup.find().populate('founder', 'name email role');
    res.status(200).json(startups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    startup.status = 'Approved';
    await startup.save();
    res.status(200).json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    await startup.deleteOne();
    res.status(200).json({ message: 'Startup deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllStartups,
  approveStartup,
  deleteStartup
};
