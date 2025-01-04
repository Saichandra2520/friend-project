const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Get predefined interests list
router.get("/", async (req, res) => {
  // Predefined list of interests
  const interests = [
    "Technology",
    "Sports",
    "Music",
    "Movies",
    "Books",
    "Travel",
    "Food",
    "Art",
    "Photography",
    "Gaming",
    "Fitness",
    "Fashion",
    "Science",
    "Nature",
    "Cooking",
  ];
  res.json(interests);
});

// Update user interests
router.put("/", auth, async (req, res) => {
  try {
    const { interests } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.interests = interests;
    await user.save();

    res.json({
      message: "Interests updated successfully",
      interests: user.interests,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating interests" });
  }
});

module.exports = router;
