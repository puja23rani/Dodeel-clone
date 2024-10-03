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

function LeaveRequest() {
    const { classes } = useStyles();

    const [state, setState] = useState({
        id: "",
        employeeName: "",
        leaveTypes: "",
        fromdate: "",
        todate: "",
        reason: "",
        description: "",
        leaveStatus: "",
        isUpdate: false,
    });

    const [errors, setErrors] = useState({
        employeeName: "",
    });

    const validate = () => {
        let isValid = true;
        let errors = {};

        if (!state.employeeName) {
            errors.employeeName = "Employee Name is required";
            isValid = false;
        }

        if (!state.leaveTypes) {
            errors.leaveTypes = "Leave Types is required";
            isValid = false;
        }

        if (!state.fromdate) {
            errors.fromdate = "From Date is required";
            isValid = false;
        }

        if (!state.todate) {
            errors.todate = "To Date is required";
            isValid = false;
        }

        if (!state.reason) {
            errors.reason = "Reason is required";
            isValid = false;
        }

        if (!state.leaveStatus) {
            errors.leaveStatus = "Leave Status is required";
            isValid = false;
        }

        if (!state.description) {
            errors.description = "Description is required";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const [employees, setEmployees] = useState([]);
    const [leaveTypes, setleaveTypes] = useState([]);

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
            id: "leaveTypes",
            numeric: false,
            disablePadding: false,
            label: "Leave Types",
        },
        {
            id: "fromdate",
            numeric: false,
            disablePadding: false,
            label: "From Date",
        },
        {
            id: "todate",
            numeric: false,
            disablePadding: false,
            label: "To Date",
        },
        {
            id: "reason",
            numeric: false,
            disablePadding: false,
            label: "Reason",
        },
        {
            id: "leaveStatus",
            numeric: false,
            disablePadding: false,
            label: "Leave Status",
        },
        { id: "actions", label: "Action" },
    ];

    const getLeaveRequest = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/getLeaveDetails`,
                requestOptions
            );
            const actualData = await res.json();
            console.log(actualData);

            if (actualData.status === 200) {
                setRowdata(
                    actualData.leaves.map((item) => ({
                        slNo: actualData.leaves.indexOf(item) + 1,
                        id: item._id,
                        employeeName: item.employeeName || "N/A",
                        leaveTypes: item.leaveTypes || "N/A",
                        fromdate: item.fromdate.split('T')[0] || "N/A",
                        todate: item.todate.split('T')[0] || "N/A",
                        reason: item.reason || "N/A",
                        leaveStatus: item.leaveStatus || "N/A",
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
                                            leaveTypes: {
                                                title: item.leaveTypes,
                                                id: item.leaveTypeID
                                            },
                                            fromdate: item.fromdate.split('T')[0],
                                            todate: item.todate.split('T')[0],
                                            reason: item.reason,
                                            description: item.description,
                                            leaveStatus: { title: item.leaveStatus },
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

    const getAllLeaveType = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/getLeaveTypeDetails`,
                requestOptions
            );
            const actualData = await res.json();
            console.log(actualData);
            if (Array.isArray(actualData.leaveTypes)) {
                const newobj = actualData.leaveTypes.map((item) => ({
                    title: item.leaveTypes,
                    id: item._id,
                }));
                setleaveTypes(newobj);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getLeaveRequest();
        getAllEmployeeType();
        getAllLeaveType();
    }, []);

    const handleCreateLeaveRequest = async () => {
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
                leaveTypeID: state.leaveTypes.id,
                leavetitle: state.leaveTypes.title,
                description: state.description,
                fromdate: state.fromdate,
                todate: state.todate,
                reason: state.reason,
                // leaveStatus: state.leaveStatus,
            };
            const requestOptions = {
                method: "POST",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/createLeave`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setState({
                    id: "",
                    employeeName: "",
                    leaveTypes: "",
                    fromdate: "",
                    todate: "",
                    reason: "",
                    description: "",
                    leaveStatus: "",
                    isUpdate: false,
                });
                setOpenDialog(false);
                setMessage("Created Sucessfully!");
                setOpen(true);
                setSeverity("success");
                getLeaveRequest();
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

    const handleUpdateLeaveRequest = async () => {
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
                leaveTypeID: state.leaveTypes.id,
                leavetitle: state.leaveTypes.title,
                description: state.description,
                fromdate: state.fromdate,
                todate: state.todate,
                reason: state.reason,
                leaveStatus: state.leaveStatus.title,
            };
            // console.log(data);
            const requestOptions = {
                method: "PUT",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/updateLeave`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setState({
                    id: "",
                    employeeName: "",
                    leaveTypes: "",
                    fromdate: "",
                    todate: "",
                    reason: "",
                    description: "",
                    leaveStatus: "",
                    isUpdate: false,
                });
                setOpenDialog(false);
                setMessage("Updated successfully!");
                setOpen(true);
                setSeverity("success");
                getLeaveRequest();
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

    const handleDeleteLeaveRequest = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/deleteLeave`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setDeleteDialogOpen(false);
                setIdToDelete(null);
                getLeaveRequest();
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
                                <AddIcon /> Add Leave Request
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
                        Leave Request
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
                                <Autocomplete
                                    sx={{
                                        marginTop: "-16px"
                                    }}
                                    id="tags-standard"
                                    options={leaveTypes}
                                    getOptionLabel={(option) => option.title || ""} // Safely access title
                                    value={state.leaveTypes} // Ensure value is an object or null
                                    onChange={(e, v) => {
                                        console.log(v);
                                        setState({
                                            ...state,
                                            leaveTypes: v ? v : null, // Set campaignStatus to the selected object or null
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Leave Type"
                                            margin="normal"
                                            variant="standard"
                                            error={!!errors.leaveTypes} // Show error if it exists
                                            helperText={errors.leaveTypes} // Display error message
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="reson"
                                    name="reason"
                                    label="Reason"
                                    value={state.reason}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        const maxValue = 50
                                        if (regex.test(value) && value.length <= maxValue) {
                                            setState({ ...state, reason: e.target.value });
                                        }
                                    }}
                                    error={!!errors.reason} // Show error if it exists
                                    helperText={errors.reason} // Display error message
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="description"
                                    name="description"
                                    label="Description"
                                    value={state.description}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        const maxValue = 50
                                        if (regex.test(value) && value.length <= maxValue) {
                                            setState({ ...state, description: e.target.value });
                                        }
                                    }}
                                    error={!!errors.description} // Show error if it exists
                                    helperText={errors.description} // Display error message
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    id="fromdate"
                                    label="From Date"
                                    type="date"
                                    variant="standard"
                                    value={state.fromdate} // Set default value to 18 years ago
                                    sx={{ width: "100%" }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min: new Date().toISOString().split("T")[0],
                                    }}
                                    onChange={(e) => setState({ ...state, fromdate: e.target.value })}
                                    error={!!errors.fromdate}
                                    helperText={errors.fromdate}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    id="todate"
                                    label="To Date"
                                    type="date"
                                    variant="standard"
                                    disabled={state.fromdate === "" ? true : false}
                                    value={state.todate} // Set default value to 18 years ago
                                    sx={{ width: "100%" }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min: state.fromdate
                                    }}
                                    onChange={(e) => setState({ ...state, todate: e.target.value })}
                                    error={!!errors.todate}
                                    helperText={errors.todate}
                                />
                            </Grid>
                        </Grid>
                        {state.isUpdate && (
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Autocomplete
                                        id="tags-standard"
                                        options={[
                                            { title: "Rejected" },
                                            { title: "Approved" }
                                        ]}
                                        getOptionLabel={(option) => option.title || ""} // Safely access title
                                        value={state.leaveStatus} // Ensure value is an object or null
                                        onChange={(e, v) => {
                                            console.log(v);
                                            setState({
                                                ...state,
                                                leaveStatus: v ? v : null, // Set campaignStatus to the selected object or null
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Leave Status"
                                                margin="normal"
                                                variant="standard"
                                                error={!!errors.leaveStatus} // Show error if it exists
                                                helperText={errors.leaveStatus} // Display error message
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        )}
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
                                    onClick={handleUpdateLeaveRequest}
                                >
                                    Update
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={handleCreateLeaveRequest}
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
                    title="Leave Request List"
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
                onDelete={handleDeleteLeaveRequest}
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

export default LeaveRequest;