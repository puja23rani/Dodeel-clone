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
import { convertFromRaw, EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { FormLabel, Typography } from "@mui/material";

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

function Job_Create() {
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
    //   const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");
    
    const [dataEditorState, setEditorState] = useState();
  
    const onEditorStateChange = editorStateParam => {
      setEditorState(editorStateParam);
    };
  
    const columnData = [
        {
            id: "interviewerName",
            numeric: false,
            disablePadding: false,
            label: "Interviewer Name",
        },

        { id: "actions", label: "Action" },
    ];
    const [cusList, setCusList] = React.useState([]);
    const fetchJobs = async () => {
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

            // console.log(actualData);
            setCusList(actualData.recruitments);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchJobs();
    }, []);


    const handleCreateEMP = async () => {
        if (!validateFields()) return;
        try {
            const loginHeaders = new Headers();
            loginHeaders.append("Content-Type", "application/json");

            // Assuming you have an authorization token stored in localStorage
            const authToken = localStorage.getItem("token");
            if (authToken) {
                loginHeaders.append("Authorization", `Bearer ${authToken}`);
            }
            const data = {
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
            };
            const requestOptions = {
                method: "POST",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/auth/createJob`,
                requestOptions
            );
            const actualData = await res.json();
            console.log(actualData);
            // setVisaList(actualData.Country);
            if (actualData.status == 200) {
                setState((prevState) => ({
                    ...prevState,
                    jobTitle: "",
                    jobCategory: "",

                    jobDescription: EditorState.createEmpty(),
                    createStatus: "",
                    startDate: "",
                    // visa_id: visaId,
                    endDate: "",
                    skills: [],
                    resume: "",
                    customQuestionID: [],
                    customQuestion: [],
                }));
                navigate("/JobCreate_list");
            }
        } catch (err) {
            console.log(err);
        }
    };
    const handleUpdateCRM = async (id) => {
        if (!validateFields()) return;
        try {
            const loginHeaders = new Headers();
            loginHeaders.append("Content-Type", "application/json");

            // Assuming you have an authorization token stored in localStorage
            const authToken = localStorage.getItem("token");
            if (authToken) {
                loginHeaders.append("Authorization", `Bearer ${authToken}`);
            }

            const data = {
                id: id,
                jobTitle: state.jobTitle,
                jobCategory: state.jobCategory,
                // description: JSON.stringify(
                //   convertToRaw(state.description.getCurrentContent())
                // ),
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
            const requestOptions = {
                method: "PUT",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/auth/updateJob`,
                requestOptions
            );
            const actualData = await res.json();
            console.log(actualData);
            // setVisaList(actualData.Country);
            if (actualData.status == 200) {
                setState((prevState) => ({
                    ...prevState,
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
                    customQuestion: [],
                }));
                navigate("/JobCreate_list");
            }
        } catch (err) {
            console.log(err);
        }
    };

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
    const handleQuestionDelete = (questionToDelete) => () => {
        setState((prevState) => ({
            ...prevState,
            customQuestionID: prevState.customQuestionID.filter((id, index) => {
                return prevState.customQuestion[index] !== questionToDelete ? id : null;
            }),
            customQuestion: prevState.customQuestion.filter(
                (ques) => ques !== questionToDelete
            ),
        }));
    };

    const [validationErrors, setValidationErrors] = useState({});

    const validateFields = () => {
        const errors = {};
        if (!state.jobTitle) errors.jobTitle = "*Fill the Job Title";
        if (!state.jobCategory) errors.jobCategory = "*Enter Job category";
        if (!state.createStatus) errors.createStatus = "*Select status";
        if (!state.resume) errors.resume = "*Enter your resume Required or not!";
        if (!state.skills) errors.skills = "*Enter your Skills";
        if (!state.jobDescription) errors.jobDescription = "*Enter Job description";
        if (!state.startDate) errors.startDate = "*select start date of job Application";
        if (!state.endDate) errors.endDate = "*Select End Date of Job Application";
        if (!state.customQuestion) errors.customQuestion = "*Enter Custom Questions";

        setValidationErrors(errors);
        return Object.keys(errors)?.length === 0;
    };
    

   

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
                                     id="highlights-demo"
                                        select
                                        fullWidth
                                        variant="standard"
                                        label="Create Status"
                                        value={state.createStatus}
                                        onChange={(e, v, reason) => {
                                            if (reason === "clear") {
                                              setState({
                                                ...state,
                                                createStatus: null, // Set it to null when cleared
                                              });
                                            } else {
                                              setState({
                                                ...state,
                                                createStatus: v, // Set the selected object
                                              });
                                            }
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
                                    Job Description
                                    <Editor
                                        editorState={state.jobDescription}
                                        toolbarClassName="toolbarClassName"
                                        wrapperClassName="wrapperClassName"
                                        editorClassName="editorClassName"
                                    
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



            {/* <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        onDelete={handleInterviewerDelete}
      />
      <Popup
        open={open}
        message={message}
        onClose={handleClose}
        severity={severity} // You can change this to "error", "warning", etc.
      /> */}
        </>
    );
}

export default Job_Create;
