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
  Grid,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import AlertDialog from "../../../UiElements/demos/DialogModal/AlertDialog";
import TablePlayground from "../../../Tables/TablePlayground";
import Popup from "../../../../components/Popup/Popup";
import { set } from "lodash";

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

function OfficeShift() {
  const { classes } = useStyles();

  const [state, setState] = React.useState({
    id: "",
    startTime: "",
    endTime: "",
    isUpdate: false,
  });

  // console.log(state);

  const [errors, setErrors] = useState({
    startTime: "",
    endTime: "",
  });

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (state.startTime == "") {
      errors.startTime = "Start Time is required";
      isValid = false;
    }

    if (state.endTime == "") {
      errors.endTime = "End Time is required";
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
      id: "shiftName",
      numeric: false,
      disablePadding: false,
      label: "Shift Name",
    },
    {
      id: "workShift",
      numeric: false,
      disablePadding: false,
      label: "Work Shift Timing",
    },
    { id: "actions", label: "Action" },
  ];

  const getWorkshiftList = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getWorkshiftDetails`,
        requestOptions
      );
      const actualData = await res.json();
      // console.log(actualData);

      if (actualData.status === 200) {
        setRowdata(
          actualData.workshifts.map((item) => ({
            slNo: actualData.workshifts.indexOf(item) + 1,
            id: item._id,
            shiftName: item.shiftName,
            workShift: item.workShift,
            actions: (
              <>
                <IconButton
                  aria-label="Edit"
                  onClick={(e) => {
                    handleSetTimeToState(item)
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
    getWorkshiftList();
  }, []);

  const handleCreateWorkshift = async () => {
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
        workShift: {
          startTime: state.startTime,
          endTime: state.endTime

        }
      };
      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createWorkshift`,
        requestOptions
      );
      const actualData = await res.json();
      // console.log(actualData);
      if (actualData.status === 200) {
        setState({
          id: "",
          startTime: "",
          endTime: "",
          isUpdate: false,
        });
        setOpenDialog(false);
        setMessage("Saved successfully!");
        setOpen(true);
        setSeverity("success");
        getWorkshiftList();
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

  const handleUpdateWorkshift = async () => {
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
        workShift: {
          startTime: state.startTime,
          endTime: state.endTime
        }
      };

      const requestOptions = {
        method: "PUT",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updateWorkshift`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setState({
          id: "",
          startTime: "",
          endTime: "",
        });
        setOpenDialog(false);
        setMessage("Updated successfully!");
        setOpen(true);
        setSeverity("success");
        getWorkshiftList();
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

  const handleWorkshiftDelete = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteWorkshift`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setDeleteDialogOpen(false);
        setIdToDelete(null);
        getWorkshiftList();
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
      leaveTypes: "",
      daysPerYear: "",
      isUpdate: false,
    })
    setstartTime("");
    setendTime("");
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

  function formatTimeTo12Hour(time24) {
    let [hour, minute] = time24.split(':');
    hour = parseInt(hour, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert hour to 12-hour format
    return `${hour}:${minute} ${period}`;
  }

  const [startTime, setstartTime] = useState("")
  const [endTime, setendTime] = useState("")


  function formatTimeTo24Hour(time12) {
    const [time, period] = time12.split(' ');
    let [hour, minute] = time.split(':');
    hour = parseInt(hour, 10);
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  }
  const handleSetTimeToState = (item) => {
    const startTime = item.workShift.split(" - ")[0]
    const endTime = item.workShift.split(" - ")[1]
    const formattedStartTime = formatTimeTo24Hour(startTime)
    const formattedEndTime = formatTimeTo24Hour(endTime)
    setstartTime(formattedStartTime)
    setendTime(formattedEndTime)
    setState({
      ...state,
      id: item._id,
      startTime: item.workShift.split(" - ")[0],
      endTime: item.workShift.split(" - ")[1],
      isUpdate: true,
    })
  }

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
                <AddIcon /> Add Office Shift
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
            Office Shift
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
          <DialogContent className={classes.dialogContent} style={{ marginBottom: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  id="time"
                  fullWidth
                  label="Start Time"
                  type="time"
                  defaultValue={startTime}
                  onChange={(e) => {
                    const selectedTime = e.target.value; // Get the selected time from input

                    // Convert selectedTime from 24-hour to 12-hour format with AM/PM
                    const formattedTime = formatTimeTo12Hour(selectedTime);

                    setstartTime(e.target.value)

                    // Update the state with the formatted time
                    setState({
                      ...state,
                      startTime: formattedTime,
                    });
                  }}
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                  sx={{ width: 180 }}
                  error={!!errors.startTime} // Show error if it exists
                  helperText={errors.startTime} // Display error message
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="time"
                  label="End Time"
                  type="time"
                  defaultValue={endTime}
                  onChange={(e) => {
                    const selectedTime = e.target.value; // Get the selected time from input

                    // Convert selectedTime from 24-hour to 12-hour format with AM/PM
                    const formattedTime = formatTimeTo12Hour(selectedTime);

                    setendTime(e.target.value)
                    // Update the state with the formatted time
                    setState({
                      ...state,
                      endTime: formattedTime,
                    })
                  }
                  }
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                  sx={{ width: 180 }}
                  error={!!errors.endTime} // Show error if it exists
                  helperText={errors.endTime} // Display error message
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
                  onClick={handleUpdateWorkshift}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateWorkshift}
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
          title="Office Shift List"
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
        onDelete={handleWorkshiftDelete}
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

export default OfficeShift;