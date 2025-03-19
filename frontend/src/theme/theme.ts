import { createTheme } from "@mui/material";
import { fontFaces } from "./fonts";

export const theme = createTheme({
  typography: {
    fontFamily: "Matrix, Arial, sans-serif",
    h1: {
      background: "linear-gradient(90deg, #FFD700, #2C3E7B)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
      textShadow: "0 0 20px rgba(44, 62, 123, 0.2)",
    },
    h2: {
      background: "linear-gradient(90deg, #FFD700, #2C3E7B)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
      textShadow: "0 0 20px rgba(44, 62, 123, 0.2)",
    },
    h3: {
      background: "linear-gradient(90deg, #FFD700, #2C3E7B)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
      textShadow: "0 0 20px rgba(44, 62, 123, 0.2)",
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#4A5D9B",
      light: "#6B7DB8",
      dark: "#2C3E7B",
    },
    secondary: {
      main: "#FFD700", // Millennium item gold
      light: "#FFE44D",
      dark: "#B39700",
    },
    background: {
      default: "#151B2E", // Darker blue
      paper: "#1D2438", // Slightly lighter blue
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    error: {
      main: "#FF4444",
    },
    warning: {
      main: "#FFD700",
    },
    info: {
      main: "#4A5D9B",
    },
    success: {
      main: "#00C851",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        ${fontFaces}
        body {
          background: linear-gradient(135deg, #151B2E 0%, #1D2438 100%);
         
        }
      `,
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #151B2E, #2C3E7B)",
          borderBottom: "1px solid rgba(255, 215, 0, 0.1)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(29, 36, 56, 0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: "8px",
          border: "1px solid rgba(255, 215, 0, 0.1)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            border: "1px solid rgba(255, 215, 0, 0.2)",
            boxShadow: "0 8px 32px rgba(255, 215, 0, 0.1)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          textTransform: "none",
          transition: "all 0.3s ease-in-out",
        },
        contained: {
          background: "linear-gradient(135deg, #2C3E7B 0%, #1A2552 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #4A5D9B 0%, #2C3E7B 100%)",
          },
        },
        outlined: {
          borderColor: "#2C3E7B",
          "&:hover": {
            borderColor: "#4A5D9B",
            background: "rgba(44, 62, 123, 0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "rgba(29, 36, 56, 0.8)",
          backdropFilter: "blur(10px)",
        },
      },
    },
  },
});
