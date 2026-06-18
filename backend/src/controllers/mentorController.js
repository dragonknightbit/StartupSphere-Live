const MentorshipRequest = require("../models/MentorshipRequest");
const Feedback = require("../models/Feedback");

const getMentorRequests = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({
      status: 'pending'
    }).populate('startupId', 'title domain pitchDeck').populate('founderId', 'name email');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    request.status = 'accepted';
    request.mentorId = req.user._id;
    await request.save();
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { startupId, feedback, rating } = req.body;
    const newFeedback = await Feedback.create({
      startupId,
      mentorId: req.user._id,
      feedback,
      rating
    });
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyStartups = async (req, res) => {
  try {
    const acceptedRequests = await MentorshipRequest.find({
      mentorId: req.user._id,
      status: 'accepted'
    }).populate('startupId');
    res.status(200).json(acceptedRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMentorRequests,
  acceptRequest,
  submitFeedback,
  getMyStartups
};
