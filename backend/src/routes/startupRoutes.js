const express = require("express");

const {
  createStartup,
  getAllStartups,
  getStartupById,
  updateStartup,
  deleteStartup,
  requestMentor,
  getPitchDeck,
} = require("../controllers/startupController");

const {
  protect,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", protect, upload.single('pitchDeck'), createStartup);

router.get("/", getAllStartups);

router.get("/:id", getStartupById);

router.get("/:id/pitchdeck", getPitchDeck);

router.post("/:id/request-mentor", protect, requestMentor);

router.put("/:id", protect, updateStartup);

router.delete("/:id", protect, deleteStartup);

module.exports = router;