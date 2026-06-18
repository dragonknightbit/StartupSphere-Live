const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  browseStartups,
  expressInterest,
  getMyInterests,
  getRecommendedStartups
} = require('../controllers/investorController');

const router = express.Router();

router.use(protect, authorize('investor'));

router.get('/startups', browseStartups);
router.post('/interest', expressInterest);
router.get('/my-interests', getMyInterests);
router.get('/recommendations', getRecommendedStartups);

module.exports = router;
