const express = require("express");

const {
  createStartup,
  getAllStartups,
  getStartupById,
  updateStartup,
  deleteStartup,
} = require("../controllers/startupController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createStartup);

router.get("/", getAllStartups);

router.get("/:id", getStartupById);

router.put("/:id", protect, updateStartup);

router.delete("/:id", protect, deleteStartup);

module.exports = router;