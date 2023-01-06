import React from "react";
import { Box } from "@mui/material";

interface Props {}

const NotFound: React.FC<Props> = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 24,
        color: "red",
      }}
    >
      <p>Oups! Page not Found </p>
    </Box>
  );
};

export default NotFound;
