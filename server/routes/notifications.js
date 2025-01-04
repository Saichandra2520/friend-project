const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Get all notifications
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate("notifications.from", "username")
      .select("notifications");
    res.json(user.notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark notification as read
router.put("/:notificationId/read", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const notification = user.notifications.id(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await user.save();
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Clear all notifications
router.delete("/clear", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.notifications = [];
    await user.save();
    res.json({ message: "All notifications cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
