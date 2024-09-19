import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import Popup from "../../../components/Popup/Popup";
import AlertDialog from "../../UiElements/demos/DialogModal/AlertDialog";
import TablePlayground from "../../Tables/TablePlayground";
import { address } from "ip";

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

function Supplier() {
  const { classes } = useStyles();

  const [state, setState] = useState({
    id: "",
    supplierName: "",
    vendorCode: "",
    contactNumber: "",
    contactPerson: "",
    email: "",
    taxRegdNumber: "",
    self: "",
    address: "",
    isUpdate: false,
  });

  const [errors, setErrors] = useState({
    supplierName: "",
    vendorCode: "",
    contactNumber: "",
    contactPerson: "",
    email: "",
    taxRegdNumber: "",
    self: "",
    address: "",
  });

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.supplierName.trim()) {
      errors.supplierName = "Supplier Name is required";
      isValid = false;
    }
    if (!state.vendorCode.trim()) {
      errors.vendorCode = "Vendor code is required";
      isValid = false;
    }
    if (!String(state.contactNumber).trim()) {
      errors.contactNumber = "Phone Number is required";
      isValid = false;
    } else if (String(state.contactNumber).length !== 10) {
      errors.contactNumber = "Phone Number must be 10 digits";
      isValid = false;
    }
    if (!state.contactPerson.trim()) {
      errors.contactPerson = "ContactPerson is required";
      isValid = false;
    }
    if (!state.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }
    if (!state.taxRegdNumber.trim()) {
      errors.taxRegdNumber = "Tax No. is required";
      isValid = false;
    }
    if (!state.self.trim()) {
      errors.Self = "Choose Self YES or NO";
      isValid = false;
    }
    if (!state.address.trim()) {
      errors.address = "Addres is required.";
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
      id: "supplierName",
      numeric: false,
      disablePadding: false,
      label: "Supplier Name",
    },
    {
      id: "vendorCode",
      numeric: false,
      disablePadding: false,
      label: "Vendor Code",
    },
    {
      id: "contactNumber",
      numeric: false,
      disablePadding: false,
      label: "Contact Number",
    },
    {
      id: "contactPerson",
      numeric: false,
      disablePadding: false,
      label: "Contact Person",
    },
    {
      id: "email",
      numeric: false,
      disablePadding: false,
      label: "Email",
    },
    {
      id: "taxRegdNumber",
      numeric: false,
      disablePadding: false,
      label: "Tax No.",
    },
    { id: "actions", label: "Action" },
  ];

  const getSPList = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllSuppliers`,
        requestOptions
      );
      const actualData = await res.json();

      if (actualData.status === 200) {
        setRowdata(
          actualData.suppliers.map((item) => ({
            slNo: actualData.suppliers.indexOf(item) + 1,
            id: item._id,
            supplierName: item.supplierName,
            vendorCode: item.vendorCode,
            contactNumber: item.contactNumber,
            contactPerson: item.contactPerson,
            email: item.email,
            taxRegdNumber: item.taxRegdNumber,
            self: item.self,
            address: item.address,
            actions: (
              <>
                <IconButton
                  aria-label="Edit"
                  onClick={(e) => {
                    // setIdToDelete(item._id);
                    // Set state with required format
                    setState({
                      id: item._id,
                      supplierName: item.supplierName,
                      vendorCode: item.vendorCode,
                      contactNumber: item.contactNumber,
                      contactPerson: item.contactPerson,
                      email: item.email,
                      taxRegdNumber: item.taxRegdNumber,
                      self: item.self,
                      address: item.address,
                      isUpdate: true,
                    });
                    setOpenDialog(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="Delete"
                  onClick={(e) => {
                    setDeleteDialogOpen(true);
                    setIdToDelete(item._id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          }))
        );
      }
    } catch (err) {
      console.log(err);
      setMessage("Something went wrong!");
      setOpen(true);
      setSeverity("error");
    }
  };

  useEffect(() => {
    getSPList();
  }, []);

  const handleCreateSP = async () => {
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
        supplierName: state.supplierName,
        vendorCode: state.vendorCode,
        contactNumber: state.contactNumber,
        contactPerson: state.contactPerson,
        email: state.email,
        taxRegdNumber: state.taxRegdNumber,
        self: state.self,
        address: state.address,
      };
      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createSupplier`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setState({
          id: "",
          supplierName: "",
          vendorCode: "",
          contactNumber: "",
          contactPerson: "",
          email: "",
          taxRegdNumber: "",
          self: "",
          address: "",
          isUpdate: false,
        });
        setOpenDialog(false);
        setMessage("Saved successfully!");
        setOpen(true);
        setSeverity("success");
        getSPList();
        window.scrollTo({
          top: 400,
          behavior: "smooth",
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

  const handleUpdateSP = async () => {
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
        supplierName: state.supplierName,
        vendorCode: state.vendorCode,
        contactNumber: state.contactNumber,
        contactPerson: state.contactPerson,
        email: state.email,
        taxRegdNumber: state.taxRegdNumber,
        self: state.self,
        address: state.address,
      };
      const requestOptions = {
        method: "PUT",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updateSupplier`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setState({
          supplierName: "",
          vendorCode: "",
          contactNumber: "",
          contactPerson: "",
          email: "",
          taxRegdNumber: "",
          self: "",
          address: "",
          isUpdate: false,
        });
        setOpenDialog(false);
        setMessage("Updated successfully!");
        setOpen(true);
        setSeverity("success");
        getSPList();
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

  const handleSPDelete = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteSupplier`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setDeleteDialogOpen(false);
        setIdToDelete(null);
        getSPList();
        setMessage("Deleted successfully!");
        setOpen(true);
        setSeverity("success");
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
      supplierName: "",
      vendorCode: "",
      contactNumber: "",
      contactPerson: "",
      email: "",
      taxRegdNumber: "",
      self: "",
      address: "",
      isUpdate: false,
    });
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
                <AddIcon /> Add Supplier
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
          <DialogTitle>Supplier</DialogTitle>
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
          <DialogContent
            className={classes.dialogContent}
            sx={{
              width: "40vw",
            }}
          >
            <TextField
              fullWidth
              sx={{
                marginBottom: 2,
              }}
              variant="standard"
              id="supplierName"
              name="supplierName"
              label="Supplier Name"
              value={state.supplierName}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[a-zA-Z\s]*$/;
                const maxValue = 50;
                if (regex.test(value) && value.length <= maxValue) {
                  setState({ ...state, supplierName: e.target.value });
                }
              }}
              error={!!errors.supplierName} // Show error if it exists
              helperText={errors.supplierName} // Display error message
            />
            {/* vendor code */}
            <TextField
              fullWidth
              sx={{
                marginBottom: 2,
              }}
              variant="standard"
              id="vendorCode"
              name="vendorCode"
              label="Vendor Code"
              value={state.vendorCode}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[a-zA-Z0-9\s]*$/;
                const maxValue = 50;
                if (regex.test(value) && value.length <= maxValue) {
                  setState({ ...state, vendorCode: e.target.value });
                }
              }}
              error={!!errors.vendorCode} // Show error if it exists
              helperText={errors.vendorCode} // Display error message
            />
            <TextField
              fullWidth
              variant="standard"
              id="contactNumber"
              name="contactNumber"
              label="Phone Number"
              value={state.contactNumber}
              onChange={(e) => {
                const input = e.target.value;
                const validInput = input.replace(/[^0-9]/g, "").slice(0, 10);
                setState({
                  ...state,
                  contactNumber: validInput,
                });
              }}
              error={!!errors.contactNumber} // Show error if it exists
              helperText={errors.contactNumber} // Display error message
            />
            <TextField
              fullWidth
              sx={{
                marginBottom: 2,
              }}
              variant="standard"
              id="contactPerson"
              name="contactPerson"
              label="Contact person"
              value={state.contactPerson}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[a-zA-Z\s]*$/;
                const maxValue = 50;
                if (regex.test(value) && value.length <= maxValue) {
                  setState({ ...state, contactPerson: e.target.value });
                }
              }}
              error={!!errors.contactPerson} // Show error if it exists
              helperText={errors.contactNumber} // Display error message
            />
            <TextField
              variant="standard"
              id="Email"
              name="Email"
              label="Email"
              fullWidth
              value={state.email}
              onChange={(e) =>
                setState({
                  ...state,
                  email: e.target.value,
                })
              }
              error={!!errors.email} // Show error if it exists
              helperText={errors.email} // Display error message
            />
            <TextField
              fullWidth
              sx={{
                marginBottom: 2,
              }}
              variant="standard"
              id="taxRegdNumber"
              name="taxRegdNumber"
              label="Tax No."
              value={state.taxRegdNumber}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[a-zA-Z0-9\s]*$/; // Allow letters, numbers, and spaces
                const maxValue = 50;
                if (regex.test(value) && value.length <= maxValue) {
                  setState({ ...state, taxRegdNumber: value });
                }
              }}
              error={!!errors.taxRegdNumber} // Show error if it exists
              helperText={errors.taxRegdNumber} // Display error message
            />
            <TextField
              fullWidth
              sx={{
                marginBottom: 2,
              }}
              variant="standard"
              id="adds"
              name="address"
              label="Address"
              value={state.address}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[a-zA-Z0-9\s]*$/; // Allow letters, numbers, and spaces
                const maxValue = 50;
                if (regex.test(value) && value.length <= maxValue) {
                  setState({ ...state, address: value });
                }
              }}
              error={!!errors.address} // Show error if it exists
              helperText={errors.address} // Display error message
            />
            <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
              <FormLabel component="legend">Self</FormLabel>
              <RadioGroup
                row
                aria-label="self"
                name="self"
                value={state.self}
                onChange={(e) => setState({ ...state, self: e.target.value })}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.self && (
                <FormHelperText error>{errors.self}</FormHelperText>
              )}{" "}
              {/* Display error message */}
            </FormControl>
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
                  onClick={handleUpdateSP}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateSP}
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
          title="Supplier List"
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
        onDelete={handleSPDelete}
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

export default Supplier;
