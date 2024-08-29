import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
      // Dark mode colors
      grey: {
        100: "#E0E0E0",
        200: "#c2c2c2",
        300: "#a3a3a3",
        400: "#858585",
        500: "#666666",
        600: "#525252",
        700: "#3d3d3d",
        800: "#292929",
        900: "#141414",
      },
      primary: {
        100: "#333333",
        200: "#272727",
        300: "#1F1F1F",
        400: "#171717",
        500: "#E0E0E0",
        600: "#0C0C0C",
        700: "#090909",
        800: "#060606",
        900: "#030303",
      },
      greenAccent: {
        100: "#76C8AE",
        200: "#5DBFA1",
        300: "#44B593",
        400: "#2EBB98",
        500: "#1CAF87",
        600: "#189876",
        700: "#147865",
        800: "#105854",
        900: "#0C3843",
      },
      redAccent: {
        100: "#FFDAD5",
        200: "#FFC5B9",
        300: "#FFAF9D",
        400: "#FF9981",
        500: "#FF8365",
        600: "#E76B55",
        700: "#CF5345",
        800: "#B73B35",
        900: "#9F2325",
      },
      blueAccent: {
        100: "#9DAFE6",
        200: "#889DDB",
        300: "#737BDF",
        400: "#5E59E3",
        500: "#4937E7",
        600: "#3929C7",
        700: "#291BA7",
        800: "#190D87",
        900: "#090067",
      },
    }
    : {
      // Light mode colors with a white background and dark text
      grey: {
        100: "#FFFFFF",
        200: "#F5F5F5",
        300: "#EBEBEB",
        400: "#E1E1E1",
        500: "#D7D7D7",
        600: "#CDCDCD",
        700: "#C3C3C3",
        800: "#B9B9B9",
        900: "#AFAFAF",
      },
      primary: {
        100: "#FFFFFF",  // White for main UI elements
        200: "#F5F5F5",
        300: "#EBEBEB",
        400: "#E1E1E1",
        500: "#333333",  // Dark gray (nearly black) for primary text and icons
        600: "#292929",
        700: "#1F1F1F",
        800: "#171717",
        900: "#0F0F0F",
      },
      greenAccent: {
        100: "#E8F5E9",
        200: "#D9F2E3",
        300: "#C6EBD5",
        400: "#B3E4C7",
        500: "#66BB6A",
        600: "#4CAF50",
        700: "#43A047",
        800: "#388E3C",
        900: "#2E7D32",
      },
      redAccent: {
        100: "#FFEBEE",
        200: "#FFCDD2",
        300: "#EF9A9A",
        400: "#E57373",
        500: "#EF5350",
        600: "#F44336",
        700: "#E53935",
        800: "#D32F2F",
        900: "#C62828",
      },
      blueAccent: {
        100: "#DAEFFF",
        200: "#B6DFFF",
        300: "#92CFFF",
        400: "#6EBFFF",
        500: "#42A5F5",
        600: "#2196F3",
        700: "#1E88E5",
        800: "#1976D2",
        900: "#1565C0",
      },
    }),
});

// mui theme settings using the provided tokens
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary[500],
        contrastText: colors.grey[100],
      },
      secondary: {
        main: colors.greenAccent[500],
        contrastText: colors.grey[100],
      },
      error: {
        main: colors.redAccent[500],
      },
      background: {
        default: colors.primary[100],
      },
      text: {
        primary: colors.primary[500],
        secondary: colors.grey[600],
      },
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontSize: 40,
      },
      h2: {
        fontSize: 32,
      },
      h3: {
        fontSize: 24,
      },
      h4: {
        fontSize: 20,
      },
      h5: {
        fontSize: 16,
      },
      h6: {
        fontSize: 14,
      },
    },
  });
};

// Context for managing color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => { },
});

// Custom hook for using color mode
export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode((prevMode) => (prevMode === "light" ? "dark" : "light")),
  }), []);

  const theme = useMemo(() => themeSettings(mode), [mode]);

  return [theme, colorMode];
};
