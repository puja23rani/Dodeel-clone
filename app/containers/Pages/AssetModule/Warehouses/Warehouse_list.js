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
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import DeleteIcons from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import Popup from "../../../../components/Popup/Popup";
import AlertDialog from "../../../UiElements/demos/DialogModal/AlertDialog";
import TablePlayground from "../../../Tables/TablePlayground";




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

function Warehouse_list() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    warehouseName: "",
    warehouseCode: "",
    address: "",
    latitude: "",
    longitude: "",
    accountSupervisorName: "",
    accountSupervisor: "",
    dispatchSupervisorName: "",
    dispatchSupervisor: "",
    inductionDate: "",
    isUpdate: false,
  });
  const [errors, setErrors] = useState({
    warehouseName: "",
    warehouseCode: "",
    address: "",
    latitude: "",
    longitude: "",
    accountSupervisorName: "",
    dispatchSupervisorName: "",
    inductionDate: "",
  });
  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.warehouseName.trim()) {
      errors.warehouseName = "WarehouseName is required";
      isValid = false;
    }
    if (!state.warehouseCode.trim()) {
      errors.warehouseCode = "WarehouseCode is required";
      isValid = false;
    }
    if (!String(state.address).trim()) {
      errors.address ="Address is required.";
      isValid = false;
    }
    if (!String(state.latitude).trim()){
      errors.latitude = "Latitude is required";
      isValid = false;
    }
    if(!String(state.longitude).trim()) {
      errors.longitude = "longitude is required";
      isValid = false;
    }
    if (!String(state.accountSupervisorName).trim()) {
      errors.accountSupervisor = "Account SupervisorName is required";
      isValid = false;
    }
    if (!String(state.dispatchSupervisorName).trim()) {
      errors.dispatchSupervisorName = "Dispatch Supervisor Name is required";
      isValid = false;
    }
    if (!String(state.inductionDate).trim()) {
      errors.inductionDate = "Induction date is required";
      isValid = false;
    }

    // if (!state.Campaign.id) {
    //   errors.Campaign = "Campaign is required";
    //   isValid = false;
    // }

    // if (!state.Channel.id) {
    //   errors.Channel = "Channel is required";
    //   isValid = false;
    // }

    // if (!state.Lead_Status.id) {
    //   errors.Lead_Status = "Lead Status is required";
    //   isValid = false;
    // }

    // if (!state.Description.trim()) {
    //   errors.Description = "Description is required";
    //   isValid = false;
    // }
    console.log(errors);
    console.log(isValid);
    setErrors(errors);
    return isValid;
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
      id: "warehouseName",
      numeric: false,
      disablePadding: false,
      label: "Warehouse Name",
    },
    {
      id: "warehouseCode",
      numeric: true,
      disablePadding: false,
      label: "Warehouse Code",
    },
 
    { id: "actions", label: "Action" },
  ];
//   const [empList, setEmpList] = React.useState([]);
//   const table3 = async () => {
//     try {
//       const loginHeaders = new Headers();
//       loginHeaders.append("Content-Type", "application/json");

//       // Assuming you have an authorization token stored in localStorage
//       const authToken = localStorage.getItem("token");
//       if (authToken) {
//         loginHeaders.append("Authorization", `Bearer ${authToken}`);
//       }

//       const requestOptions = {
//         method: "GET",
//         headers: loginHeaders,
//       };
//       const res = await fetch(
//         `${process.env.REACT_APP_BASE_URL}/api/auth/getEmployeeDetails`,
//         requestOptions
//       );
//       const actualData = await res.json();
//       if (Array.isArray(actualData.employees)) {
//         const newobj = actualData.employees.map((item) => ({
//           title: item.personalDetails.employeeName, // Set the title from channelName
//           id: item._id, // Set the id from _id
//         }));
//         setEmpList(actualData.employees);
//       }
//     } catch (err) {
//       //console.log(err);
//     }
//   };

