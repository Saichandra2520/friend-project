import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const InterestsSelector = ({
  open,
  onClose,
  currentInterests = [],
  onSave,
}) => {
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState(currentInterests);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axios.get("/api/interests");
        setInterests(response.data);
      } catch (err) {
        setError("Failed to load interests");
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  const handleToggle = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    onSave(selectedInterests);
    onClose();
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select Your Interests</DialogTitle>
      <DialogContent>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {interests.map((interest) => (
              <Chip
                key={interest}
                label={interest}
                onClick={() => handleToggle(interest)}
                color={
                  selectedInterests.includes(interest) ? "primary" : "default"
                }
                clickable
              />
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InterestsSelector;
