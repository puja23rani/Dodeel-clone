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

function Performance() {
  const { classes } = useStyles();

  const [state, setState] = useState({
    id: "",
    performanceName: "",
    isUpdate: false,
  });

  const [errors, setErrors] = useState({
    performanceName: "",
  });


  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.performanceName.trim()) {
      errors.performanceName = "Performance Type Name is required";
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
      id: "performanceName",
      numeric: false,
      disablePadding: false,
      label: "Performance Type",
    },
    { id: "actions", label: "Action" },
  ];

  const getPerformanceList = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getPerformanceTypes`,
        requestOptions
      );
      const actualData = await res.json();
      // console.log(actualData);

      if (actualData.status === 200) {
        setRowdata(
          actualData.performanceTypes.map((item) => ({
            slNo: actualData.performanceTypes.indexOf(item) + 1,
            id: item._id,
            performanceName: item.performanceName,
            actions: (
              <>
                <IconButton
                  aria-label="Edit"
                  onClick={(e) => {
                    setState({
                      id: item._id,
                      performanceName: item.performanceName,
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
    } catch (err) {
      console.log(err);
      setMessage("Something went wrong!");
      setOpen(true);
      setSeverity("error");
    }
  }

  useEffect(() => {
    getPerformanceList();
  }, []);

  const handleCreatePerformance = async () => {
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
        performanceName: state.performanceName,
      };
      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createPerformanceType`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setState({
          id: "",
          performanceName: "",
          isUpdate: false,
        });
        setOpenDialog(false);
        setMessage("Saved successfully!");
        setOpen(true);
        setSeverity("success");
        getPerformanceList();
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

  const handleUpdatePerformance = async () => {
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
        performanceName: state.performanceName,
      };
      const requestOptions = {
        method: "PUT",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updatePerformanceType`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setState({
          id: "",
          performanceName: "",
          isUpdate: false,
        });
        setOpenDialog(false);
        setMessage("Updated successfully!");
        setOpen(true);
        setSeverity("success");
        getPerformanceList();
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

  const handleDeletePerformance = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/deletePerformanceType`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setDeleteDialogOpen(false);
        setIdToDelete(null);
        getPerformanceList();
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
      performanceName: "",
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
                <AddIcon /> Add Performance
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
        >
          <DialogTitle>
            Performance
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
          <DialogContent className={classes.dialogContent} sx={{
            width: "40vw"
          }}>
            <TextField
              fullWidth
              sx={{
                marginBottom: 2,
              }}
              variant="standard"
              id="performanceName"
              name="performanceName"
              label="Performance Type (e.g. Project Management(PMS) etc.)"
              value={state.performanceName}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[a-zA-Z\s]*$/;
                const maxValue = 50
                if (regex.test(value) && value.length <= maxValue) {
                  setState({ ...state, performanceName: e.target.value });
                }
              }}
              error={!!errors.performanceName} // Show error if it exists
              helperText={errors.performanceName} // Display error message
            />
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
                  onClick={handleUpdatePerformance}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreatePerformance}
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
          title="Performance List"
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
        onDelete={handleDeletePerformance}
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

export default Performance;
