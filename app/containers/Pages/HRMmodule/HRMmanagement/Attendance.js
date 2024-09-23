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

function Attendance() {
    const { classes } = useStyles();

    const [state, setState] = useState({
        id: "",
        employeeName: null,
        date: "",
        workShift: "",
        clockIn: "",
        clockOut: "",
        isUpdate: false,
    });

    const [errors, setErrors] = useState({
        employeeName: "",
        date: "",
        workShift: "",
        clockIn: "",
        clockOut: "",
    });

    const validate = () => {
        let isValid = true;
        let errors = {};

        if (!state.employeeName) {
            errors.employeeName = "Employee Name is required";
            isValid = false;
        }
        if (!state.date) {
            errors.date = "Date is required";
            isValid = false;
        }
        if (!state.clockIn) {
            errors.clockIn = "Clock In is required";
            isValid = false;
        }
        if (!state.clockOut) {
            errors.clockOut = "Clock Out is required";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const [employees, setEmployees] = useState([]);
    const [workList, setWorkList] = useState([]);

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
            id: "employeeName",
            numeric: false,
            disablePadding: false,
            label: "Employee Name",
        },
        {
            id: "date",
            numeric: false,
            disablePadding: false,
            label: "Date",
        },
        {
            id: "clockIn",
            numeric: false,
            disablePadding: false,
            label: "Clock In",
        },
        {
            id: "clockOut",
            numeric: false,
            disablePadding: false,
            label: "Clock Out",
        },
        { id: "actions", label: "Action" },
    ];

    const getAttendanceList = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/getAttendanceDetails`,
                requestOptions
            );
            const actualData = await res.json();
            // console.log(actualData);

            if (actualData.status === 200) {
                setRowdata(
                    actualData.data.map((item) => ({
                        slNo: actualData.data.indexOf(item) + 1,
                        id: item._id,
                        employeeName: item.employeeName,
                        date: item.date.split('T')[0],
                        clockIn: item.clockIn,
                        clockOut: item.clockOut,
                        actions: (
                            <>
                                <IconButton
                                    aria-label="Edit"
                                    onClick={(e) => {
                                        handleSetTimeToState(item);
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
        getAttendanceList();
        getAllEmployeeType();
    }, []);

    const handleCreateAttendance = async () => {
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
                employeeID: state.employeeName.id,
                date: state.date,
                clockIn: state.clockIn,
                clockOut: state.clockOut,
            };
            const requestOptions = {
                method: "POST",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/createAttendance`,
                requestOptions
            );
            const actualData = await res.json();
            console.log(actualData);
            if (actualData.status === 200) {
                setState({
                    id: "",
                    employeeName: "",
                    date: "",
                    workShift: "",
                    clockIn: "",
                    clockOut: "",
                    isUpdate: false,
                });
                setOpenDialog(false);
                setMessage("Saved successfully!");
                setOpen(true);
                setSeverity("success");
                getAttendanceList();
                window.scrollTo({
                    top: 400,
                    behavior: "smooth",
                });
            } else {
                setOpenDialog(false);
                setMessage(actualData.message);
                setOpen(true);
                setSeverity("error");
            }
        } catch (err) {
            console.log(err);
            setOpenDialog(false);
            setMessage("Something went wrong!");
            setOpen(true);
            setSeverity("error");
        }
    };

    const handleUpdateAttendance = async () => {
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
                employeeName: state.employeeName.title,
                employeeID: state.employeeName.id,
                date: state.date,
                clockIn: state.clockIn,
                clockOut: state.clockOut,
            };
            // console.log(data);
            const requestOptions = {
                method: "PUT",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/updateAttendance`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setState({
                    id: "",
                    employeeName: "",
                    date: "",
                    clockIn: "",
                    clockOut: "",
                    isUpdate: false,
                });
                setOpenDialog(false);
                setMessage("Updated successfully!");
                setOpen(true);
                setSeverity("success");
                getAttendanceList();
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

    const handleDeleteAttendance = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/deleteAttendance`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setDeleteDialogOpen(false);
                setIdToDelete(null);
                getAttendanceList();
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
            employeeName: "",
            date: "",
            workShift: "",
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

    function formatTimeTo12Hour(time24) {
        let [hour, minute] = time24.split(':');
        hour = parseInt(hour, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12; // Convert hour to 12-hour format
        return `${hour}:${minute} ${period}`;
    }

    const [clockInTime, setClockInTime] = useState("")
    const [clockOutTime, setClockOutTime] = useState("")

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
        console.log(item);
        const formattedStartTime = formatTimeTo24Hour(item.clockIn)
        const formattedEndTime = formatTimeTo24Hour(item.clockOut)
        setClockInTime(formattedStartTime)
        setClockOutTime(formattedEndTime)
        setState({
            ...state,
            id: item._id,
            employeeName: {
                title: item.employeeName,
                id: item.employeeID
            },
            date: item.date.split('T')[0],
            clockIn: item.clockIn,
            clockOut: item.clockOut,
            isUpdate: true,
        })
    }

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
                                <AddIcon /> Add Attendance
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
                        Attendance
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
                                    options={employees}
                                    getOptionLabel={(option) => option.title || ""} // Safely access title
                                    value={state.employeeName} // Ensure value is an object or null
                                    onChange={(e, v) => {
                                        console.log(v);
                                        setState({
                                            ...state,
                                            employeeName: v ? v : null, // Set campaignStatus to the selected object or null
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Employee Name"
                                            margin="normal"
                                            variant="standard"
                                            error={!!errors.employeeName} // Show error if it exists
                                            helperText={errors.employeeName} // Display error message
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="date"
                                    label="Date"
                                    type="date"
                                    variant="standard"
                                    value={state.date} // Set default value to 18 years ago
                                    sx={{ width: "100%" }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        max: new Date().toISOString().split("T")[0],
                                    }}
                                    onChange={(e) => setState({ ...state, date: e.target.value })}
                                    error={!!errors.date}
                                    helperText={errors.date}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    id="clockIn"
                                    fullWidth
                                    label="Clock In"
                                    type="time"
                                    defaultValue={clockInTime}
                                    onChange={(e) => {
                                        const selectedTime = e.target.value; // Get the selected time from input

                                        // Convert selectedTime from 24-hour to 12-hour format with AM/PM
                                        const formattedTime = formatTimeTo12Hour(selectedTime);

                                        setClockInTime(e.target.value)

                                        // Update the state with the formatted time
                                        setState({
                                            ...state,
                                            clockIn: formattedTime,
                                        });
                                    }}
                                    variant="standard"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 300, // 5 min
                                    }}
                                    sx={{ width: "100%" }}
                                    error={!!errors.clockIn} // Show error if it exists
                                    helperText={errors.clockIn} // Display error message
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="clockOut"
                                    label="Clock Out"
                                    type="time"
                                    fullWidth
                                    style={{
                                        width: "100%",
                                    }}
                                    defaultValue={clockOutTime}
                                    disabled={!state.clockIn ? true : false}
                                    onChange={(e) => {
                                        const selectedTime = e.target.value; // Get the selected time from input

                                        // Convert selectedTime from 24-hour to 12-hour format with AM/PM
                                        const formattedTime = formatTimeTo12Hour(selectedTime);

                                        setClockOutTime(e.target.value)
                                        // Update the state with the formatted time
                                        setState({
                                            ...state,
                                            clockOut: formattedTime,
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
                                    error={!!errors.clockOut} // Show error if it exists
                                    helperText={errors.clockOut} // Display error message
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
                                    onClick={handleUpdateAttendance}
                                >
                                    Update
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={handleCreateAttendance}
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
                    title="Attendance List"
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
                onDelete={handleDeleteAttendance}
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

export default Attendance;