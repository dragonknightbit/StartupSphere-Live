require("dotenv").config();

// 1. Network Bypass (Fixes the MongoDB timeout in your region)
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// 2. Import the clean Express app and DB connection
const app = require("./src/app");
const connectDB = require("./src/config/db");
const http = require("http");
const { Server } = require("socket.io");

// 3. Connect to Database
connectDB();



// 4. Start Server
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("newStartupCreated", (message) => {
    socket.broadcast.emit("receiveNotification", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});