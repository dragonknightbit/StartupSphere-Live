const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const startupRoutes = require("./routes/startupRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("StartupSphere API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/startups", startupRoutes);

module.exports = app;