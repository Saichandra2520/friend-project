import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Box,
  Tab,
  Tabs,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import UserCard from "../components/UserCard";
import FriendRequest from "../components/FriendRequest";

const Home = () => {
  const [value, setValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // Define fetchFriendRequests first
  const fetchFriendRequests = useCallback(async () => {
    try {
      const response = await axios.get("/api/friends/requests", {
        headers: { "x-auth-token": user },
      });
      console.log("Refreshed friend requests:", response.data);
      setFriendRequests(response.data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  }, [user]);

  // Then define fetchData
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, friendsRes, recommendationsRes, requestsRes] =
        await Promise.all([
          axios.get("/api/users", {
            headers: { "x-auth-token": user },
          }),
          axios.get("/api/friends", {
            headers: { "x-auth-token": user },
          }),
          axios.get("/api/recommendations", {
            headers: { "x-auth-token": user },
          }),
          axios.get("/api/friends/requests", {
            headers: { "x-auth-token": user },
          }),
        ]);

      console.log("Friend requests response:", requestsRes.data);
      setUsers(usersRes.data);
      setFriends(friendsRes.data);
      setRecommendations(recommendationsRes.data);
      setFriendRequests(requestsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Periodic refresh for friend requests
  useEffect(() => {
    fetchData();

    const refreshInterval = setInterval(() => {
      if (value === 1) {
        fetchFriendRequests();
      }
    }, 5000);

    return () => clearInterval(refreshInterval);
  }, [value, fetchData, fetchFriendRequests]);

  // Calculate common interests between current user and another user
  const getCommonInterests = (userInterests = [], otherUserInterests = []) => {
    return userInterests.filter((interest) =>
      otherUserInterests.includes(interest)
    );
  };

  // Render recommendation section with enhanced UI
  const renderRecommendations = () => {
    console.log("Raw recommendations:", recommendations);

    if (recommendations.length === 0) {
      return (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No recommendations available at the moment.
        </Typography>
      );
    }

    return recommendations.map((recommendation) => {
      console.log("Processing recommendation:", {
        username: recommendation.username,
        mutualCount: recommendation.mutualFriends,
        mutualDetails: recommendation.mutualFriendsDetails,
      });

      return (
        <UserCard
          key={recommendation._id}
          user={recommendation}
          onAction={handleFriendRequest}
          actionText="Add Friend"
          mutualFriends={recommendation.mutualFriends}
          mutualFriendsDetails={recommendation.mutualFriendsDetails}
          commonInterests={getCommonInterests(
            user?.interests || [],
            recommendation.interests || []
          )}
        />
      );
    });
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  // Handle friend request
  const handleFriendRequest = async (userId) => {
    try {
      await axios.post(
        `/api/friends/request/${userId}`,
        {},
        {
          headers: { "x-auth-token": user },
        }
      );
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || "Error sending friend request");
    }
  };

  // Handle accept friend request
  const handleAcceptRequest = async (userId) => {
    try {
      await axios.put(
        `/api/friends/accept/${userId}`,
        {},
        {
          headers: { "x-auth-token": user },
        }
      );
      setFriendRequests(
        friendRequests.filter((req) => req.from._id !== userId)
      );
      // Refresh friends list
      const friendsRes = await axios.get("/api/friends", {
        headers: { "x-auth-token": user },
      });
      setFriends(friendsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error accepting friend request");
    }
  };

  // Handle reject friend request
  const handleRejectRequest = async (userId) => {
    try {
      await axios.put(
        `/api/friends/reject/${userId}`,
        {},
        {
          headers: { "x-auth-token": user },
        }
      );
      setFriendRequests(
        friendRequests.filter((req) => req.from._id !== userId)
      );
    } catch (err) {
      setError(err.response?.data?.message || "Error rejecting friend request");
    }
  };

  // Handle unfriend
  const handleUnfriend = async (userId) => {
    try {
      await axios.delete(`/api/friends/${userId}`, {
        headers: { "x-auth-token": user },
      });
      setFriends(friends.filter((f) => f._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || "Error removing friend");
    }
  };

  // Handle search
  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/users/search?q=${searchTerm}`, {
        headers: { "x-auth-token": user },
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error searching users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Search Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Search Users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          <Paper sx={{ width: "100%" }}>
            <Tabs value={value} onChange={handleTabChange} centered>
              <Tab label="Discover" />
              <Tab
                label={`Friend Requests (${friendRequests.length})`}
                sx={{
                  color: friendRequests.length > 0 ? "primary.main" : "inherit",
                  fontWeight: friendRequests.length > 0 ? "bold" : "normal",
                }}
              />
              <Tab label={`Friends (${friends.length})`} />
              <Tab
                label="Recommendations"
                sx={{
                  color:
                    recommendations.length > 0 ? "primary.main" : "inherit",
                }}
              />
            </Tabs>

            <Box sx={{ p: 2 }}>
              {value === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Discover New People
                  </Typography>
                  {users.map((user) => (
                    <UserCard
                      key={user._id}
                      user={user}
                      onAction={handleFriendRequest}
                      actionText="Add Friend"
                      commonInterests={getCommonInterests(
                        friends[0]?.interests || [],
                        user.interests || []
                      )}
                    />
                  ))}
                </Box>
              )}

              {value === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Friend Requests
                  </Typography>
                  {friendRequests.length === 0 ? (
                    <Typography variant="body1" color="text.secondary">
                      No pending friend requests.
                    </Typography>
                  ) : (
                    friendRequests.map((request) => (
                      <FriendRequest
                        key={request._id}
                        request={request}
                        onAccept={handleAcceptRequest}
                        onReject={handleRejectRequest}
                      />
                    ))
                  )}
                </Box>
              )}

              {value === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Your Friends
                  </Typography>
                  {friends.length === 0 ? (
                    <Typography variant="body1" color="text.secondary">
                      You haven't added any friends yet.
                    </Typography>
                  ) : (
                    friends.map((friend) => (
                      <UserCard
                        key={friend._id}
                        user={friend}
                        onAction={handleUnfriend}
                        actionText="Unfriend"
                        actionColor="error"
                      />
                    ))
                  )}
                </Box>
              )}

              {value === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Recommended Friends
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Based on mutual friends and common interests
                  </Typography>
                  {renderRecommendations()}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setError("")} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Home;
