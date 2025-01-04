import React, { useState } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNotifications } from "../context/NotificationsContext";
import { formatDistanceToNow } from "date-fns";

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, markAsRead, clearAllNotifications } =
    useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    handleClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: 360,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
          {notifications.length > 0 && (
            <Typography
              variant="caption"
              sx={{ cursor: "pointer", color: "primary.main" }}
              onClick={clearAllNotifications}
            >
              Clear all
            </Typography>
          )}
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography variant="body2">No notifications</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                backgroundColor: notification.read ? "inherit" : "action.hover",
                display: "block",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </Typography>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
