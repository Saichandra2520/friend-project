const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Get friends list
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate("friends", "-password")
      .select("friends");
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Send friend request
router.post("/request/:userId", auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if request already exists
    const existingRequest = targetUser.friendRequests.find(
      (request) => request.from.toString() === req.user.userId
    );

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Add friend request
    targetUser.friendRequests.push({ from: req.user.userId });
    await targetUser.save();

    // Send real-time notification
    const io = req.app.get("io");
    const connectedUsers = req.app.get("connectedUsers");
    const targetSocketId = connectedUsers.get(targetUser._id.toString());

    if (targetSocketId) {
      io.to(targetSocketId).emit("friend_request", {
        from: req.user.userId,
        message: "New friend request received",
      });
    }

    res.json({ message: "Friend request sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Accept friend request
router.put("/accept/:userId", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    const requestingUser = await User.findById(req.params.userId);

    if (!requestingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update friend request status
    const requestIndex = currentUser.friendRequests.findIndex(
      (request) => request.from.toString() === req.params.userId
    );

    if (requestIndex === -1) {
      return res.status(400).json({ message: "Friend request not found" });
    }

    // Add each user to the other's friends list
    currentUser.friends.push(req.params.userId);
    requestingUser.friends.push(req.user.userId);

    // Remove the friend request
    currentUser.friendRequests.splice(requestIndex, 1);

    await Promise.all([currentUser.save(), requestingUser.save()]);

    // Send real-time notification
    const io = req.app.get("io");
    const connectedUsers = req.app.get("connectedUsers");
    const targetSocketId = connectedUsers.get(req.params.userId);

    if (targetSocketId) {
      io.to(targetSocketId).emit("friend_request_accepted", {
        from: req.user.userId,
        message: "Friend request accepted",
      });
    }

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get friend recommendations
router.get("/recommendations", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("friends");
    const friendIds = user.friends.map((friend) => friend._id);

    // Find users who are friends of friends but not current friends
    const recommendations = await User.aggregate([
      {
        $match: {
          _id: { $nin: [...friendIds, user._id] },
          friends: { $in: friendIds },
        },
      },
      {
        $addFields: {
          mutualFriends: {
            $size: {
              $setIntersection: ["$friends", friendIds],
            },
          },
        },
      },
      {
        $sort: { mutualFriends: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Unfriend
router.delete("/:userId", auth, async (req, res) => {
  try {
    const [currentUser, friendUser] = await Promise.all([
      User.findById(req.user.userId),
      User.findById(req.params.userId),
    ]);

    if (!friendUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from each other's friends lists
    currentUser.friends = currentUser.friends.filter(
      (id) => id.toString() !== req.params.userId
    );
    friendUser.friends = friendUser.friends.filter(
      (id) => id.toString() !== req.user.userId
    );

    await Promise.all([currentUser.save(), friendUser.save()]);

    res.json({ message: "Friend removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get pending friend requests
router.get("/requests", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate("friendRequests.from", "username")
      .select("friendRequests");

    res.json(user.friendRequests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
