import React, { useState, useEffect } from "react";
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
import TablePlayground from "../../Tables/TablePlayground";
import AlertDialog from "../../UiElements/demos/DialogModal/AlertDialog";
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import Popup from "../../../components/Popup/Popup";
import { DialogContent, Toolbar } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { Dialog } from "@mui/material";
import { DialogActions } from "@mui/material";
import { Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Close as CloseIcon } from "@mui/icons-material";




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

function Interviewer() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");
  // const defaultData = {
  //   Status: "",
  //   Description: "",
  // };

  const [errors, setErrors] = useState({
    interviewerName: "",

  });

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.interviewerName.trim()) {
      errors.interviewerName = "Interviewer Name is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const [state, setState] = useState({
    interviewerName: "",
    id: "",
    searchText: "",
    isUpdate: false,
  });
  const [rowdata, setRowdata] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
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
      id: "interviewerName",
      numeric: false,
      disablePadding: false,
      label: "Interviewer Name",
    },

    { id: "actions", label: "Action" },
  ];

  useEffect(() => {
    fetchInterviewer();
  }, []);

  const fetchInterviewer = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/auth/getAllInterviewers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.interviewers) {
          setRowdata(
            response.data.interviewers.map((item) => ({
              slNo: response.data.interviewers.indexOf(item) + 1,
              id: item._id,
              interviewerName: item.interviewerName,
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
                        interviewerName: item.interviewerName,
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
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const handleSaveInterviewer = () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    if (state.interviewerName == ""
    ) {
      toast.error("Fill all the information", {
        position: "top-center",
      });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/auth/createInterviewer`,
          {

            interviewerName: state.interviewerName,
          },
          {
            headers: {
              /* Your headers here */
              "Content-Type": "application/json", // Example header
              Authorization: `Bearer ${token}`, // Example authorization header
            },
          }
        )
        .then((response) => {
          if (response.status == 200) {
            // Assuming table() refreshes or updates the UI
            fetchInterviewer();
            window.scrollTo({
              top: 400,
              behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
            });
            setState({
              interviewerName: "",
              isUpdate: false,
            });
            setMessage("Saved successfully!");
            setOpen(true);
            setSeverity("success");
            setOpenDialog(false);
          } else {
            setMessage(result.message);
            setOpen(true);
            setSeverity("error");
          }
        })
        .catch((error) => {
          setMessage(err.message);
          setOpen(true);
          setSeverity("error");
        });
    }
  };


  const handleInterviewerDelete = async () => {
    try {
      const data = { id: itemToDelete };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteInterviewer`,
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
        fetchInterviewer();
        setMessage("Deleted successfully!");
        setOpen(true);
        setSeverity("success");
      } else {
        setMessage(actualData.message);
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
  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const handleUpdateInterviewer = () => {
    const requestData = {
      id: itemToDelete,
      interviewerName: state.interviewerName,
    };
  
    console.log(requestData);
  
    if (state.interviewerName === "") {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
    } else {
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL}/api/auth/updateInterviewer`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            // Refresh the list of interviewers
            fetchInterviewer();
  
            // Scroll smoothly to the top
            window.scrollTo({
              top: 400,
              behavior: "smooth",
            });
  
            // Clear the form fields and reset isUpdate to false
            setState({
              ...state,
              interviewerName: "", // Clear the interviewer name
              id: "", // Reset the id
              isUpdate: false, // Set isUpdate to false
            });
  
            // Set success message and show notification
            setMessage("Updated successfully!");
            setOpen(true);
            setSeverity("success");
            setOpenDialog(false);

          } else {
            setMessage(response.data.message);
            setOpen(true);
            setSeverity("error");
          }
        })
        .catch((error) => {
          setMessage(error.message);
          setOpen(true);
          setSeverity("error");
        });
    }
  };
  
  console.log(state)
  
  
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
                <AddIcon /> Add Interviewer
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
          Interviewer Details
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => setOpenDialog(false)}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <div className={classes.form}>
              <Grid
                container
                spacing={3}
                alignItems="flex-start"
                direction="row"
                justifyContent="stretch"
              >
                <Grid item xs={12}>
                  <div className={classes.form}>
                    <Grid container spacing={2}>
                    <Grid item xs={8}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="interviewerName"
                    name="interviewerName"
                    label="Interviewer Name"
                    value={state.interviewerName}
                    onChange={(e) =>
                      setState({ ...state, interviewerName: e.target.value })
                    }
                    error={!!errors.interviewerName}
                    helperText={errors.interviewerName}
                  />
                </Grid>
                     
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            {state.isUpdate ? (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleUpdateInterviewer}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSaveInterviewer}
                >
                  Create
                </Button>
              </>
            )}
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {rowdata && (
        <TablePlayground
          columnData={columnData}
          rowData={rowdata}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      )}

      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        onDelete={handleInterviewerDelete}
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

export default Interviewer;
