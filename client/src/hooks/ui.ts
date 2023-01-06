import { useContext } from "react";
import { AlertColor } from "@mui/material";
import { SnackbarContext } from "../contexts/SnackbarContext";

type SnackbarOptions = {
  message: string;
  type?: AlertColor
};

export function useSnackbar() {
  const { setMessage, setOpen, setType } = useContext(SnackbarContext)!;

  return {
    show(options: SnackbarOptions) {
      setMessage(options.message);
      setType(options?.type || "success")
      setOpen(true);
    },
    close() {
      setOpen(false);
    }
  };
}
