import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import AlertDialog from "../../../UiElements/demos/DialogModal/AlertDialog";
import TablePlayground from "../../../Tables/TablePlayground";
import Popup from "../../../../components/Popup/Popup";

const useStyles = makeStyles()((theme) => ({
  root: {
    flexGrow: 1,
    padding: 30,
  },
  form: {
    "& > div": {
      marginBottom: theme.spacing(2),
    },
  },
  field: {
    width: "100%",
    marginBottom: 20,
  },
  buttonInit: {
    margin: theme.spacing(4),
  },
}));

function ContactDetails() {
  const { classes } = useStyles();

  const [state, setState] = React.useState({
    id: "",
    companyName: "",
    contactNumber: "",
    emailAddress: "",
    address: "",
    isUpdate: false,
  });

  const [errors, setErrors] = useState({
    companyName: "",
    contactNumber: "",
    emailAddress: "",
    address: "",
  });

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (state.companyName == "") {
      errors.companyName = "Company Name is required";
      isValid = false;
    }

    if (state.contactNumber == "") {
      errors.contactNumber = "Contact Number is required";
      isValid = false;
    }

    if (state.emailAddress == "") {
      errors.emailAddress = "Email Address is required";
      isValid = false;
    }

    if (state.address == "") {
      errors.address = "Address Name is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const [rowdata, setRowdata] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const columnData = [
    {
      id: "slNo",
      numeric: true,
      disablePadding: false,
      label: "Sl No",
    },
    {
      id: "companyName",
      numeric: false,
      disablePadding: false,
      label: "Company Name",
    },
    {
      id: "contactNumber",
      numeric: false,
      disablePadding: false,
      label: "Contact Number",
    },
    {
      id: "emailAddress",
      numeric: false,
      disablePadding: false,
      label: "Email Address",
    },
    {
      id: "address",
      numeric: false,
      disablePadding: false,
      label: "Address",
    },
    { id: "actions", label: "Action" },
  ];

  const getContactDetails = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }

      const requestOptions = {
        method: "GET",
        headers: loginHeaders,
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getContactDetails`,
        requestOptions
      );
      const actualData = await res.json();
      // console.log(actualData);

      if (actualData.status === 200) {
        if (actualData.contactDetails.length > 0) {
          setRowdata(
            actualData.contactDetails.map((item) => ({
              slNo: actualData.contactDetails.indexOf(item) + 1,
              id: item._id,
              companyName: item.companyName,
              contactNumber: item.contactNumber,
              emailAddress: item.emailAddress,
              address: item.address,
              actions: (
                <>
                  <IconButton
                    aria-label="Edit"
                    onClick={(e) => {
                      // console.log(item);
                      setState({
                        id: item._id,
                        companyName: item.companyName,
                        contactNumber: item.contactNumber,
                        emailAddress: item.emailAddress,
                        address: item.address,
                        isUpdate: true,
                      });
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon color={"primary"} />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    onClick={(e) => {
                      setDeleteDialogOpen(true);
                      setIdToDelete(item._id);
                    }}
                  >
                    <DeleteIcon color={"primary"} />
                  </IconButton>
                </>
              ),
            }))
          );
        }
      }
    } catch (err) {
      console.log(err);
      setMessage("Something went wrong!");
      setOpen(true);
      setSeverity("error");
    }
  }

  useEffect(() => {
    getContactDetails();
  }, []);

  const handleCreateContact = async () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      } else {
        // Handle case where token is not available
        return;
      }
      const data = {
        companyName: state.companyName,
        contactNumber: state.contactNumber,
        emailAddress: state.emailAddress,
        address: state.address,
      };
      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createContactDetail`,
        requestOptions
      );
      const actualData = await res.json();

      console.log(actualData);
      if (actualData.status === 200) {
        setState({
          id: "",
          companyName: "",
          contactNumber: "",
          emailAddress: "",
          address: "",
          isUpdate: false,
        });
        setOpenDialog(false);
        setMessage("Created Sucessfully!");
        setOpen(true);
        setSeverity("success");
        getContactDetails();
        window.scrollTo({
          top: 400,
          behavior: "smooth",
        });
      } else {
        setOpenDialog(false);
        setMessage(actualData.message);
        setOpen(true);
        setSeverity("error");
      }
    } catch (err) {
      console.log(err);
      setOpenDialog(false);
      setMessage("Something went wrong!");
      setOpen(true);
      setSeverity("error");
    }
  };

  const handleUpdateContact = async () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }

      const data = {
        id: state.id,
        companyName: state.companyName,
        contactNumber: state.contactNumber,
        emailAddress: state.emailAddress,
        address: state.address,
      };

      const requestOptions = {
        method: "PUT",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updateContactDetail`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setState({
          id: "",
          companyName: "",
          contactNumber: "",
          emailAddress: "",
          address: "",
          isUpdate: false,
        });
        setOpenDialog(false);
        setMessage("Updated successfully!");
        setOpen(true);
        setSeverity("success");
        getContactDetails();
        window.scrollTo({
          top: 400,
          behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
        });
      }
    } catch (err) {
      console.log(err);
      setOpenDialog(false);
      setMessage("Something went wrong!");
      setOpen(true);
      setSeverity("error");
    }
  };

  const handleDeleteContact = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }
      const data = { id: idToDelete };
      const requestOptions = {
        method: "DELETE",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteContactDetail`,
        requestOptions
      );
      const actualData = await res.json();
      console.log(actualData);
      if (actualData.status === 200) {
        setDeleteDialogOpen(false);
        setIdToDelete(null);
        setMessage("Deleted successfully!");
        setOpen(true);
        setSeverity("success");
        getContactDetails();
      }
    } catch (err) {
      console.log(err);
      setDeleteDialogOpen(false);
      setIdToDelete(null);
      setMessage("Something went wrong!");
      setOpen(true);
      setSeverity("error");
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setState({
      id: "",
      companyName: "",
      contactNumber: "",
      isUpdate: false,
    })
    setOpenDialog(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage); // Update the current page
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update the rows per page
    setPage(0); // Reset to first page
  };

  return (
    <>
      <div>
        <Toolbar className={classes.toolbar}>
          <div className={classes.spacer} style={{ flexGrow: 1 }} />
          <div className={classes.actions}>
            <Tooltip title="Add Item">
              <Button
                variant="contained"
                onClick={() => setOpenDialog(true)}
                color="primary"
                className={classes.button}
              >
                <AddIcon /> Add Contact Details
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Contact Details
          </DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent className={classes.dialogContent}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  sx={{
                    marginBottom: 2,
                  }}
                  variant="standard"
                  id="companyName"
                  name="companyName"
                  label="Company Name (e.g. XYZ, Inc.)"
                  value={state.companyName}
                  onChange={(e) => {
                    const value = e.target.value;
                    const maxValue = 50
                    if (value.length <= maxValue) {
                      setState({ ...state, companyName: e.target.value });
                    }
                  }}
                  error={!!errors.companyName} // Show error if it exists
                  helperText={errors.companyName} // Display error message
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  sx={{
                    marginBottom: 2,
                  }}
                  variant="standard"
                  id="contactNumber"
                  name="contactNumber"
                  label="Contact Number (e.g. +123-456-7890 or 987 654 3210)"
                  value={state.contactNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Updated regex to allow numbers, '+', space, and '-'
                    const regex = /^[0-9+\s-]*$/;
                    const maxValue = 15;
                    if (regex.test(value) && value.length <= maxValue) {
                      setState({ ...state, contactNumber: value });
                    }
                  }}
                  error={!!errors.contactNumber} // Show error if it exists
                  helperText={errors.contactNumber} // Display error message
                />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "-20px" }}>
                <TextField
                  fullWidth
                  sx={{
                    marginBottom: 2,
                  }}
                  variant="standard"
                  id="emailAddress"
                  name="emailAddress"
                  label="Email Address (e.g. xyz@example.com)"
                  type="email"
                  value={state.emailAddress}
                  onChange={(e) => {
                    const value = e.target.value;
                    setState({ ...state, emailAddress: value });
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    // Updated email validation regex to check for valid domain and TLD
                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                    if (!regex.test(value)) {
                      setErrors({ ...errors, emailAddress: 'Invalid email address format' });
                    } else {
                      setErrors({ ...errors, emailAddress: '' });
                    }
                  }}
                  error={!!errors.emailAddress}
                  helperText={errors.emailAddress}
                />

              </Grid>
              <Grid item xs={12} sx={{ marginTop: "-20px" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="standard"
                  id="address"
                  name="address"
                  label="Address (e.g. 123 Main St, Anytown, USA)"
                  value={state.address}
                  onChange={(e) => {
                    const value = e.target.value;
                    const maxValue = 500
                    if (value.length <= maxValue) {
                      setState({ ...state, address: value });
                    }
                  }}
                  sx={{
                    marginBottom: 2,
                  }}
                  error={!!errors.address} // Show error if it exists
                  helperText={errors.address} // Display error message
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Close
            </Button>
            {state.isUpdate ? (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleUpdateContact}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateContact}
                >
                  Create
                </Button>
              </>
            )}

          </DialogActions>
        </Dialog>
      </div>

      {rowdata && (
        <TablePlayground
          title="Contact Details List"
          columnData={columnData}
          rowData={rowdata}
          component="div"
          count={rowdata.length} // Total number of rows
          rowsPerPage={rowsPerPage} // Number of rows per page
          page={page} // Current page
          onPageChange={handlePageChange} // Handle page change
          onRowsPerPageChange={handleRowsPerPageChange} // Handle rows per page change
        />
      )}

      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDeleteContact}
      />
      <Popup
        open={open}
        message={message}
        onClose={handleClose}
        severity={severity} // You can change this to "error", "warning", etc.
      />
    </>
  );
}

export default ContactDetails;
