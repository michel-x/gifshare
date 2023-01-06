import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "'Lato', sans-serif",
  },
  palette: {
    primary: {
      main: "#1e293b",
    },
    secondary: {
      main: "#EF6C00",
      dark: "#A95006",
      light: "#FF9D4B",
    },
    error: {
      main: "#F44336",
      dark: "#E31B0C",
      light: "#F88078",
    },
    warning: {
      main: "#ED6C02",
      dark: "#C77700",
      light: "#FFB547",
    },
    info: {
      main: "#2196F3",
      dark: "#0B79D0",
      light: "#64B6F7",
    },
    success: {
      main: "#4CAF50",
      dark: "#3B873E",
      light: "#7BC67E",
    },
    text: {
      primary: "#2F3349",
      secondary: "#7A7E98",
      disabled: "#85889B",
    },
    action: {
      active: "rgba(0, 0, 0, 0.54)",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTextField: {
      defaultProps: {
        sx: {
          "& .MuiOutlinedInput-root:hover": {
            "& > fieldset": {},
          },
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "textPrimary",
      },
    },
  },
});

export default theme;
