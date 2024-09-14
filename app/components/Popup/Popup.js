import React from "react";
import { Snackbar, Alert } from "@mui/material";

const Popup = ({
  open,
  message,
  onClose,
  severity = "success",
  autoHideDuration = 6000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at top-center
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Popup;
