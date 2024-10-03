import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";

import axios from "axios";
import { PapperBlock } from "enl-components";

import { toast } from "react-toastify";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import DeleteIcons from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useNavigate } from "react-router-dom";
import Popup from "../../../components/Popup/Popup";
import TablePlayground from "../../Tables/TablePlayground";
import AlertDialog from "../../UiElements/demos/DialogModal/AlertDialog";
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

function Contractor() {
  const { classes } = useStyles();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    contractorName: "",
    contactNumber: "",
    alternativeNumber: "",
    email: "",
    gstNumber: "",
    address: "",
    password: "",
    id: "",
    isUpdate: false,
    showPassword: false,
  });
  const [errors, setErrors] = useState({
    contractorName: "",
    contactNumber: "",
    alternativeNumber: "",
    email: "",
    gstNumber: "",
    address: "",
    password: "",
  });

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.contractorName.trim()) {
      errors.contractorName = "Name is required";
      isValid = false;
    }

    if (!String(state.contactNumber).trim()) {
      errors.contactNumber = "Phone Number is required";
      isValid = false;
    } else if (String(state.contactNumber).length !== 10) {
      errors.contactNumber = "Phone Number must be 10 digits";
      isValid = false;
    }
    if (!String(state.alternativeNumber).trim()) {
      errors.alternativeNumber = "Phone Number is required";
      isValid = false;
    } else if (String(state.alternativeNumber).length !== 10) {
      errors.alternativeNumber = "Phone Number must be 10 digits";
      isValid = false;
    }

    if (!state.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }
    if (!state.gstNumber.trim()) {
      errors.gstNumber = "GST number is required";
      isValid = false;
    }
    if (!state.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }
    if (!state.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }

    if (!state.isUpdate) {
      if (state.password.length < 6 || state.password.length > 15) {
        errors.password = "Password must be 6-15 characters long.";
        isValid = false;
      }

      if (/\s/.test(state.password)) {
        errors.password = "Password should not contain spaces.";
        isValid = false;
      }
    }
    console.log(errors);
    console.log(isValid);
    setErrors(errors);
    return isValid;
  };
  const handleClickShowPassword = () => {
    setState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  const [rowdata, setRowdata] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [length, setLength] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [pagination, setPagination] = useState(false);

  const columnData = [
    {
      id: "slNo",
      numeric: true,
      disablePadding: false,
      label: "Sl No",
    },
    {
      id: "contractorName",
      numeric: false,
      disablePadding: false,
      label: "Contarctor Name",
    },
    {
      id: "contactNumber",
      numeric: true,
      disablePadding: false,
      label: "Contact Number",
    },
    {
      id: "email",
      numeric: true,
      disablePadding: false,
      label: "Email",
    },
    {
      id: "alternativeNumber",
      numeric: false,
      disablePadding: false,
      label: "Alt. Number",
    },
    {
      id: "gstNumber",
      numeric: false,
      disablePadding: false,
      label: "GST",
    },
    {
      id: "address",
      numeric: false,
      disablePadding: false,
      label: "Address",
    },

    { id: "actions", label: "Action" },
  ];

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);

  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget); // Set the clicked button as the anchor
    setSelectedEmployee(employee); // Set the selected employee
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Reset anchorEl to null to close the menu
    setSelectedEmployee(null); // Reset selected employee
  };

  function fetchCON(pg) {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllContractors`,
        {
          pageNumber: pg,
          pageSize: rowsPerPage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response, "connnnnnnn");
        console.log(state, "stateeeeeeeeeeeeeeeeeeee");

        if (response.data.data) {
          setRowdata(
            response.data.data.map((item, index) => ({
              slNo: response.data.data.indexOf(item) + 1,
              id: item._id,
              contractorName: item.contractorName || "N/A",
              contactNumber: item.contactNumber || "N/A",
              alternativeNumber: item.alternativeNumber || "N/A",
              email: item.email || "N/A",
              gstNumber: item.gstNumber || "N/A",
              address: item.address || "N/A",
              actions: (
                <>
                  <IconButton
                    aria-label="Edit"
                    onClick={(e) => {
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
                      });
                      setItemToDelete(item._id);
                      setState({
                        contractorName: item.contractorName,
                        contactNumber: item.contactNumber,
                        alternativeNumber: item.alternativeNumber,
                        email: item.email,
                        gstNumber: item.gstNumber,
                        address: item.address,
                        password: item.password,
                        id: item._id,
                        isUpdate: true,
                      });
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    onClick={() => {
                      setItemToDelete(item._id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              ),
            }))
          );
          setLength(response.data.totalContractors);
          setPagination(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  useEffect(() => {
    fetchCON(page);
  }, [page, rowsPerPage]);
  const handleCreateCon = async () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    console.log("p1");
    try {
      // Prepare the data to match the required request body format
      const data = {
        contractorName: state.contractorName,
        email: state.email,
        password: state.password,
        gstNumber: state.gstNumber,
        alternativeNumber: parseInt(state.alternativeNumber),
        contactNumber: parseInt(state.contactNumber),
        address: state.address,
      };
      console.log("p2");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createContractor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      console.log("p3");
      const result = await response.json();
      if (result.status === 200) {
        fetchCON();
        window.scrollTo({
          top: 400,
          behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
        });
        // Reset the state after successful creation
        setState({
          contractorName: "",
          contactNumber: "",
          alternativeNumber: "",
          email: "",
          gstNumber: "",
          address: "",
          password: "",
          isUpdate: false,
          showPassword: false,
        });
        setOpenDialog(false);
        setMessage("Created Sucessfully!");
        setOpen(true);
        setSeverity("success");
      } else {
        setMessage(result.message);
        setOpen(true);
        setSeverity("error");
      }
    } catch (err) {
      console.log(err);
      setMessage(err.message);
      setOpen(true);
      setSeverity("error");
    }
  };

  const handleConDelete = async () => {
    try {
      const data = { id: parseInt(itemToDelete) };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteContractor`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result.status === 200) {
        setDeleteDialogOpen(false);
        fetchCON();
        setMessage("Deleted successfully!");
        setOpen(true);
        setSeverity("success");
        setItemToDelete(null);
      } else {
        setMessage(actualData.message);
        setOpen(true);
        setSeverity("error");
        setItemToDelete(null);
      }
    } catch (err) {
      //console.log(err);
      setMessage(err.message);
      setOpen(true);
      setSeverity("error");
    }
  };

  const handleUpdateCon = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const token = localStorage.getItem("token");
      if (token) {
        loginHeaders.append("Authorization", `Bearer ${token}`);
      }
      const data = {
        id: parseInt(itemToDelete), // id from itemToDelete,
        contractorName: state.contractorName,
        email: state.email,
        gstNumber: state.gstNumber,
        alternativeNumber: parseInt(state.alternativeNumber),
        contactNumber: parseInt(state.contactNumber),
        address: state.address,
      };

      if (!validate()) {
        setMessage("Please fill all required fields");
        setOpen(true);
        setSeverity("warning");
        return;
      } else {
        const requestOptions = {
          method: "PUT",
          headers: loginHeaders,
          body: JSON.stringify(data),
        };
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/auth/updateContractor`,
          requestOptions
        );

        const actualData = await res.json();
        //console.log(actualData);
        // setVisaList(actualData.Country);
        if (actualData.status == 200) {
          fetchCON();
          window.scrollTo({
            top: 400,
            behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
          });
          setOpenDialog(false);
          setState({
            contractorName: "",
            contactNumber: "",
            alternativeNumber: "",
            email: "",
            gstNumber: "",
            address: "",
            isUpdate: false,
          });
          setMessage("Updated successfully!");
          setOpen(true);
          setSeverity("success");
          // Navigate("/Department");
        } else {
          setMessage(actualData.message);
          setOpen(true);
          setSeverity("error");
        }
      }
    } catch (err) {
      console.log(err);
      // toast.error("Failed to save. Please try again.", {
      //   position: "top-center",
      // });
      setMessage(err.message);
      setOpen(true);
      setSeverity("error");
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handlePageChange = (event, newPage) => {
    console.log(newPage);
    if (newPage !== 0) {
      setPage(newPage + 1); // Update the current page
    }
    if (newPage === 0) {
      setPage(1);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update the rows per page
    setPage(1); // Reset to first page
  };
  const handleAddSection = () => {
    setState({
      ...state,
      fieldset: [...state.fieldset, { name: "", value: "" }],
    });
  };

  // Delete a section by index
  const handleDeleteSection = (idx) => {
    setState({
      ...state,
      fieldset: state.fieldset.filter((_, index) => index !== idx),
    });
  };
  console.log(state, "sssssss");
  console.log(anchorEl, "annnn");
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
                <AddIcon /> Add Contractor
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
          open={openDialog}
          onClose={() => {
            setState({
              contractorName: "",
              contactNumber: "",
              alternativeNumber: "",
              email: "",
              gstNumber: "",
              address: "",
              password: "",
              id: "",
            });
            setOpenDialog(false);
          }}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Contractor</DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {
              setState({
                contractorName: "",
                contactNumber: "",
                alternativeNumber: "",
                email: "",
                gstNumber: "",
                address: "",
                password: "",
                id: "",
              });
              setOpenDialog(false);
            }}
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
            <div className={classes.form}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="contractorName"
                    name="contractorName"
                    label="Contractor Name"
                    value={state.contractorName}
                    onChange={(e) => {
                      const input = e.target.value;
                      const validInput = input.replace(/[^a-zA-Z\s]/g, "");
                      setState({
                        ...state,
                        contractorName: validInput,
                      });
                    }}
                    error={!!errors.contractorName} // Show error if it exists
                    helperText={errors.contractorName} // Display error message
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="contactNumber"
                    name="contactNumber"
                    label="Phone Number"
                    value={state.contactNumber}
                    onChange={(e) => {
                      const input = e.target.value;
                      const validInput = input
                        .replace(/[^0-9]/g, "")
                        .slice(0, 10);
                      setState({
                        ...state,
                        contactNumber: validInput,
                      });
                    }}
                    error={!!errors.contactNumber} // Show error if it exists
                    helperText={errors.contactNumber} // Display error message
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="alternativeNumber"
                    name="alternativeNumber"
                    label=" Alternative Phone Number"
                    value={state.alternativeNumber}
                    onChange={(e) => {
                      const input = e.target.value;
                      const validInput = input
                        .replace(/[^0-9]/g, "")
                        .slice(0, 10);
                      setState({
                        ...state,
                        alternativeNumber: validInput,
                      });
                    }}
                    error={!!errors.alternativeNumber} // Show error if it exists
                    helperText={errors.alternativeNumber} // Display error message
                  />
                </Grid>

                <Grid item xs={6}>
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
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="ads"
                    name="address"
                    label="Address"
                    value={state.address}
                    onChange={(e) => {
                      const input = e.target.value;
                      const validInput = input.replace(/[^a-zA-Z\s]/g, "");
                      setState({
                        ...state,
                        address: validInput,
                      });
                    }}
                    error={!!errors.address} // Show error if it exists
                    helperText={errors.address} // Display error message
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="gstNumber"
                    name="gstNumber"
                    label="Gst Number"
                    value={state.gstNumber}
                    onChange={(e) => {
                      const input = e.target.value;
                      const validInput = input.replace(/[^0-9]/g, "");
                      setState({
                        ...state,
                        gstNumber: validInput,
                      });
                    }}
                    error={!!errors.gstNumber} // Show error if it exists
                    helperText={errors.gstNumber} // Display error message
                  />
                </Grid>

                {!state.isUpdate && (
                  <Grid item xs={6}>
                    <TextField
                      variant="standard"
                      id="Password"
                      name="Password"
                      label="Password"
                      type={state.showPassword ? "text" : "password"}
                      fullWidth
                      value={state.password}
                      onChange={(e) =>
                        setState({ ...state, password: e.target.value })
                      }
                      error={!!errors.password}
                      helperText={errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {state.showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            {state.isUpdate ? (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleUpdateCon}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateCon}
                >
                  Create
                </Button>
              </>
            )}
            <Button
              onClick={() => {
                setState({
                  contractorName: "",
                  contactNumber: "",
                  alternativeNumber: "",
                  email: "",
                  gstNumber: "",
                  address: "",
                  password: "",
                  id: "",
                });
                setOpenDialog(false);
              }}
              color="secondary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {rowdata && (
        <TablePlayground
          title="Contractor List"
          columnData={columnData}
          rowData={rowdata}
          component="div"
          count={length} // Total number of rows
          rowsPerPage={rowsPerPage} // Number of rows per page
          page={page} // Current page
          onPageChange={handlePageChange} // Handle page change
          onRowsPerPageChange={handleRowsPerPageChange} // Handle rows per page change
          pagination={pagination}
        />
      )}

      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        onDelete={handleConDelete}
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

export default Contractor;
