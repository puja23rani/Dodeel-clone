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
import { DialogActions, DialogTitle, Toolbar, Tooltip } from "@mui/material";
import { DialogContent } from "@mui/material";
import { Dialog } from "@mui/material";
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

function Custom_Question() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");
  // const defaultData = {
  //   Status: "",
  //   Description: "",
  // };
  const [errors, setErrors] = useState({
    Custom_Question: "",
    Required_or_Not: "",
  });

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.Custom_Question.trim()) {
      errors.Custom_Question = "Custom Question is required";
      isValid = false;
    }

    if (!state.Required_or_Not.title.trim()) {
      errors.Required_or_Not = "Requirements is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const [state, setState] = useState({
    CustomQuestion: "",
    Custom_Question: "",
    Required_or_Not: "",
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
      id: "Custom_Question",
      numeric: false,
      disablePadding: false,
      label: "Custom Question",
    },
    {
      id: "Required_or_Not",
      numeric: false,
      disablePadding: false,
      label: "Requirement",
    },
    { id: "actions", label: "Action" },
  ];

  useEffect(() => {
    fetchCustomQuestion();
  }, []);

  const fetchCustomQuestion = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/auth/getRecruitments`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.recruitments) {
          setRowdata(
            response.data.recruitments.map((item) => ({
              slNo: response.data.recruitments.indexOf(item) + 1,
              id: item._id,
              Custom_Question: item.customQuestion,
              Required_or_Not: item.requirement,
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
                        Custom_Question: item.customQuestion,
                        Required_or_Not: {
                          title: item.requirement
                        },
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
  const handleSaveCustomQuestion = () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    if (state.Custom_Question == "" ||
      state.Required_or_Not == ""
    ) {
      toast.error("Fill all the information", {
        position: "top-center",
      });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/auth/createRecruitment`,
          {

            customQuestion: state.Custom_Question,
            requirement: state.Required_or_Not.title,
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
            fetchCustomQuestion();
            window.scrollTo({
              top: 400,
              behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
            });
            setState({
              Custom_Question: "",
              Required_or_Not: "",
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
      }})
        .catch((error) => {
          setMessage(err.message);
          setOpen(true);
          setSeverity("error");
        });
    }
  };

  const handleCustomQuestionDelete = async () => {
    try {
      const data = { id: itemToDelete };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteRecruitment`,
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
        fetchCustomQuestion();
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

  const handleUpdateCustomQuestion = () => {
    console.log("hii from handleUpdateCustomQuestion")
    const requestData = {
      id: itemToDelete,
      customQuestion: state.Custom_Question,
      requirement: state.Required_or_Not.title,

    }
    console.log(requestData)

    if (state.Custom_Question == "" ||
      state.Required_or_Not == ""
    ) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
    } else {
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL}/api/auth/updateRecruitment`,
          requestData,
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
            fetchCustomQuestion();
            window.scrollTo({
              top: 400,
              behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
            });
            setState({
              Custom_Question: "",
              Required_or_Not: "",
              id: "",
              isUpdate: false,
            });

            setMessage("Updated successfully!");
            setOpen(true);
            setSeverity("success");
            setOpenDialog(false);
            // Navigate("/Department");
          } else {
            setMessage(actualData.message);
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
  console.log(state)

  const handleClear=()=>{
 
    setState({
      Custom_Question: "",
      Required_or_Not: "",
      isUpdate: false,
    });
    setErrors({
      Custom_Question: "",
      Required_or_Not: "",
    })
    setOpenDialog(false);
  
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
                <AddIcon /> Add Custom Question
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
          open={openDialog}
          onClose={handleClear}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
          Custom Question Details
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClear}
              sx={{
                position: "absolute",
                right: 12,
                top: 12,
                color: (theme) => theme.palette.grey[500],
              }}
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
                    <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="Custom_Question"
                    name="Custom_Question"
                    label="Custom Question"
                    value={state.Custom_Question}
                    onChange={(e) =>
                      setState({ ...state, Custom_Question: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    id="highlights-demo"
                    options={[
                      { title: "Required" },
                      { title: "Not Required" }
                    ]}
                    value={state.Required_or_Not}
                    onChange={(e, v, reason) => {
                      if (reason === "clear") {
                        setState({
                          ...state,
                          Required_or_Not: null, // Set it to null when cleared
                        });
                      } else {
                        setState({
                          ...state,
                          Required_or_Not: v, // Set the selected object
                        });
                      }
                    }}
                    getOptionLabel={(option) => option.title || ""} // Safely handle undefined option
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Requirement"
                        // margin="normal"
                        variant="standard"
                      />
                    )}
                    renderOption={(props, option, { inputValue }) => {
                      const matches = match(option.title, inputValue, { insideWords: true });
                      const parts = parse(option.title, matches);

                      return (
                        <li {...props}>
                          <div>
                            {parts.map((part, index) => (
                              <span
                                key={index}
                                style={{
                                  fontWeight: part.highlight ? 700 : 400,
                                }}
                              >
                                {part.text}
                              </span>
                            ))}
                          </div>
                        </li>
                      );
                    }}
                  />
                </Grid>
                     
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
          <Button onClick={handleClear} color="secondary">
              Close
            </Button>
            {state.isUpdate ? (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleUpdateCustomQuestion}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSaveCustomQuestion}
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
        title="Custom Question List"
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
        onDelete={handleCustomQuestionDelete}
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

export default Custom_Question;
