const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const User = require("./models/User");
const auth = require("./middleware/auth");

const app = express();
const httpServer = createServer(app);

// Update Socket.IO configuration
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:7780",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  pingTimeout: 60000,
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:7780",
    credentials: true,
  })
);
app.use(express.json());

// Socket.IO connection handling
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("user_connected", async (userId) => {
    try {
      console.log("User ID connected:", userId);
      connectedUsers.set(userId.toString(), socket.id);

      // Verify user exists and emit pending notifications
      const user = await User.findById(userId)
        .populate("friendRequests.from", "username")
        .select("friendRequests notifications");

      if (user) {
        console.log("Emitting initial notifications for user:", userId);
        socket.emit("pending_requests", user.friendRequests);
        socket.emit("notifications", user.notifications);
      } else {
        console.error("Invalid user ID:", userId);
      }
    } catch (error) {
      console.error("Error in user_connected:", error);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        console.log("User disconnected:", userId);
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// Update the notification function
async function notifyFriendRequest(userId, fromUser) {
  try {
    console.log(
      "Notifying user:",
      userId,
      "about request from:",
      fromUser.username
    );
    const socketId = connectedUsers.get(userId.toString());

    if (socketId) {
      // Fetch updated friend requests
      const user = await User.findById(userId)
        .populate("friendRequests.from", "username")
        .select("friendRequests notifications");

      if (!user) {
        console.error("User not found:", userId);
        return;
      }

      console.log(
        "Emitting to socket:",
        socketId,
        "friend requests:",
        user.friendRequests
      );

      // Emit both the friend requests and the new notification
      io.to(socketId).emit("pending_requests", user.friendRequests);
      io.to(socketId).emit("new_friend_request", {
        message: `${fromUser.username} sent you a friend request`,
        type: "friend_request",
        from: fromUser,
        createdAt: new Date(),
      });
    } else {
      console.log("User not connected:", userId);
    }
  } catch (error) {
    console.error("Error sending friend request notification:", error);
  }
}

// Make functions accessible to routes
app.set("io", io);
app.set("connectedUsers", connectedUsers);
app.set("notifyFriendRequest", notifyFriendRequest);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/friends", require("./routes/friends"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/recommendations", require("./routes/recommendations"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

// MongoDB Connection and Server Start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 7777;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
    });
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
};

startServer();
