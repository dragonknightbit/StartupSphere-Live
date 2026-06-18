const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  getMentorRequests,
  acceptRequest,
  submitFeedback,
  getMyStartups
} = require('../controllers/mentorController');

const router = express.Router();

router.use(protect, authorize('mentor'));

router.get('/requests', getMentorRequests);
router.put('/requests/:id/accept', acceptRequest);
router.post('/feedback', submitFeedback);
router.get('/my-startups', getMyStartups);

module.exports = router;
