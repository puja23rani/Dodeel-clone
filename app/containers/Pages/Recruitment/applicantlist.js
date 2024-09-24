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
import { Avatar, Chip, Dialog, DialogActions, DialogTitle, Paper, Toolbar, Tooltip, Typography } from "@mui/material";
import { DialogContent } from "@mui/material";
import { Close as CloseIcon, Visibility } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Editor, EditorState } from 'react-draft-wysiwyg';
import { convertToRaw } from "draft-js";
import { useLocation } from "react-router-dom";
import { Fragment } from "react";
import { MaterialDropZone } from 'enl-components';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Navigate, useNavigate } from "react-router-dom";
import InfoIcon from '@mui/icons-material/Info';
import { storage } from "../../../../firebase.config";


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

function Applicantlist() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");
  // const defaultData = {
  //   Status: "",
  //   Description: "",
  // };

  const [errors, setErrors] = useState({
    jobID: "",
    jobTitle: "",
    applicantName: "",

    // jobDescription: EditorState.createEmpty(),
    phoneNumber: "",
    email: "",
    recentCertification: "",
    resume: "",
    customQuestionID: [],
    customQuestion: [],
    answers: {},
    interviewerID: "",
    interviewerName: "",
    startDate: "",
    endDate: "",
    interviewStatus: "",
    feedback: "",

  });

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.jobTitle) {
      errors.jobTitle = "Job Title is required";
      isValid = false;
    }
    // if (!state.jobTitle.trim()) {
    //   errors.jobTitle = "Job Title is required";
    //   isValid = false;
    // }
    if (!state.applicantName) {
      errors.applicantName = "Applicant Name is required";
      isValid = false;
    }
    if (!state.phoneNumber && state.phoneNumber.length !== 10) {
      errors.phoneNumber = "Phone Number must be 10 digits";
      isValid = false;
    }

    if (!state.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }
    if (!state.feedback) {
      errors.feedback = "Feedback is required";
      isValid = false;
    }
    if (!state.interviewStatus) {
      errors.interviewStatus = "Interview Status is required";
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
    if (!state.interviewerName) {
      errors.interviewerName = "Interviewer Name is required";
      isValid = false;
    }
    // if (!state.resume.trim()) {
    //   errors.resume = "Resume is required";
    //   isValid = false;
    // }
    // if (!state.recentCertification.trim()) {
    //   errors.recentCertification = "Recent Certification File is required";
    //   isValid = false;
    // }
    // if (!state.customQuestion) {
    //   errors.customQuestion = "Custom Question is required";
    //   isValid = false;
    // }

    setErrors(errors);
    return isValid;
  };

  const [state, setState] = useState({
    jobID: "",
    jobTitle: "",
    applicantName: "",

    // jobDescription: EditorState.createEmpty(),
    phoneNumber: "",
    email: "",
    recentCertification: "",
    resume: "",
    customQuestionID: [],
    customQuestion: [],
    answers: {},
    interviewerID: "",
    interviewerName: "",
    startDate: "",
    endDate: "",
    interviewStatus: "",
    feedback: "",
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
  const location = useLocation();
  const navigate = useNavigate();

  // const { updateId } = location.state || {};
  const { jobID } = location.state || {};


  const [selectedJob, setSelectedJob] = React.useState(null);
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
      id: "applicantName",
      numeric: false,
      disablePadding: false,
      label: "Applicant Name",
    },
    {
      id: "phoneNumber",
      numeric: false,
      disablePadding: false,
      label: "Phone Number",
    },
    {
      id: "email",
      numeric: false,
      disablePadding: false,
      label: "Email",
    },
    {
      id: "startDate",
      numeric: false,
      disablePadding: false,
      label: "Date Of Job Application",
    },
    {
      id: "interviewerName",
      numeric: false,
      disablePadding: false,
      label: "Interviewer",
    },
    {
      id: "interviewStatus",
      numeric: false,
      disablePadding: false,
      label: "Interview Status",
    },

    { id: "actions", label: "Action" },
  ];

  useEffect(() => {
    table2();
    table1();

  }, []);

  const [interviewerList, setInterviewerList] = React.useState([]);
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllInterviewers`,
        requestOptions
      );
      const actualData = await res.json();
      if (Array.isArray(actualData.interviewers)) {
        const newobj = actualData.interviewers.map((item) => ({
          title: item.interviewerName, // Set the title from channelName
          id: item._id, // Set the id from _id
        }));
        setInterviewerList(newobj);
      }
    } catch (err) {
      //console.log(err);
    }
  };
  const [customQuestionList, setCustomQuestionList] = React.useState([]);
  const table2 = () => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getJobById`,
        { id: jobID },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setCustomQuestionList(
            response.data.data.customQuestionID,
          );
        } else {
          toast.error("Failed to save. Please try again.", {
            position: "top-center",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("An error occurred. Please try again.", {
          position: "top-center",
        });
      });
  };

  const [isLoading, setisLoading] = useState(false)
  const handleFilesChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setisLoading(true);
      const imageRef = ref(storage, `/photo/${file.name}`);
      uploadBytes(imageRef, file).then(() => {
        getDownloadURL(imageRef).then(url => {
          // console.log(url);
          setState(prevState => ({
            ...prevState,
            [field]: url
          }));
          setisLoading(false);
        });
      });
    }
  };

  function fetchJobApp(pg) {
    axios
      .post(

        `${process.env.REACT_APP_BASE_URL}/api/auth/getJobApplicationsByJobId`,
        {
          jobID: jobID,
          pageNumber: pg,
          pageSize: rowsPerPage,
        }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.data) {
          setState({ ...state, jobTitle: response.data.job.jobTitle ?? 'No job title' })

          setRowdata(
            response.data.data.map((item) => ({
              slNo: response.data.data.indexOf(item) + 1,
              id: item._id,
              jobTitle: item.jobID.jobTitle,
              applicantName: item.applicantData.applicantName,
              phoneNumber: item.applicantData.phoneNumber,
              email: item.applicantData.email,
              startDate: item.interviewerDetails.startDate.slice(0, 10),
              interviewerName: item.interviewerDetails.interviewerName,
              interviewStatus: item.interviewerDetails.interviewStatus,

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
                        jobID: item.jobID._id,
                        jobTitle: item.jobID.jobTitle,
                        applicantName: item.applicantData.applicantName,
                        phoneNumber: item.applicantData.phoneNumber,
                        email: item.applicantData.email,
                        recentCertification: item.applicantData.recentCertification,
                        resume: item.applicantData.resume,
                        customQuestionID: item.customQuestion.customQuestionID,
                        customQuestion: item.customQuestion.customQuestion,
                        answers: item.customQuestion.answer,
                        startDate: item.interviewerDetails.startDate.slice(0, 10),
                        endDate: item.interviewerDetails.endDate.slice(0, 10),
                        interviewerName: { title: item.interviewerDetails.interviewerName },
                        interviewStatus: {
                          title: item.interviewerDetails.interviewStatus
                        },
                        interviewerID: item.interviewerDetails.interviewerID,
                        feedback: item.interviewerDetails.feedback,
                        isUpdate: true,
                      });
                      setCustomQuestionList(item.customQuestion ? item.customQuestion : customQuestionList)
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
                    }}
                  >
                    <DeleteIcon color={"primary"} />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    onClick={(e) => {
                      navigate("/app/applicantview", {
                        state: {
                          jobID: item
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
          setLength(response.data.totalItems);
          setPagination(true);
        }
        // setState({
        //   ...state,
        //   jobTitle: response.data.data.jobID.jobTitle,
        // })
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchJobApp(page);
  }, [page, rowsPerPage]);




  const handleSaveJobApp = () => {
    var st = state.customQuestion?.map((question) => ({
      customQuestionID: question._id,
      answer: question.answer,

    }))

    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }


    else {
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/auth/createJobApplication`,

          {

            jobID: jobID,
            applicantData: {
              applicantName: state.applicantName,
              resume:
                state.resume,
              phoneNumber: parseInt(state.phoneNumber),
              email: state.email,
              recentCertification:
                state.recentCertification,
            },
            // customQuestion: state.customQuestion?.map((question) => ({
            //   customQuestionID: question._id,
            //   answer: question.answer,
            // })),
            interviewerDetails: {
              interviewerID: state.interviewerID,
              startDate: state.startDate,
              endDate: state.endDate,
              interviewStatus: state.interviewStatus.title,

              feedback: state.feedback,

            },

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
            fetchJobApp();
            window.scrollTo({
              top: 400,
              behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
            });
            setState((prevState) => ({
              ...prevState,
              // jobTitle: "",
              applicantName: "",

              // jobDescription: EditorState.createEmpty(),
              phoneNumber: "",
              email: "",
              recentCertification: "",
              resume: "",
              customQuestionID: [],
              customQuestion: [],
              answer: {},
              interviewerID: "",
              interviewerName: "",
              startDate: "",
              endDate: "",
              interviewStatus: "",
              feedback: "",
              isUpdate: false,
            }));
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


  const handleJobsAppDelete = async () => {
    try {
      const data = { id: itemToDelete };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteJobApplication`,
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
        fetchJobApp();
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


  const handleUpdateJobApp = () => {
    const requestData = {
      id: itemToDelete,

      jobID: state.jobID,
      applicantData: {
        applicantName: state.applicantName,
        resume:
          state.resume,
        phoneNumber: parseInt(state.phoneNumber),
        email: state.email,
        recentCertification:
          state.recentCertification,
      },
      // customQuestion: transformedQuestions,
      customQuestion: customQuestionList?.map((question) => ({
        customQuestionID: question.customQuestionID,
        answer: question.answer,
      })),
      interviewerDetails: {
        interviewerID: state.interviewerID,
        startDate: state.startDate,
        endDate: state.endDate,
        interviewStatus: state.interviewStatus.title,

        feedback: state.feedback,

      },
    };

    console.log(requestData);

    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }

    //    {
    //   setMessage("Please fill all required fields");
    //   setOpen(true);
    //   setSeverity("warning");
    // }
    else {
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL}/api/auth/updateJobApplication`,
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
            fetchJobApp();

            // Scroll smoothly to the top
            window.scrollTo({
              top: 400,
              behavior: "smooth",
            });

            // Clear the form fields and reset isUpdate to false

            setState((prevState) => ({
              ...prevState,
              applicantName: "",

              // jobDescription: EditorState.createEmpty(),
              phoneNumber: "",
              email: "",
              recentCertification: "",
              resume: "",
              // customQuestionID: [],
              // customQuestion: [],
              answer: {},
              interviewerID: "",
              interviewerName: "",
              startDate: "",
              endDate: "",
              interviewStatus: "",
              feedback: "",
              id: "", // Reset the id
              isUpdate: false, // Set isUpdate to false
            }));

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
      jobID: "",
      jobTitle: "",
      applicantName: "",
      phoneNumber: "",
      email: "",
      recentCertification: "",
      resume: "",
      customQuestionID: [],
      customQuestion: [],
      answers: {},
      interviewerID: "",
      interviewerName: "",
      startDate: "",
      endDate: "",
      interviewStatus: "",
      feedback: "",
      isUpdate: false,
    });
    setErrors({
      jobID: "",
      jobTitle: "",
      applicantName: "",
      phoneNumber: "",
      email: "",
      recentCertification: "",
      resume: "",
      customQuestionID: [],
      customQuestion: [],
      answers: {},
      interviewerID: "",
      interviewerName: "",
      startDate: "",
      endDate: "",
      interviewStatus: "",
      feedback: "",
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
                <AddIcon /> Add Applicants
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
            Applicants Details
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
                    id="applicantName"
                    name="applicantName"
                    label="Applicant Name"
                    value={state.applicantName}
                    // onChange={(e) => {
                    //   const regex = /^[a-zA-Z\s]*$/; // Allow only letters and spaces
                    //   if (regex.test(e.target.value)) {
                    //     setState({ ...state, campaignName: e.target.value });
                    //   }
                    // }}
                    onChange={(e) =>
                      setState({
                        ...state,
                        applicantName: e.target.value,
                      })
                    }
                    error={!!errors.applicantName} // Show error if it exists
                    helperText={errors.applicantName} // Display error message
                  />
                </Grid>



                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    value={state.phoneNumber}
                    onChange={(e) => {
                      const input = e.target.value;
                      const validInput = input
                        .replace(/[^0-9]/g, "")
                        .slice(0, 10);
                      setState({
                        ...state,
                        phoneNumber: validInput,
                      });
                    }}
                    error={!!errors.phoneNumber} // Show error if it exists
                    helperText={errors.phoneNumber} // Display error message
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="standard"
                    id="email"
                    name="email"
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





                <Grid item xs={6} sx={{ width: "100%" }}>
                  <TextField
                    id="date"
                    label="Interview Start Date"
                    type="date"
                    variant="standard"
                    defaultValue={state.startDate}
                    sx={{ width: "100%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => setState({ ...state, startDate: e.target.value })}
                  />
                </Grid>

                <Grid item xs={6} sx={{ width: "100%" }}>
                  <TextField
                    id="date"
                    label="Interview End Date"
                    type="date"
                    variant="standard"
                    defaultValue={state.endDate}
                    sx={{ width: "100%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => setState({ ...state, endDate: e.target.value })}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Autocomplete
                    sx={{
                      marginTop: "-16px"
                    }}
                    id="tags-standard"
                    options={interviewerList}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    value={state.interviewerName} // Ensure value is an object or null
                    onChange={(e, v) => {
                      // const selectedinterviewIds = v.map((item) => item.id);
                      // console.log(v);
                      setState({
                        ...state,
                        interviewerName: v ? v : null, // Set campaignStatus to the selected object or null
                        interviewerID: v.id,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Interviewer Name"
                        margin="normal"
                        variant="standard"
                        error={!!errors.interviewerName} // Show error if it exists
                        helperText={errors.interviewerName} // Display error message
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
                      { title: "Applied" },
                      { title: "Viewed" },
                      { title: "Verified" },
                      { title: "Rejected" },
                      { title: "Selected" },

                    ]}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    value={state.interviewStatus} // Ensure value is an object or null
                    onChange={(e, v) => {
                      setState({
                        ...state,
                        interviewStatus: v ? v : null, // Set campaignStatus to the selected object or null
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Interview Status"
                        margin="normal"
                        variant="standard"
                        error={!!errors.interviewStatus} // Show error if it exists
                        helperText={errors.interviewStatus} // Display error message
                      />
                    )}
                  />
                </Grid>
                {/* <Grid item xs={6}>
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={customQuestionList}
                    value={state.customQuestion}
                    // isOptionEqualToValue={(option, value) =>
                    //   option.id === value.id
                    // }
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
                </Grid> */}
                {/* {state.customQuestion ? (
                  state.customQuestion?.map((ch, idx) => (
                    <Grid item xs={6} key={idx}>
                      <Autocomplete
                        freeSolo
                        options={[]} // You can pass predefined options if any
                        inputValue={ch.answer || ''}
                        onInputChange={(event, newInputValue) => {
                          const updatedCustomQuestion = [...state.customQuestion];
                          updatedCustomQuestion[idx].answer = newInputValue;
                          setState({
                            ...state,
                            customQuestion: updatedCustomQuestion,
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={ch.customQuestion}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                  ))
                ) : (
                  <p>No</p>
                )}
 */}


                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="jobDescription"
                    name="jobDescription"
                    label="Job Description"
                    value={state.feedback}
                    // onChange={(e) => {
                    //   const regex = /^[a-zA-Z\s]*$/; // Allow only letters and spaces
                    //   if (regex.test(e.target.value)) {
                    //     setState({ ...state, campaignName: e.target.value });
                    //   }
                    // }}
                    onChange={(e) =>
                      setState({
                        ...state,
                        feedback: e.target.value,
                      })
                    }
                    error={!!errors.feedback} // Show error if it exists
                    helperText={errors.feedback} // Display error message
                  />
                </Grid>


                <Grid item md={6} xs={12}>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <Grid sx={{ width: "50%", paddingTop: "28px" }}>
                      <Typography variant="body2">Education Certificate</Typography>
                    </Grid>
                    <Grid sx={{ paddingTop: "28px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <label
                          style={{
                            cursor: 'pointer',
                            position: 'relative',
                            width: '100%',
                            overflow: 'hidden',
                            borderRadius: '0.75rem', // Equivalent to rounded-xl
                            border: '1px solid #27282C',
                            backgroundColor: 'white',
                            fontWeight: '500', // Equivalent to font-medium
                            color: '#27282C',
                            fontSize: "12px",
                            padding: "10px"
                          }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFilesChange(e, "recentCertification")}
                            style={{
                              display: 'none', // Equivalent to hidden
                            }}
                          />
                          Click to upload photo
                        </label>
                        {state.recentCertification && (
                          <img src={state.recentCertification} alt="..." width={64} height={64} style={{ marginTop: "10px" }} />
                        )}
                      </div>
                    </Grid>
                  </div>
                </Grid>
                <Grid item md={6} xs={12}>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <Grid sx={{ width: "50%", paddingTop: "28px" }}>
                      <Typography variant="body2">Resume File</Typography>
                    </Grid>
                    <Grid sx={{ paddingTop: "28px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <label
                          style={{
                            cursor: 'pointer',
                            position: 'relative',
                            width: '100%',
                            overflow: 'hidden',
                            borderRadius: '0.75rem', // Equivalent to rounded-xl
                            border: '1px solid #27282C',
                            backgroundColor: 'white',
                            fontWeight: '500', // Equivalent to font-medium
                            color: '#27282C',
                            fontSize: "12px",
                            padding: "10px"
                          }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFilesChange(e, "resume")}
                            style={{
                              display: 'none', // Equivalent to hidden
                            }}
                          />
                          Click to upload photo
                        </label>
                        {state.resume && (
                          <img src={state.resume} alt="..." width={64} height={64} style={{ marginTop: "10px" }} />
                        )}
                      </div>
                    </Grid>
                  </div>
                </Grid>

                {state.isUpdate && customQuestionList && (
                  customQuestionList?.map((ch, idx) => (
                    <Grid item xs={6} key={idx} style={{display: "flex" , flexDirection: "column"}}>
                      
                      <TextField
                       variant="standard"
                      label={`${idx + 1}. ${ch.customQuestion}`}
                        value={ch.answer ?? ''}
                        onChange={(e) => {

                          setCustomQuestionList((prev) => {
                            var temp = prev;
                            temp[idx].answer = e.target.value;
                            return [...temp];
                          })
                        }}
                      />
                    </Grid>
                  ))
                )}

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
                  onClick={handleUpdateJobApp}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSaveJobApp}
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
          title="Applicant List"
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
        onDelete={handleJobsAppDelete}
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

export default Applicantlist;
