import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";
import {
    Autocomplete,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Icon,
    Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import AlertDialog from "../../../UiElements/demos/DialogModal/AlertDialog";
import TablePlayground from "../../../Tables/TablePlayground";
import Popup from "../../../../components/Popup/Popup";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../../firebase.config";

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

function Task() {
    const { classes } = useStyles();

    const [state, setState] = useState({
        id: "",
        taskName: "",
        taskDescription: "",
        taskDetails: "",
        taskStatus: null,
        startDate: "",
        endDate: "",
        employeeDetails: [],
        isUpdate: false,
        taskPhotos: [],
    });

    const [errors, setErrors] = useState({
    });

    const validate = () => {
        let isValid = true;
        let errors = {};

        if (!state.taskName.trim()) {
            errors.taskName = "Task Name is required";
            isValid = false;
        }

        if (!state.startDate.trim()) {
            errors.startDate = "Start Date is required";
            isValid = false;
        }

        if (!state.endDate.trim()) {
            errors.endDate = "End Date is required";
            isValid = false;
        }

        if (!state.taskDescription.trim()) {
            errors.taskDescription = "Task Description is required";
            isValid = false;
        }

        if (!state.taskDetails.trim()) {
            errors.taskDetails = "Task Details is required";
            isValid = false;
        }

        if (!state.taskStatus) {
            errors.taskStatus = "Task Status is required";
            isValid = false;
        }

        if (!state.employeeDetails.length) {
            errors.employeeDetails = "Employee Details is required";
            isValid = false;
        }

        if (!state.taskPhotos.length) {
            errors.taskPhotos = "Task Photos is required";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const [employees, setEmployees] = useState([]);

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
            id: "taskName",
            numeric: false,
            disablePadding: false,
            label: "Task Name",
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
            id: "employeeNames",
            numeric: false,
            disablePadding: false,
            label: "Employees",
        },
        {
            id: "taskStatus",
            numeric: false,
            disablePadding: false,
            label: "Task Status",
        },
        { id: "actions", label: "Action" },
    ];

    console.log(rowdata);
    console.log(state);

    const getTaskList = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/getTaskDetails`,
                requestOptions
            );
            const actualData = await res.json();
            console.log(actualData);

            if (actualData.status === 200) {
                setRowdata(
                    actualData.tasks.map((item) => ({
                        slNo: actualData.tasks.indexOf(item) + 1,
                        id: item._id,
                        taskName: item.taskName || "N/A",
                        startDate: item.startDate.split('T')[0] || "N/A",
                        endDate: item.endDate.split('T')[0] || "N/A",
                        employeeNames: item.employeeNames.map((emp, idx) => (
                            <div>
                                {emp}{item.employeeNames?.length - 1 != idx ? ", " : " "}
                            </div>
                        )) || "N/A",
                        taskStatus: item.taskStatus || "N/A",
                        actions: (
                            <>
                                <IconButton
                                    aria-label="Edit"
                                    onClick={(e) => {
                                        setState({
                                            id: item._id,
                                            taskName: item.taskName,
                                            taskDescription: item.taskDescription,
                                            taskDetails: item.taskDetails,
                                            taskStatus: item.taskStatus,
                                            taskPhotos: item.photos,
                                            employeeDetails: item.employeeID.map((empID, idx) => ({
                                                title: item.employeeNames[idx],
                                                id: empID,
                                            })),
                                            startDate: item.startDate.split('T')[0],
                                            endDate: item.endDate.split('T')[0],
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

    const getAllEmployeeType = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/getEmployeeDetails`,
                requestOptions
            );
            const actualData = await res.json();
            console.log(actualData);
            if (Array.isArray(actualData.employees)) {
                const newobj = actualData.employees.map((item) => ({
                    title: item.personalDetails.employeeName, // Set the title from channelName
                    id: item._id, // Set the id from _id
                }));
                setEmployees(newobj);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getTaskList();
        getAllEmployeeType();
    }, []);

    const handleCreateTask = async () => {
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
                "employeeID": state.employeeDetails.map((emp) => emp.id),
                "taskName": state.taskName,
                "taskDescription": state.taskDescription,
                "taskDetails": state.taskDetails,
                "startDate": state.startDate,
                "endDate": state.endDate,
                "photos": state.taskPhotos,
                "taskStatus": state.taskStatus
            };
            const requestOptions = {
                method: "POST",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/createTask`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setState({
                    id: "",
                    taskName: "",
                    taskDescription: "",
                    taskDetails: "",
                    taskStatus: null,
                    startDate: "",
                    endDate: "",
                    employeeDetails: [],
                    isUpdate: false,
                    taskPhotos: [],
                });
                setOpenDialog(false);
                setMessage("Saved successfully!");
                setOpen(true);
                setSeverity("success");
                getTaskList();
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

    const handleUpdateTask = async () => {
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
                "id": state.id,
                "employeeID": state.employeeDetails.map((emp) => emp.id),
                "taskName": state.taskName,
                "taskDescription": state.taskDescription,
                "taskDetails": state.taskDetails,
                "startDate": state.startDate,
                "endDate": state.endDate,
                "photos": state.taskPhotos,
                "taskStatus": state.taskStatus
            };
            // console.log(data);
            const requestOptions = {
                method: "PUT",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/updateTask`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setState({
                    id: "",
                    taskName: "",
                    taskDescription: "",
                    taskDetails: "",
                    taskStatus: null,
                    startDate: "",
                    endDate: "",
                    employeeDetails: [],
                    isUpdate: false,
                });
                setOpenDialog(false);
                setMessage("Updated successfully!");
                setOpen(true);
                setSeverity("success");
                getTaskList();
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

    const handleDeleteTask = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/deleteTask`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setDeleteDialogOpen(false);
                setIdToDelete(null);
                getTaskList();
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
            taskName: "",
            taskDescription: "",
            taskDetails: "",
            taskStatus: null,
            startDate: "",
            endDate: "",
            employeeDetails: [],
            isUpdate: false,
        })
        setErrors({

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

    const [isLoading, setisLoading] = useState(false)

    const handleFilesChange = async (e) => {
        const files = Array.from(e.target.files); // This will now contain multiple files
        if (files.length > 0) {
            setisLoading(true);
            try {
                const urls = await Promise.all(
                    files.map(async (file) => {
                        const imageRef = ref(storage, `/photo/${file.name}`);
                        await uploadBytes(imageRef, file);
                        const url = await getDownloadURL(imageRef);
                        console.log(url);
                        return url;
                    })
                );
                console.log(urls);
                setState({
                    ...state,
                    taskPhotos: urls,
                });
            } catch (error) {
                console.error("Error uploading files:", error);
            } finally {
                setisLoading(false);
            }
        }
    };

    console.log(state);

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
                                <AddIcon /> Add Task
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
                        Task
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
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="taskName"
                                    name="taskName"
                                    label="Task Name"
                                    value={state.taskName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        const maxValue = 50
                                        if (regex.test(value) && value.length <= maxValue) {
                                            setState({ ...state, taskName: e.target.value });
                                        }
                                    }}
                                    error={!!errors.taskName} // Show error if it exists
                                    helperText={errors.taskName} // Display error message
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="taskDescription"
                                    name="taskDescription"
                                    label="Task Short Description"
                                    value={state.taskDescription}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        const maxValue = 50
                                        if (regex.test(value) && value.length <= maxValue) {
                                            setState({ ...state, taskDescription: e.target.value });
                                        }
                                    }}
                                    error={!!errors.taskDescription} // Show error if it exists
                                    helperText={errors.taskDescription} // Display error message
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: "-20px" }}>
                            <TextField
                                multiline
                                rows={3}
                                fullWidth
                                sx={{
                                    marginBottom: 2,
                                }}
                                variant="standard"
                                id="taskDetails"
                                name="taskDetails"
                                label="Task Details"
                                value={state.taskDetails}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const regex = /^[a-zA-Z\s]*$/;
                                    const maxValue = 120
                                    if (regex.test(value) && value.length <= maxValue) {
                                        setState({ ...state, taskDetails: e.target.value });
                                    }
                                }}
                                error={!!errors.taskDetails} // Show error if it exists
                                helperText={errors.taskDetails} // Display error message
                            />
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6} style={{ marginTop: "-20px" }}>
                                <TextField
                                    id="startDate"
                                    label="Start Date"
                                    type="date"
                                    variant="standard"
                                    value={state.startDate} // Set default value to 18 years ago
                                    sx={{ width: "100%" }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min: new Date().toISOString().split("T")[0],
                                    }}
                                    onChange={(e) => setState({ ...state, startDate: e.target.value })}
                                    error={!!errors.startDate}
                                    helperText={errors.startDate}
                                />
                            </Grid>
                            <Grid item xs={6} style={{ marginTop: "-20px" }}>
                                <TextField
                                    id="endDate"
                                    label="End Date"
                                    type="date"
                                    variant="standard"
                                    disabled={state.startDate === "" ? true : false}
                                    value={state.endDate} // Set default value to 18 years ago
                                    sx={{ width: "100%" }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min: state.startDate
                                    }}
                                    onChange={(e) => setState({ ...state, endDate: e.target.value })}
                                    error={!!errors.endDate}
                                    helperText={errors.endDate}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Autocomplete
                                    multiple
                                    id="tags-standard"
                                    options={employees || []}
                                    value={state.employeeDetails || []}
                                    isOptionEqualToValue={(option, value) =>
                                        option.id === value.id
                                    }
                                    onChange={(e, v) => {
                                        setState({
                                            ...state,
                                            employeeDetails: v, // Store selected objects
                                        });
                                    }}
                                    getOptionLabel={(option) => option.title || ""}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Employees"
                                            placeholder="Add some employees"
                                            error={!!errors.employeeDetails} // Show error if it exists
                                            helperText={errors.employeeDetails} // Display error message
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    sx={{
                                        marginTop: "-16px"
                                    }}
                                    id="tags-standard"
                                    options={[
                                        { title: "Not Started" },
                                        { title: "In Progress" },
                                        { title: "On Hold" },
                                        { title: "Completed" },
                                    ]} getOptionLabel={(option) => option.title || []} // Safely access title
                                    value={state.taskStatus} // Ensure value is an object or null
                                    onChange={(e, v) => {
                                        console.log(v);
                                        setState({
                                            ...state,
                                            taskStatus: v ? v : null, // Set campaignStatus to the selected object or null
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Task Status"
                                            margin="normal"
                                            variant="standard"
                                            error={!!errors.taskStatus} // Show error if it exists
                                            helperText={errors.taskStatus} // Display error message
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography color={"primary"} sx={{ marginTop: "10px" }}>
                                <label style={{ cursor: 'pointer', position: 'relative' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFilesChange}
                                        multiple // Allow selection of multiple files
                                        style={{ display: 'none' }}
                                    />
                                    <AddIcon /> Click to upload some task photo
                                </label>
                                {isLoading && (
                                    <div
                                        style={{
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            width: '100vw',
                                            height: '100vh',
                                            backgroundColor: 'rgba(255, 255, 255, 0.7)', // semi-transparent white background
                                            backdropFilter: 'blur(2px)', // apply the blur effect
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 9999, // ensure it is on top of other content
                                        }}
                                    >
                                        <CircularProgress size={24} />
                                    </div>
                                )}
                                {errors.taskPhotos && <Typography color="error" style={{ fontSize: "12px" }}>{errors.taskPhotos}</Typography>}
                            </Typography>

                            <Grid container spacing={2} sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", marginTop: "10px", paddingLeft: "20px" }}>
                                {state.taskPhotos?.length > 0 && state.taskPhotos.map((photo, index) => (
                                    <img src={photo} key={index} alt="..." style={{ width: "100px", height: "100px", margin: "5px", borderRadius: "10px", objectFit: "cover" }} />
                                ))}
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
                                    onClick={handleUpdateTask}
                                >
                                    Update
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={handleCreateTask}
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
                    title="Task List"
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
                onDelete={handleDeleteTask}
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

export default Task;