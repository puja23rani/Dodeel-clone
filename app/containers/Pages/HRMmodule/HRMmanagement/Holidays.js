import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";
import {
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


function Holidays() {
    const { classes } = useStyles();

    const [state, setState] = useState({
        id: "",
        holidayName: "",
        startdate: "",
        enddate: "",
        description: "",
        isUpdate: false,
    });

    const [errors, setErrors] = useState({
        holidayName: "",
    });


    const validate = () => {
        let isValid = true;
        let errors = {};

        if (!state.holidayName.trim()) {
            errors.holidayName = "Holidays Name is required";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

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
            id: "holidayName",
            numeric: false,
            disablePadding: false,
            label: "Holidays Name",
        },
        {
            id: "startdate",
            numeric: false,
            disablePadding: false,
            label: "Start Date",
        },
        {
            id: "enddate",
            numeric: false,
            disablePadding: false,
            label: "End Date",
        },
        {
            id: "description",
            numeric: false,
            disablePadding: false,
            label: "Description",
        },
        { id: "actions", label: "Action" },
    ];

    const getHolidaysList = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/getHolidayDetails`,
                requestOptions
            );
            const actualData = await res.json();
            console.log(actualData);

            if (actualData.status === 200) {
                setRowdata(
                    actualData.holidays.map((item) => ({
                        slNo: actualData.holidays.indexOf(item) + 1,
                        id: item._id,
                        holidayName: item.title,
                        startdate: item.startdate.split("T")[0],
                        enddate: item.enddate.split("T")[0],
                        description: item.description,
                        actions: (
                            <>
                                <IconButton
                                    aria-label="Edit"
                                    onClick={(e) => {
                                        setState({
                                            id: item._id,
                                            holidayName: item.title,
                                            startdate: item.startdate.split("T")[0],
                                            enddate: item.enddate.split("T")[0],
                                            description: item.description,
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

    useEffect(() => {
        getHolidaysList();
    }, []);

    const handleCreateHoliday = async () => {
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
                title: state.holidayName,
                startdate: state.startdate,
                enddate: state.enddate,
                description: state.description,
            };
            const requestOptions = {
                method: "POST",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/createHoliday`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setState({
                    id: "",
                    holidayName: "",
                    startdate: "",
                    enddate: "",
                    description: "",
                    isUpdate: false,
                });
                setOpenDialog(false);
                setMessage("Saved successfully!");
                setOpen(true);
                setSeverity("success");
                getHolidaysList();
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

    const handleUpdateHoliday = async () => {
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
                title: state.holidayName,
                startdate: state.startdate,
                enddate: state.enddate,
                description: state.description,
            };
            const requestOptions = {
                method: "PUT",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/updateHoliday`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setState({
                    holidayName: "",
                    isUpdate: false,
                });
                setOpenDialog(false);
                setMessage("Updated successfully!");
                setOpen(true);
                setSeverity("success");
                getHolidaysList();
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

    const handleDeleteHoliday = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/deleteHoliday`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setDeleteDialogOpen(false);
                setIdToDelete(null);
                getHolidaysList();
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
            holidayName: "",
            isUpdate: false,
        })
        setErrors({});
        setOpenDialog(false);
    }

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
                                <AddIcon /> Add Holiday
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
                        Holiday
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
                                    id="holidayName"
                                    name="holidayName"
                                    label="Holiday Name (e.g. New Year, Independence Day, etc.)"
                                    value={state.holidayName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        const maxValue = 50
                                        if (regex.test(value) && value.length <= maxValue) {
                                            setState({ ...state, holidayName: e.target.value });
                                        }
                                    }}
                                    error={!!errors.holidayName} // Show error if it exists
                                    helperText={errors.holidayName} // Display error message
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
                                    label="Short Description"
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
                            <Grid item xs={6} sx={{ marginTop: "-20px" }}>
                                <TextField
                                    id="startdate"
                                    label="Start Date"
                                    type="date"
                                    variant="standard"
                                    value={state.startdate} // Set default value to 18 years ago
                                    sx={{ width: "100%" }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min: new Date().toISOString().split("T")[0],
                                    }}
                                    onChange={(e) => setState({ ...state, startdate: e.target.value })}
                                    error={!!errors.startdate}
                                    helperText={errors.startdate}
                                />
                            </Grid>
                            <Grid item xs={6} sx={{ marginTop: "-20px" }}>
                                <TextField
                                    id="enddate"
                                    label="End Date"
                                    type="date"
                                    variant="standard"
                                    disabled={state.startdate === "" ? true : false}
                                    value={state.enddate} // Set default value to 18 years ago
                                    sx={{ width: "100%" }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min: state.startdate
                                    }}
                                    onChange={(e) => setState({ ...state, enddate: e.target.value })}
                                    error={!!errors.enddate}
                                    helperText={errors.enddate}
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
                                    onClick={handleUpdateHoliday}
                                >
                                    Update
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={handleCreateHoliday}
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
                    title="Holidays List"
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
                onDelete={handleDeleteHoliday}
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

export default Holidays;
