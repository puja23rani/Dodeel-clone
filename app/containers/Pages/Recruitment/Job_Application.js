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
import { Chip, Dialog, DialogActions, DialogTitle, Paper, Toolbar, Tooltip, Typography } from "@mui/material";
import { DialogContent } from "@mui/material";
import { Close as CloseIcon, Visibility } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Editor, EditorState } from 'react-draft-wysiwyg';
import { convertToRaw } from "draft-js";
import InfoIcon from '@mui/icons-material/Info';
import { Navigate, useNavigate } from "react-router-dom";




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
    jobTitle: "",
    jobCategory: "",
    jobDescription: "",
    createStatus: "",
    startDate: "",
    endDate: "",
    skills: "",
    resume: "",
    customQuestionID: "",
    customQuestion: "",
  });
  console.log(errors)

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.jobTitle) {
      errors.jobTitle = "Job Title is required";
      isValid = false;
    }
    if (!state.jobCategory) {
      errors.jobCategory = "Job Category is required";
      isValid = false;
    }
    if (!state.jobDescription) {
      errors.jobDescription = "Job Description is required";
      isValid = false;
    }
    if (!state.createStatus) {
      errors.createStatus = "Create Status is required";
      isValid = false;
    }
    if (!state.startDate) {
      errors.startDate = "Start Date is required";
      isValid = false;
    }
    if (!state.endDate) {
      errors.endDate = "End Date is required";
      isValid = false;
    }
    if (!state.inputSkill) {
      errors.inputSkill = "Skills is required";
      isValid = false;
    }
    if (!state.resume) {
      errors.resume = "Resume is required";
      isValid = false;
    }
    if (state.customQuestion.length == 0) {
      errors.customQuestion = "Custom Question is required";
      isValid = false;
    }


    setErrors(errors);
    console.log(isValid)

    return isValid;
  };



  const [state, setState] = useState({
    jobTitle: "",
    jobCategory: "",
    jobDescription: "",
    createStatus: null,
    startDate: "",
    endDate: "",
    skills: [],
    resume: null,
    customQuestionID: [],
    customQuestion: [],
    searchText: "",
    isUpdate: false,
  });
  const [rowdata, setRowdata] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [pagination, setPagination] = useState(false);
  const [length, setLength] = useState(0);
  const navigate = useNavigate();



  const [dataEditorState, setEditorState] = useState();

  const onEditorStateChange = editorStateParam => {
    setEditorState(editorStateParam);
  };



  const columnData = [
    {
      id: "slNo",
      numeric: true,
      disablePadding: false,
      label: "Sl No",
    },
    {
      id: "jobTitle",
      numeric: false,
      disablePadding: false,
      label: "Job Title",
    },
    {
      id: "jobCategory",
      numeric: false,
      disablePadding: false,
      label: "Job Category",
    },
    {
      id: "createStatus",
      numeric: false,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "startDate",
      numeric: false,
      disablePadding: false,
      label: "Start Date",
    },
    {
      id: "endDate",
      numeric: false,
      disablePadding: false,
      label: "End Date",
    },
    {
      id: "resume",
      numeric: false,
      disablePadding: false,
      label: "Resume",
    },

    { id: "actions", label: "Action" },
  ];

  useEffect(() => {

    table1();
  }, []);

  const [customQuestionList, setCustomQuestionList] = React.useState([]);
  const table1 = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getRecruitments`,
        requestOptions
      );
      const actualData = await res.json();
      if (Array.isArray(actualData.recruitments)) {
        const newobj = actualData.recruitments.map((item) => ({
          title: item.customQuestion, // Set the title from channelName
          id: item._id, // Set the id from _id
        }));
        setCustomQuestionList(newobj);
      }
    } catch (err) {
      //console.log(err);
    }
  };




  function fetchJobCreate(pg) {
    axios
      .post(

        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllJobs`,
        {
          pageNumber: pg,
          pageSize: rowsPerPage,
        }, {
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
                        createStatus: {
                          title: item.createStatus
                        },

                        startDate: item.startDate.slice(0, 10),
                        endDate: item.endDate.slice(0, 10),
                        skills: item.skills,
                        resume: {
                          title: item.resume
                        },
                        customQuestionID: item.customQuestionID.map((cus) => cus._id),
                        customQuestion: item.customQuestionID.map((cus) => ({
                          title: cus.customQuestion,
                          id: cus.id,
                        })), // Format employeeName as [{ title, id }]
                        // customQuestionID: item.customQuestionID,
                        // customQuestion: item.customQuestion, 
                        isUpdate: true,
                      });
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon color={"primary"} />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    onClick={() => {
                      setItemToDelete(item._id);
                      setDeleteDialogOpen(true);
                      setSelectedJob(job);
                    }}
                  >
                    <DeleteIcon color={"primary"} />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    // onClick={() => {
                    //   setItemToDelete(item._id);
                    //   setDeleteDialogOpen(true);
                    // }}
                    onClick={(e) => {
                      navigate("/app/applicantlist", {
                        state: { jobID: item._id },
                      });
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    // onClick={() => {
                    //   setItemToDelete(item._id);
                    //   setDeleteDialogOpen(true);
                    // }}
                    onClick={(e) => {
                      navigate("/app/jobview", {
                        state: {
                          jobID: item,


                        },
                      });
                    }}
                  >
                    <Visibility />
                  </IconButton>
                </>
              ),
            }))
          );
          setLength(response.data.totalJobs);
          setPagination(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchJobCreate(page);
  }, [page, rowsPerPage]);

  const handleSaveJobs = () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    else {
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/auth/createJob`,
          {

            jobTitle: state.jobTitle,
            jobCategory: state.jobCategory,

            jobDescription: state.jobDescription,

            createStatus: state.createStatus.title,
            startDate: state.startDate,
            // visa_id: visaId,
            endDate: state.endDate,
            skills: state.skills,
            resume: state.resume.title,
            customQuestionID: state.customQuestionID,
            // customQuestion: state.customQuestion,

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
              jobDescription: "",
              createStatus: "",
              startDate: "",
              endDate: "",
              skills: [],
              resume: "",
              customQuestionID: [],
              customQuestion: [],
              isUpdate: false,
            });
            setMessage("Created Sucessfully!");
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
      jobDescription: state.jobDescription,

      createStatus: state.createStatus.title,
      startDate: state.startDate,
      // visa_id: visaId,
      endDate: state.endDate,
      skills: state.skills.join(","),
      resume: state.resume.title,
      customQuestionID: state.customQuestionID,

    };

    console.log(requestData);

    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
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
              jobDescription: "",
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

  const handleInputChange = (e) => {
    setState({
      ...state,
      inputSkill: e.target.value,
    });
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && state.inputSkill.trim()) {
      setState({
        ...state,
        skills: [...state.skills, state.inputSkill.trim()],
        inputSkill: "",
      });
    } else if (e.key === "Backspace" && !state.inputSkill) {
      setState({
        ...state,
        skills: state.skills.slice(0, -1),
      });
    }
  };
  const handleSkillDelete = (skillToDelete) => () => {
    setState((prevState) => ({
      ...prevState,
      skills: prevState.skills.filter((skill) => skill !== skillToDelete),
    }));
  };


  const handlePageChange = (event, newPage) => {
    setPage(newPage); // Update the current page
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update the rows per page
    setPage(0); // Reset to first page
  };

  const handleClear = () => {

    setState({
      jobTitle: "",
      jobCategory: "",
      jobDescription: "",
      createStatus: "",
      startDate: "",
      endDate: "",
      skills: [],
      resume: "",
      customQuestionID: [],
      customQuestion: [],
      isUpdate: false,
    });
    setErrors({
      jobTitle: "",
      jobCategory: "",
      jobDescription: "",
      createStatus: "",
      startDate: "",
      endDate: "",
      skills: "",
      resume: "",
      customQuestionID: "",
      customQuestion: "",
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
                <AddIcon /> Add Job
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
            Job Details
          </DialogTitle>
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
          <DialogContent className={classes.dialogContent}>
            <div className={classes.form}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="jobTitle"
                    name="jobTitle"
                    label="Job Title"
                    value={state.jobTitle}
                    // onChange={(e) => {
                    //   const regex = /^[a-zA-Z\s]*$/; // Allow only letters and spaces
                    //   if (regex.test(e.target.value)) {
                    //     setState({ ...state, campaignName: e.target.value });
                    //   }
                    // }}
                    onChange={(e) =>
                      setState({
                        ...state,
                        jobTitle: e.target.value,
                      })
                    }
                    error={!!errors.jobTitle} // Show error if it exists
                    helperText={errors.jobTitle} // Display error message
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="jobCategory"
                    name="jobCategory"
                    label="Job Category"
                    value={state.jobCategory}
                    // onChange={(e) => {
                    //   const regex = /^[a-zA-Z\s]*$/; // Allow only letters and spaces
                    //   if (regex.test(e.target.value)) {
                    //     setState({ ...state, campaignName: e.target.value });
                    //   }
                    // }}
                    onChange={(e) =>
                      setState({
                        ...state,
                        jobCategory: e.target.value,
                      })
                    }
                    error={!!errors.jobCategory} // Show error if it exists
                    helperText={errors.jobCategory} // Display error message
                  />
                </Grid>

                <Grid item xs={6}>
                  <Autocomplete
                    sx={{
                      marginTop: "-16px"
                    }}
                    id="highlights-demo"
                    options={[
                      { title: "Active" },
                      { title: "Inactive" },

                    ]}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    value={state.createStatus} // Ensure value is an object or null
                    onChange={(e, v) => {
                      setState({
                        ...state,
                        createStatus: v ? v : null, // Set campaignStatus to the selected object or null
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Create Status"
                        margin="normal"
                        variant="standard"
                        error={!!errors.createStatus} // Show error if it exists
                        helperText={errors.createStatus} // Display error message
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    sx={{
                      marginTop: "-16px"
                    }}
                    id="highlights-demo"
                    options={[
                      { title: "Required" },
                      { title: "Not required" },

                    ]}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    value={state.resume} // Ensure value is an object or null
                    onChange={(e, v) => {
                      setState({
                        ...state,
                        resume: v ? v : null, // Set campaignStatus to the selected object or null
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Resume"
                        margin="normal"
                        variant="standard"
                        error={!!errors.resume} // Show error if it exists
                        helperText={errors.resume} // Display error message
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="skills"
                    name="skills"
                    label="Skills"
                    value={state.inputSkill}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    error={!!errors.inputSkill} // Show error if it exists
                    helperText={errors.inputSkill}
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
                  </div>
                </Grid>

                <Grid item xs={6}>
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={customQuestionList}
                    value={state.customQuestion}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(e, v) => {
                      const selectedCustomquestionIds = v.map((item) => item.id);
                      setState({
                        ...state,
                        customQuestion: v, // Store selected objects
                        customQuestionID: selectedCustomquestionIds, // Store IDs
                      });
                    }}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Custom Question"

                        error={!!errors.customQuestion} // Show error if it exists
                        helperText={errors.customQuestion} // Display error message
                      />
                    )}
                  />
                </Grid>


                <Grid item xs={6} sx={{ width: "100%" }}>
                  <TextField
                    id="date"
                    label="Start Date"
                    type="date"
                    variant="standard"
                    defaultValue={state.startDate}
                    sx={{ width: "100%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => setState({ ...state, startDate: e.target.value })}
                    error={!!errors.startDate} // Show error if it exists
                    helperText={errors.startDate}
                  />
                </Grid>

                <Grid item xs={6} sx={{ width: "100%" }}>
                  <TextField
                    id="date"
                    label="End Date"
                    type="date"
                    variant="standard"
                    defaultValue={state.endDate}
                    sx={{ width: "100%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => setState({ ...state, endDate: e.target.value })}
                    error={!!errors.endDate} // Show error if it exists
                    helperText={errors.endDate}
                  />
                </Grid>
                {/* <Grid item xs={12}>
  <Typography variant="subtitle1" gutterBottom>
    Job Description
  </Typography>
  
  <Paper elevation={3} style={{ padding: '16px', marginTop: '8px' }}>
    
      <Editor
           editorState={state.jobDescription}
            editorClassName={classes.textEditor}
            toolbarClassName={classes.toolbarEditor}
            
            onEditorStateChange={(e) =>
        setState({
          ...state,
          jobDescription: e,
        })
      }
    />
  </Paper>
</Grid> */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="jobDescription"
                    name="jobDescription"
                    label="Job Description"
                    value={state.jobDescription}
                    // onChange={(e) => {
                    //   const regex = /^[a-zA-Z\s]*$/; // Allow only letters and spaces
                    //   if (regex.test(e.target.value)) {
                    //     setState({ ...state, campaignName: e.target.value });
                    //   }
                    // }}
                    onChange={(e) =>
                      setState({
                        ...state,
                        jobDescription: e.target.value,
                      })
                    }
                    error={!!errors.jobDescription} // Show error if it exists
                    helperText={errors.jobDescription} // Display error message
                  />
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
                  onClick={handleUpdateJobs}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSaveJobs}
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
          title="Job List"
          columnData={columnData}
          rowData={rowdata}
          pagination={pagination}
          component="div"
          count={length} // Total number of rows
          rowsPerPage={rowsPerPage} // Number of rows per page
          page={page} // Current page
          onPageChange={handlePageChange} // Handle page change
          onRowsPerPageChange={handleRowsPerPageChange} // Handle rows per page change
        />
      )}


      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        onDelete={handleJobsDelete}
      />
      <Popup
        open={open}
        message={message}
        onClose={handleClose}
        severity={severity} // You can change this to "error", "warning", etc.
      />
    </>
  );
};

export default Job_Application;