import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import InterestsSelector from "../components/InterestsSelector";
import LoadingSpinner from "../components/LoadingSpinner";

const Profile = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInterestsDialogOpen, setIsInterestsDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/users/profile", {
        headers: { "x-auth-token": user },
      });
      setInterests(response.data.interests || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInterests = async (newInterests) => {
    try {
      await axios.put(
        "/api/interests",
        { interests: newInterests },
        {
          headers: { "x-auth-token": user },
        }
      );
      setInterests(newInterests);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating interests");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Your Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">Interests</Typography>
            <Button
              variant="outlined"
              onClick={() => setIsInterestsDialogOpen(true)}
            >
              Edit Interests
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {interests.map((interest) => (
              <Chip key={interest} label={interest} />
            ))}
          </Stack>
        </Box>

        <InterestsSelector
          open={isInterestsDialogOpen}
          onClose={() => setIsInterestsDialogOpen(false)}
          currentInterests={interests}
          onSave={handleSaveInterests}
        />
      </Paper>
    </Container>
  );
};

export default Profile;
