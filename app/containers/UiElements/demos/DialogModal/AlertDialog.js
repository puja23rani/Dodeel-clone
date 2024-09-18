import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";

export default function AlertDialog({ open, onClose, onDelete }) {
  function handleAgree() {
    onDelete(); // Call the delete function passed from parent
    onClose(); // Close the dialog
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Disagree
        </Button>
        <Button onClick={handleAgree} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AlertDialog.propTypes = {
  open: PropTypes.bool.isRequired, // Control the dialog visibility
  onClose: PropTypes.func.isRequired, // Function to close the dialog
  onDelete: PropTypes.func.isRequired, // The delete function passed from parent
};
