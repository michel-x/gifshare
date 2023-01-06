import React, { useState, useCallback, ReactElement } from "react";
import { AlertColor } from "@mui/material";
import Snackbar from "../components/Snackbar";

type Context = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  type: AlertColor;
  setType: React.Dispatch<React.SetStateAction<AlertColor>>;
};

type Props = {
  children: ReactElement;
};

export const SnackbarContext = React.createContext<Context | null>(null);

export const SnackbarProvider: React.FC<Props> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<AlertColor>("info");

  const handleCloseSnackbar = useCallback(
    (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    },
    []
  );

  return (
    <SnackbarContext.Provider value={{ open, setOpen, message, setMessage, type, setType }}>
      {children}
      <Snackbar
        open={open}
        message={message}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        direction="up"
        severity={type}
      />
    </SnackbarContext.Provider>
  );
};
