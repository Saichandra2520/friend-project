import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00838f", // Teal
      light: "#4fb3bf",
      dark: "#005662",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff6b6b", // Coral
      light: "#ff9d9d",
      dark: "#c73e3e",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f7f9fc",
      paper: "#ffffff",
    },
    text: {
      primary: "#2d3436",
      secondary: "#636e72",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h5: {
      fontWeight: 700,
      letterSpacing: -0.5,
    },
    h6: {
      fontWeight: 600,
      letterSpacing: -0.3,
    },
    button: {
      fontWeight: 600,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #00838f 30%, #4fb3bf 90%)",
          "&:hover": {
            background: "linear-gradient(45deg, #005662 30%, #00838f 90%)",
          },
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #ff6b6b 30%, #ff9d9d 90%)",
          "&:hover": {
            background: "linear-gradient(45deg, #c73e3e 30%, #ff6b6b 90%)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          "&.MuiChip-outlined": {
            borderWidth: 1.5,
          },
        },
        label: {
          padding: "0 12px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(45deg, #00838f 30%, #4fb3bf 90%)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            },
            "&.Mui-focused": {
              boxShadow: "0 4px 12px rgba(0,131,143,0.12)",
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: "0 16px 16px 0",
          boxShadow: "4px 0 12px rgba(0,0,0,0.04)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(45deg, #00838f 30%, #4fb3bf 90%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          "&:hover": {
            backgroundColor: "rgba(0,131,143,0.08)",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        standardSuccess: {
          backgroundColor: "#e3fcef",
          color: "#00875a",
        },
        standardError: {
          backgroundColor: "#ffe9e9",
          color: "#c73e3e",
        },
        standardWarning: {
          backgroundColor: "#fff4e5",
          color: "#b76e00",
        },
        standardInfo: {
          backgroundColor: "#e8f4fd",
          color: "#0065bd",
        },
      },
    },
  },
});

export default theme;
