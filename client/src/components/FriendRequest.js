import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const FriendRequest = ({ request, onAccept, onReject }) => {
  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar>
            <PersonIcon />
          </Avatar>
          <Stack flex={1}>
            <Typography variant="subtitle1">{request.from.username}</Typography>
            <Typography variant="caption" color="text.secondary">
              Sent {new Date(request.createdAt).toLocaleDateString()}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => onAccept(request.from._id)}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onReject(request.from._id)}
            >
              Reject
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FriendRequest;
