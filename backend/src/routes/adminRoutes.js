const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  getAllUsers,
  deleteUser,
  getAllStartups,
  approveStartup,
  deleteStartup
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/startups', getAllStartups);
router.put('/startups/:id/approve', approveStartup);
router.delete('/startups/:id', deleteStartup);

module.exports = router;
