import React from "react";
import { default as MuiSnackbar } from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import Alert from "@mui/material/Alert";
import { SnackbarCloseReason, SnackbarOrigin, AlertColor } from "@mui/material";

type Props = {
  open: boolean;
  message: string;
  onClose: (
    event: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => void;
  autoHideDuration?: number;
  anchorOrigin?: SnackbarOrigin;
  direction?: "up" | "down" | "right" | "left";
  severity?: AlertColor;
};

const Snackbar: React.FC<Props> = (props) => {
  if (!props.open) return null;
  return (
    <MuiSnackbar
      open={props.open}
      onClose={props.onClose}
      autoHideDuration={props.autoHideDuration || 6000}
      anchorOrigin={props.anchorOrigin}
      TransitionComponent={(propsTransition: any) => (
        <Slide {...propsTransition} direction={props?.direction || "left"} />
      )}
    >
      <Alert 
        //@ts-ignore
        onClose={props.onClose} 
        severity={props.severity || "success"}
        variant="filled" 
        elevation={2}
        sx={{ width: '100%', color: 'white' }}
      >
        {props.message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
