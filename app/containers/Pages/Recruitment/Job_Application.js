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

function Job_Application() {
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
      errors.interviewerName = "Tnterviewer Name is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const [state, setState] = useState({
    jobTitle: "",
    jobCategory: "",
    jobDescription: EditorState.createEmpty(),
    createStatus: "",
    startDate: "",
    endDate: "",
    skills: [],
    resume: "",
    customQuestionID: [],
    customQuestion: [],
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
  const [cusList, setCusList] = React.useState([]);


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
    fetchJobCreate();
  }, []);

  const fetchJobCreate = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/auth/getAllJobs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.data) {

          setRowdata(
            response.data.data.map((item) => ({
              slNo: response.data.data.indexOf(item) + 1,
              id: item._id,
              jobTitle: item.jobTitle,
              jobCategory: item.jobCategory,
              // jobDescription: item.jobDescription,
              createStatus: item.createStatus,
              startDate: item.startDate.slice(0, 10),
              endDate: item.endDate.slice(0, 10),
              // skills: item.skills,
              resume: item.resume,
              // customQuestionID: item.customQuestionID,
              // customQuestion: item.customQuestion,
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
                        id: item._id,
                        jobTitle: item.jobTitle,
                        jobCategory: item.jobCategory,
                        jobDescription: item.jobDescription,
                        createStatus: item.createStatus,
                        startDate: item.startDate.slice(0, 10),
                        endDate: item.endDate.slice(0, 10),
                        skills: item.skills,
                        resume: item.resume,
                        customQuestionID: item.customQuestionID,
                        customQuestion: item.customQuestion, isUpdate: true,
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
  const handleSaveJobs = () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    if (state.jobTitle == "" ||
      state.jobCategory == "" ||
      state.jobDescription == "" ||
      state.createStatus == "" ||
      state.startDate == "" ||
      state.endDate == "" ||
      state.skills == "" ||
      state.resume == "" ||
      state.customQuestionID == "" ||
      state.customQuestion == "" 

    ) {
      toast.error("Fill all the information", {
        position: "top-center",
      });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/auth/createJob`,
          {

            jobTitle: state.jobTitle,
            jobCategory: state.jobCategory,

            jobDescription: JSON.stringify(
              convertToRaw(state.jobDescription.getCurrentContent())
            ),
            createStatus: state.createStatus,
            startDate: state.startDate,
            // visa_id: visaId,
            endDate: state.endDate,
            skills: state.skills,
            resume: state.resume,
            customQuestionID: state.customQuestionID,
            customQuestion: state.customQuestion,

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
            fetchJobCreate();
            window.scrollTo({
              top: 400,
              behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
            });
            setState({
              jobTitle: "",
              jobCategory: "",
              jobDescription: EditorState.createEmpty(),
              createStatus: "",
              startDate: "",
              endDate: "",
              skills: [],
              resume: "",
              customQuestionID: [],
              customQuestion: [],
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


  const handleJobsDelete = async () => {
    try {
      const data = { id: itemToDelete };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteJob`,
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
        fetchJobCreate();
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


  const handleUpdateJobs = () => {
    const requestData = {
      id: itemToDelete,
      jobTitle: state.jobTitle,
      jobCategory: state.jobCategory,
      jobDescription: JSON.stringify(
        convertToRaw(state.jobDescription.getCurrentContent())
      ),
      createStatus: state.createStatus,
      startDate: state.startDate,
      // visa_id: visaId,
      endDate: state.endDate,
      skills: state.skills.join(","),
      resume: state.resume,
      customQuestionID: state.customQuestionID,
      customQuestion: state.customQuestion,
    };

    console.log(requestData);

    if (state.interviewerName === "") {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
    } else {
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL}/api/auth/updateJob`,
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
            fetchJobCreate();

            // Scroll smoothly to the top
            window.scrollTo({
              top: 400,
              behavior: "smooth",
            });

            // Clear the form fields and reset isUpdate to false
            setState({
              ...state,
              jobTitle: "",
              jobCategory: "",
              // description: JSON.stringify(
              //   convertToRaw(state.description.getCurrentContent())
              // ),
              jobDescription: EditorState.createEmpty(),
              createStatus: "",
              startDate: "",
              // visa_id: visaId,
              endDate: "",
              skills: [],
              resume: "",
              customQuestionID: [],
              customQuestion: [], // Clear the interviewer name
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
      <PapperBlock title="Job Create Details" icon="library_books">
        <Grid container spacing={3} alignItems="center" direction="row" justifyContent="stretch">
          <Grid item xs={12}>
            <div className={classes.form}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Job Title"
                    value={state.jobTitle}
                    onChange={(e) =>
                      setState({
                        ...state,
                        jobTitle: e.target.value,
                      })
                    }
                  />
                  {validationErrors.jobTitle && (
                    <Typography color="error">
                      {validationErrors.jobTitle}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Job Category"
                    value={state.jobCategory}
                    onChange={(e) =>
                      setState({
                        ...state,
                        jobCategory: e.target.value,
                      })
                    }
                  />
                  {validationErrors.jobCategory && (
                    <Typography color="error">
                      {validationErrors.jobCategory}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    variant="standard"
                    label="Create Status"
                    value={state.createStatus}
                    onChange={(e) =>
                      setState({
                        ...state,
                        createStatus: e.target.value,
                      })
                    }
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value={"Active"}>Active</option>
                    <option value={"Inactive"}>Inactive</option>
                  </TextField>
                  {validationErrors.createStatus && (
                    <Typography color="error">
                      {validationErrors.createStatus}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    variant="standard"
                    label="Resume"
                    value={state.resume}
                    onChange={(e) =>
                      setState({
                        ...state,
                        resume: e.target.value,
                      })
                    }
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value={"Required"}>Required</option>
                    <option value={"Not required"}>Not required</option>
                  </TextField>
                  {validationErrors.resume && (
                    <Typography color="error">
                      {validationErrors.resume}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Type a skill and press Enter"
                    value={state.inputSkill}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                  <div style={{ marginTop: 10 }}>
                    {state.skills?.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={handleSkillDelete(skill)}
                        style={{ marginRight: 10, marginBottom: 10 }}
                      />
                    ))}
                    {validationErrors.skills && (
                      <Typography color="error">
                        {validationErrors.skills}
                      </Typography>
                    )}
                  </div>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    variant="standard"
                    label="Custom Question"
                    value={state.customQuestion}
                    onChange={(e) => {
                      const selectedDept = cusList.find(
                        (item) => item.customQuestion === e.target.value
                      );
                      if (!state.customQuestionID.includes(selectedDept._id)) {
                        setState({
                          ...state,
                          customQuestion: [...state.customQuestion, e.target.value],
                          customQuestionID: [
                            ...state.customQuestionID,
                            selectedDept._id ? selectedDept._id : null,
                          ],
                        });
                      }
                    }}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    {cusList?.map((item) => (
                      <option key={item._id} value={item.customQuestion}>
                        {item.customQuestion}
                      </option>
                    ))}
                  </TextField>
                  {validationErrors.customQuestion && (
                    <Typography color="error">
                      {validationErrors.customQuestion}
                    </Typography>
                  )}
                  <div style={{ marginTop: 10 }}>
                    {state.customQuestion?.map((ques, index) => (
                      <Chip
                        key={index}
                        label={ques}
                        onDelete={handleQuestionDelete(ques)}
                        style={{ marginRight: 10, marginBottom: 10 }}
                      />
                    ))}
                  </div>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    type="date"
                    label="Job Application Start"
                    value={state.startDate}
                    onChange={(e) =>
                      setState({
                        ...state,
                        startDate: e.target.value,
                      })
                    }
                  />
                  {validationErrors.startDate && (
                    <Typography color="error">
                      {validationErrors.startDate}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    type="date"
                    label="Job Application End"
                    value={state.endDate}
                    onChange={(e) =>
                      setState({
                        ...state,
                        endDate: e.target.value,
                      })
                    }
                  />
                  {validationErrors.endDate && (
                    <Typography color="error">
                      {validationErrors.endDate}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography>Job Description</Typography>
                  <Editor
                    editorState={state.jobDescription}
                    onEditorStateChange={(e) =>
                      setState({
                        ...state,
                        jobDescription: e,
                      })
                    }
                  />
                  {validationErrors.jobDescription && (
                    <Typography color="error">
                      {validationErrors.jobDescription}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Grid container justifyContent="flex-end">
                    {state.isUpdate ? (
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleUpdateCRM(state.id)}
                      >
                        Update
                      </Button>
                    ) : (
                      <Button variant="contained" onClick={handleCreateEMP}>
                        Create
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </PapperBlock>

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

export default Job_Application;
