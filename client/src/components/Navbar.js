import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login");
  };

  const menuItems = user ? (
    <List>
      <ListItem button onClick={() => navigate("/")}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button onClick={() => navigate("/profile")}>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItem>
      <ListItem button onClick={handleLogout}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  ) : (
    <List>
      <ListItem button onClick={() => navigate("/login")}>
        <ListItemText primary="Login" />
      </ListItem>
      <ListItem button onClick={() => navigate("/register")}>
        <ListItemText primary="Register" />
      </ListItem>
    </List>
  );

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          {isMobile && user && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/")}
          >
            Friend Connect
          </Typography>
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {!isMobile && <NotificationBell />}
              {!isMobile && (
                <IconButton
                  size="large"
                  aria-label="account"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              )}
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/profile");
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            !isMobile && (
              <Box>
                <Button
                  color="inherit"
                  onClick={() => navigate("/login")}
                  sx={{ mr: 1 }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </Box>
            )
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box sx={{ width: 240 }} role="presentation">
          {menuItems}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
