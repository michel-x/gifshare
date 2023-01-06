import React from "react";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";


const Spinner: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Spinner;
