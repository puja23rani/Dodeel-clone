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

function Competenies() {
  const { classes } = useStyles();

  const [state, setState] = useState({
    id: "",
    typeOfCompetency: null,
    competencyName: "",
    isUpdate: false,
  });

  console.log(state);

  const [errors, setErrors] = useState({
    typeOfCompetency: null,
    competencyName: "",
  });

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.competencyName.trim()) {
      errors.competencyName = "CompetencyName Name is required";
      isValid = false;
    }

    if (state.typeOfCompetency == null) {
      errors.typeOfCompetency = "At least one Competency Type must be selected";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const [competenies, setCompetenies] = useState([]);
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
      id: "typeOfCompetency",
      numeric: false,
      disablePadding: false,
      label: "Department Name",
    },
    {
      id: "competencyName",
      numeric: false,
      disablePadding: false,
      label: "Competenies Name",
    },
    { id: "actions", label: "Action" },
  ];

  const getCompetenciesList = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getCompetencyDetails`,
        requestOptions
      );
      const actualData = await res.json();
      // console.log(actualData);

      if (actualData.status === 200) {
        setRowdata(
          actualData.competencies.map((item) => ({
            slNo: actualData.competencies.indexOf(item) + 1,
            id: item._id,
            typeOfCompetency: item.typeOfCompetency,
            competencyName: item.competencyName,
            actions: (
              <>
                <IconButton
                  aria-label="Edit"
                  onClick={(e) => {
                    setState({
                      id: item._id,
                      typeOfCompetency: {
                        title: item.typeOfCompetency,
                        id: item.competencyTypeID,
                      },
                      competencyName: item.competencyName,
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

  const getAllCompetencyType = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getCompetencyTypes`,
        requestOptions
      );
      const actualData = await res.json();
      // console.log(actualData);
      if (Array.isArray(actualData.competencyTypes)) {
        // Map the data to an array of objects with 'title' and 'id'
        const newobj = actualData.competencyTypes.map((item) => ({
          title: item.typeOfCompetency, // Set the title from channelName
          id: item._id, // Set the id from _id
        }));
        // console.log(newobj);
        // Update state with the new array of objects
        setCompetenies(newobj);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getCompetenciesList();
    getAllCompetencyType();
  }, []);

  const handleCreateCompetenies = async () => {
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
        competencyTypeID: state.typeOfCompetency.id,
        competencyName: state.competencyName,
      };
      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createCompetency`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setState({
          id: "",
          typeOfCompetency: [],
          competencyName: "",
          isUpdate: false,
        });
        setOpenDialog(false);
        setMessage("Saved successfully!");
        setOpen(true);
        setSeverity("success");
        getCompetenciesList();
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

  const handleUpdateCompetenies = async () => {
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
        typeOfCompetency: state.typeOfCompetency.title,
        competencyName: state.competencyName,
        competencyTypeID: state.typeOfCompetency.id,
      }
      // console.log(data);
      const requestOptions = {
        method: "PUT",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updateCompetency`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setState({
          typeOfCompetency: "",
          isUpdate: false,
        });
        setOpenDialog(false);
        setMessage("Updated successfully!");
        setOpen(true);
        setSeverity("success");
        getCompetenciesList();
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

  const handleDeleteCompetenies = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteCompetency`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setDeleteDialogOpen(false);
        setIdToDelete(null);
        getCompetenciesList();
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
      departmentId: "",
      typeOfCompetency: null,
      competencyName: "",
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
                <AddIcon /> Add Competenies
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
            Competenies
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
                <Autocomplete
                  sx={{
                    marginTop: "-16px"
                  }}
                  id="tags-standard"
                  options={competenies}
                  getOptionLabel={(option) => option.title || ""} // Safely access title
                  value={state.typeOfCompetency} // Ensure value is an object or null
                  onChange={(e, v) => {
                    // console.log(v);
                    setState({
                      ...state,
                      typeOfCompetency: v ? v : null, // Set campaignStatus to the selected object or null
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Campaign Status"
                      margin="normal"
                      variant="standard"
                      error={!!errors.typeOfCompetency} // Show error if it exists
                      helperText={errors.typeOfCompetency} // Display error message
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  sx={{
                    marginBottom: 2,
                  }}
                  variant="standard"
                  id="CompetencyName"
                  name="CompetencyName"
                  label="Competency Name"
                  value={state.competencyName}
                  onChange={(e) => {
                    const value = e.target.value;
                    const regex = /^[a-zA-Z\s]*$/;
                    const maxValue = 50
                    if (regex.test(value) && value.length <= maxValue) {
                      setState({ ...state, competencyName: value });
                    }
                  }}
                  error={!!errors.competencyName} // Show error if it exists
                  helperText={errors.competencyName} // Display error message
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
                  onClick={handleUpdateCompetenies}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateCompetenies}
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
          title="Competenies List"
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
        onDelete={handleDeleteCompetenies}
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

export default Competenies;
