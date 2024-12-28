import { createTheme } from "@mui/material";
import { fontFaces } from "./fonts";

export const theme = createTheme({
  typography: {
    fontFamily: "Matrix, Arial, sans-serif",
  },
  palette: {
    primary: {
      main: "#29304D",
      light: "#4C5F87",
      dark: "#1b1b1b",
    },
    secondary: {
      main: "#503C35",
      light: "#765793",
      dark: "#354457",
    },
    background: {
      default: "#2C2F33",
      paper: "#383B40",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B9BBBE",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        ${fontFaces}
        body {
          backgroundColor: '#2C2F33';
          minHeight: '100vh';
        }
      `,
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "linear-gradient(to right, #29304D, #4C5F87)",
        },
      },
    },
  },
});
