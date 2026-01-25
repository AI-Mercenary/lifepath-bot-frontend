import { createTheme } from "@mui/material/styles";
import { ThemeConfig, theme as antTheme } from "antd";

// Color Palette - Blue + Green Educational Theme
export const appColors = {
  primary: "#3b82f6", // Vibrant Blue
  secondary: "#10b981", // Emerald Green
  accent: "#f59e0b", // Amber
  backgroundLight: "#f8fafc", // Slate-50
  backgroundDark: "#020817", // Rich Dark Blue/Slate
};

// MUI Theme Generator
export const getMuiTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: appColors.primary,
      },
      secondary: {
        main: appColors.secondary,
      },
      background: {
        default:
          mode === "light"
            ? appColors.backgroundLight
            : appColors.backgroundDark,
        paper: mode === "light" ? "#ffffff" : "#0f172a",
      },
    },
    typography: {
      fontFamily: "inherit",
      button: {
        textTransform: "none", // Modern feel
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow:
              mode === "light"
                ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
                : "0 4px 6px -1px rgb(0 0 0 / 0.5)",
          },
        },
      },
    },
  });

// Ant Design Theme Generator
export const getAntdTheme = (mode: "light" | "dark"): ThemeConfig => ({
  token: {
    colorPrimary: appColors.primary,
    colorInfo: appColors.primary,
    colorSuccess: appColors.secondary,
    colorWarning: appColors.accent,
    borderRadius: 8,
    wireframe: false,
  },
  algorithm:
    mode === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
});
