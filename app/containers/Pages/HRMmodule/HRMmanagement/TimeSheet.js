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

function TimeSheet() {
    const { classes } = useStyles();

    const [state, setState] = useState({
        id: "",
        employeeName: "",
        dateOfJoining: "",
        workShift: "",
        isUpdate: false,
    });

    const [errors, setErrors] = useState({
        employeeName: "",
        dateOfJoining: "",
        workShift: "",
    });

    const validate = () => {
        let isValid = true;
        let errors = {};

        if (!state.employeeName) {
            errors.employeeName = "Employee Name is required";
            isValid = false;
        }
        if (!state.dateOfJoining) {
            errors.dateOfJoining = "Date Of Joining is required";
            isValid = false;
        }
        if (!state.workShift) {
            errors.workShift = "Work Shift is required";
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
            id: "dateOfJoining",
            numeric: false,
            disablePadding: false,
            label: "Date Of Joining",
        },
        {
            id: "startTime",
            numeric: false,
            disablePadding: false,
            label: "Start Time",
        },
        {
            id: "endTime",
            numeric: false,
            disablePadding: false,
            label: "End Time",
        },
        {
            id: "totalHours",
            numeric: false,
            disablePadding: false,
            label: "Total Hours",
        },
        { id: "actions", label: "Action" },
    ];

    const getTimesheetList = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/getTimesheetDetails`,
                requestOptions
            );
            const actualData = await res.json();
            console.log(actualData);

            if (actualData.status === 200) {
                setRowdata(
                    actualData.timesheets.map((item) => ({
                        slNo: actualData.timesheets.indexOf(item) + 1,
                        id: item._id,
                        employeeName: item.employeeName,
                        dateOfJoining: item.date.split('T')[0],
                        startTime: item.startTime,
                        endTime: item.endTime,
                        totalHours: item.totalHours + " Hrs",
                        actions: (
                            <>
                                <IconButton
                                    aria-label="Edit"
                                    onClick={(e) => {
                                        setState({
                                            id: item._id,
                                            employeeName: {
                                                title: item.employeeName,
                                                id: item.employeeID
                                            },
                                            dateOfJoining: item.date.split('T')[0],
                                            workShift: {
                                                title: `${item.startTime} - ${item.endTime}`,
                                                id: item.workShiftID
                                            },
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

    const getWorkShiftDetails = async () => {
        try {
            const loginHeaders = new Headers();
            loginHeaders.append("Content-Type", "application/json");

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

            if (Array.isArray(actualData.workshifts)) {
                const newobj = actualData.workshifts.map((item) => ({
                    title: item.workShift,
                    id: item._id,
                }));
                setWorkList(newobj);
            }

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getTimesheetList();
        getAllEmployeeType();
        getWorkShiftDetails();
    }, []);

    const handleCreateTimesheet = async () => {
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
                date: state.dateOfJoining,
                workShiftID: state.workShift.id,
            };
            const requestOptions = {
                method: "POST",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/createTimesheet`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setState({
                    id: "",
                    employeeName: "",
                    dateOfJoining: "",
                    workShift: "",
                    isUpdate: false,
                });
                setOpenDialog(false);
                setMessage("Created Sucessfully!");
                setOpen(true);
                setSeverity("success");
                getTimesheetList();
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

    const handleUpdateTimesheet = async () => {
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
                employeeID: state.employeeName.id,
                date: state.dateOfJoining,
                workShiftID: state.workShift.id,
            };
            // console.log(data);
            const requestOptions = {
                method: "PUT",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/updateTimesheet`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setState({
                    id: "",
                    employeeName: "",
                    dateOfJoining: "",
                    workShift: "",
                    isUpdate: false,
                });
                setOpenDialog(false);
                setMessage("Updated successfully!");
                setOpen(true);
                setSeverity("success");
                getTimesheetList();
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/deleteTimesheet`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setDeleteDialogOpen(false);
                setIdToDelete(null);
                getTimesheetList();
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
            dateOfJoining: "",
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

    // console.log(state);

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
                                <AddIcon /> Add Timesheet
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
                        Timesheet
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
                                    label="Date Of Joining"
                                    type="date"
                                    variant="standard"
                                    value={state.dateOfJoining} // Set default value to 18 years ago
                                    sx={{ width: "100%" }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) => setState({ ...state, dateOfJoining: e.target.value })}
                                    error={!!errors.dateOfJoining}
                                    helperText={errors.dateOfJoining}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>

                            <Autocomplete
                                sx={{
                                    marginTop: "-16px"
                                }}
                                id="tags-standard"
                                options={workList}
                                getOptionLabel={(option) => option.title || ""} // Safely access title
                                value={state.workShift} // Ensure value is an object or null
                                onChange={(e, v) => {
                                    console.log(v);
                                    setState({
                                        ...state,
                                        workShift: v ? v : null, // Set campaignStatus to the selected object or null
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Workshift"
                                        margin="normal"
                                        variant="standard"
                                        error={!!errors.workShift} // Show error if it exists
                                        helperText={errors.workShift} // Display error message
                                    />
                                )}
                            />
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
                                    onClick={handleUpdateTimesheet}
                                >
                                    Update
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={handleCreateTimesheet}
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
                    title="Timesheet List"
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

export default TimeSheet;