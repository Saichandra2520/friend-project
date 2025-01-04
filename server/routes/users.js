const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Get all users except current user
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user.userId },
      friends: { $ne: req.user.userId },
    }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Search users
router.get("/search", auth, async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const users = await User.find({
      username: { $regex: searchTerm, $options: "i" },
      _id: { $ne: req.user.userId },
      friends: { $ne: req.user.userId },
    }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