//   useEffect(() => {
//     table3();
//   }, []);
 
  console.log(state, "stateware");
  function fetchWH(pg) {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllWarehouses`,
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
        console.log(response.data.data);
        if (response.data.data) {
          setRowdata(
            response.data.data.map((item, index) => ({
              slNo: response.data.data.indexOf(item) + 1,
              id: item._id,
              warehouseName: item.warehouseName || "N/A",
              warehouseCode: item.warehouseCode || "N/A",
             
              actions: (
                <>
                  
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
          setLength(response.data.totalWarehouses);
          setPagination(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  useEffect(() => {
    fetchWH(page);
  }, [page, rowsPerPage]);
  
  
  

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

  // Delete a section by index
  return (
    <>
      <div>
        <Toolbar className={classes.toolbar}>
          <div className={classes.spacer} style={{ flexGrow: 1 }} />
          <div className={classes.actions}>
            {/* <Tooltip title="Add Item">
              <Button
                variant="contained"
                onClick={() => setOpenDialog(true)}
                color="primary"
                className={classes.button}
              >
                <AddIcon /> Add Warehouse
              </Button>
            </Tooltip> */}
          </div>
        </Toolbar>
        {/* <Dialog
          open={openDialog}
          onClose={() => {
            setState({
              warehouseName: "",
              warehouseCode: "",
              address: "",
              latitude: "",
              longitude: "",
              accountSupervisorName: "",
              accountSupervisor: "",
              dispatchSupervisorName: "",
              dispatchSupervisor: "",
              inductionDate: "",
              isUpdate: false,
            });
            setOpenDialog(false);
          }}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Warehouse</DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {
              setState({
                warehouseName: "",
                warehouseCode: "",
                address: "",
                latitude: "",
                longitude: "",
                accountSupervisorName: "",
                accountSupervisor: "",
                dispatchSupervisorName: "",
                dispatchSupervisor: "",
                inductionDate: "",
                isUpdate: false,
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
                    id="warehouseName"
                    name="warehouseName"
                    label="Warehouse Name"
                    value={state.warehouseName}
                    onChange={(e) => {
                      const input = e.target.value;

                      // Remove any non-alphabetic characters and limit to 70 characters
                      const validInput = input
                        .replace(/[^a-zA-Z\s]/g, "")
                        .slice(0, 70);

                      setState({
                        ...state,
                        warehouseName: validInput,
                      });
                    }}
                    error={!!errors.warehouseName} // Show error if it exists
                    helperText={errors.warehouseName} // Display error message
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="warehouseCode"
                    name="warehouseCode"
                    label="Warehouse Code"
                    value={state.warehouseCode}
                    onChange={(e) => {
                      const input = e.target.value;

                      // Remove any non-alphabetic characters and limit to 70 characters
                      const validInput = input
                        .replace(/[^a-zA-Z0-9\s]/g, "")
                        .slice(0, 70);

                      setState({
                        ...state,
                        warehouseCode: validInput,
                      });
                    }}
                    error={!!errors.warehouseCode} // Show error if it exists
                    helperText={errors.warehouseCode} // Display error message
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

                      // Remove any non-alphabetic characters and limit to 70 characters
                      const validInput = input
                        .replace(/[^a-zA-Z0-9\s]/g, "")
                        .slice(0, 70);

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
                    sx={{
                      marginBottom: 2,
                    }}
                    variant="standard"
                    id="latitude"
                    name="latitude"
                    label="Latitude"
                    value={state.latitude}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Allow only numbers and one decimal point
                      const regex = /^[0-9]*\.?[0-9]*$/;
                      const maxLength = 15; // Limit to 15 characters, including the decimal point

                      if (regex.test(value) && value.length <= maxLength) {
                        setState({ ...state, latitude: value });
                      }
                    }}
                    error={!!errors.latitude} // Show error if it exists
                    helperText={errors.latitude} // Display error message
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    sx={{
                      marginBottom: 2,
                    }}
                    variant="standard"
                    id="longitude"
                    name="longitude"
                    label="Longitude"
                    value={state.longitude}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Allow only numbers and one decimal point
                      const regex = /^[0-9]*\.?[0-9]*$/;
                      const maxLength = 15; // Limit to 15 characters, including the decimal point

                      if (regex.test(value) && value.length <= maxLength) {
                        setState({ ...state, longitude: value });
                      }
                    }}
                    error={!!errors.longitude} // Show error if it exists
                    helperText={errors.longitude} // Display error message
                  />
                </Grid>

                <Grid item xs={6}>
                  <Autocomplete
                    sx={{
                      marginTop: "-16px",
                    }}
                    id="highlights-demo"
                    options={empList.map((item) => {
                      return {
                        id: item._id,
                        title: item.personalDetails.employeeName,
                      };
                    })}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    value={state.accountSupervisorName}
                    onChange={(e, v, reason) => {
                      if (reason === "clear") {
                        setState({
                          ...state,
                          accountSupervisorName: "",
                          accountSupervisor: "",
                        });
                      } else {
                        const selectedCampaign = empList.find(
                          (item) => item.personalDetails.employeeName === v
                        );
                        setState({
                          ...state,
                          accountSupervisorName: v,
                          accountSupervisor: selectedCampaign
                            ? selectedCampaign._id
                            : null,
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Account Supervisor"
                        margin="normal"
                        variant="standard"
                        error={!!errors.accountSupervisorName} // Show error if it exists
                        helperText={errors.accountSupervisorName} // Display error message
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    sx={{
                      marginTop: "-16px",
                    }}
                    id="highlights-demo"
                    options={empList.map((item) => {
                      return {
                        id: item._id,
                        title: item.personalDetails.employeeName,
                      };
                    })}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    value={state.dispatchSupervisorName}
                    onChange={(e, v, reason) => {
                      if (reason === "clear") {
                        setState({
                          ...state,
                          dispatchSupervisorName: "",
                          dispatchSupervisor: "",
                        });
                      } else {
                        const selectedCampaign = empList.find(
                          (item) => item.personalDetails.employeeName === v
                        );
                        setState({
                          ...state,
                          dispatchSupervisorName: v,
                          accountSupervisor: selectedCampaign
                            ? selectedCampaign._id
                            : null,
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Discount Supervisor"
                        margin="normal"
                        variant="standard"
                        error={!!errors.dispatchSupervisorName} // Show error if it exists
                        helperText={errors.dispatchSupervisorName} // Display error message
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6} sx={{ width: "100%" }}>
                  <TextField
                    id="date"
                    label="Induction Date"
                    type="date"
                    variant="standard"
                    defaultValue={state.inductionDate}
                    sx={{ width: "100%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) =>
                      setState({ ...state, inductionDate: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setState({
                  warehouseName: "",
                  warehouseCode: "",
                  address: "",
                  latitude: "",
                  longitude: "",
                  accountSupervisorName: "",
                  accountSupervisor: "",
                  dispatchSupervisorName: "",
                  dispatchSupervisor: "",
                  inductionDate: "",
                  isUpdate: false,
                });
                setOpenDialog(false);
              }}
              color="secondary"
            >
              Close
            </Button>
            {state.isUpdate ? (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleUpdateWH}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateWH}
                >
                  Create
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog> */}
      </div>

      {rowdata && (
        <TablePlayground
          title="Warehouse List"
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
        // onDelete={handleCampaignDelete}
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

export default Warehouse_list;
