import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Avatar,
  Chip,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";

const UserCard = ({
  user,
  onAction,
  actionText,
  actionColor = "primary",
  mutualFriends,
  mutualFriendsDetails,
  commonInterests = [],
}) => {
  console.log("UserCard received:", {
    username: user.username,
    mutualCount: mutualFriends,
    mutualDetails: mutualFriendsDetails,
  });

  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent>
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <Avatar>
            <PersonIcon />
          </Avatar>
          <Stack flex={1}>
            <Typography variant="subtitle1">{user.username}</Typography>
            {mutualFriends > 0 && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5}
                sx={{ mt: 0.5 }}
              >
                <PeopleIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {mutualFriends} mutual friend{mutualFriends !== 1 ? "s" : ""}
                </Typography>
              </Stack>
            )}
            {mutualFriendsDetails?.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Mutual Friends:
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 0.5 }}
                  flexWrap="wrap"
                >
                  {mutualFriendsDetails.map((friend) => (
                    <Chip
                      key={friend._id}
                      label={friend.username}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Stack>
              </Box>
            )}
            {commonInterests.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Common Interests:
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 0.5 }}
                  flexWrap="wrap"
                >
                  {commonInterests.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
          <Button
            variant="contained"
            color={actionColor}
            size="small"
            onClick={() => onAction(user._id)}
          >
            {actionText}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserCard;
