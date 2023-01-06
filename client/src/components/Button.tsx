import React, { ReactNode } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import MuiButton, { ButtonProps } from "@mui/material/Button";

type Props = ButtonProps & {
  type?: "submit" | "button" | "reset";
  loading?: boolean;
  children?: ReactNode;
};

const Button: React.FC<Props> = ({ type, loading, disabled, children, variant, color, ...otherProps }) => {
  return (
    <MuiButton
      {...otherProps}
      variant={variant || "contained"}
      type={type || "submit" }
      color={color || "primary"}
      className={`relative flex justify-center py-2 px-8 bg-slate-800 text-white rounded-md text-lg`}
      sx={{...otherProps.sx, textTransform: "none", pointerEvents: loading || disabled ? "none" : "auto" }}
    >
      <span style={{ opacity: loading ? 0 : 1 }}>
        {children}
      </span>
      {loading &&
        <Box
          sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <CircularProgress size={25} sx={{ color: !color ? "white" : "" }} color={color} />
        </Box>
      }
    </MuiButton>
  );
};

export default Button;
