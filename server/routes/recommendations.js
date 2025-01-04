const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Helper function to calculate mutual friends score
const calculateMutualFriendsScore = (userFriends, otherUserFriends) => {
  const mutualCount = userFriends.filter((friend) =>
    otherUserFriends.some(
      (otherFriend) => otherFriend.toString() === friend.toString()
    )
  ).length;

  // Normalize score between 0 and 1
  return mutualCount / Math.max(userFriends.length, 1);
};

// Get friend recommendations
router.get("/", auth, async (req, res) => {
  try {
    // Get current user with their friends
    const currentUser = await User.findById(req.user.userId)
      .populate({
        path: "friends",
        select: "username _id friends",
      })
      .lean();

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all potential friends with their friends populated
    const userFriendIds = currentUser.friends.map((f) => f._id.toString());
    const potentialFriends = await User.find({
      _id: { $nin: [...userFriendIds, currentUser._id] },
    })
      .populate({
        path: "friends",
        select: "username _id",
      })
      .lean();

    // Calculate recommendations with mutual friends
    const recommendations = await Promise.all(
      potentialFriends.map(async (potentialFriend) => {
        // Get mutual friends
        const mutualFriends = await User.find({
          _id: {
            $in: currentUser.friends.map((f) => f._id),
            $in: potentialFriend.friends.map((f) => f._id),
          },
        })
          .select("username _id")
          .lean();

        return {
          _id: potentialFriend._id,
          username: potentialFriend.username,
          email: potentialFriend.email,
          interests: potentialFriend.interests || [],
          mutualFriends: mutualFriends.length,
          mutualFriendsDetails: mutualFriends,
          score: mutualFriends.length,
        };
      })
    );

    // Sort by mutual friends count
    const sortedRecommendations = recommendations
      .sort((a, b) => b.mutualFriends - a.mutualFriends)
      .slice(0, 10);

    console.log(
      "Recommendations with mutual friends:",
      sortedRecommendations.map((r) => ({
        username: r.username,
        mutualCount: r.mutualFriends,
        mutuals: r.mutualFriendsDetails.map((m) => m.username),
      }))
    );

    res.json(sortedRecommendations);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ message: "Error generating recommendations" });
  }
});

// Get mutual friends between two users
router.get("/mutual/:userId", auth, async (req, res) => {
  try {
    const [user, otherUser] = await Promise.all([
      User.findById(req.user.userId).populate("friends"),
      User.findById(req.params.userId).populate("friends"),
    ]);

    if (!user || !otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find mutual friends
    const mutualFriends = user.friends.filter((friend) =>
      otherUser.friends.some(
        (otherFriend) => otherFriend._id.toString() === friend._id.toString()
      )
    );

    res.json({
      mutualFriends: mutualFriends.map((friend) => ({
        _id: friend._id,
        username: friend.username,
      })),
      count: mutualFriends.length,
    });
  } catch (error) {
    console.error("Error finding mutual friends:", error);
    res.status(500).json({ message: "Error finding mutual friends" });
  }
});

module.exports = router;
