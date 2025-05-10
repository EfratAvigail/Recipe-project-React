import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#e57373",
      light: "#ffa4a2",
      dark: "#af4448",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#66bb6a",
      light: "#98ee99",
      dark: "#338a3e",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: ["Rubik", "Assistant", "Arial", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          overflow: "hidden",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
})
