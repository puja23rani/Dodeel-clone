import React, { useEffect, useState } from 'react'
import TablePlayground from '../../../Tables/TablePlayground';
import { makeStyles } from 'tss-react/mui';
import Popup from '../../../../components/Popup/Popup';
import { Button, DialogContent, IconButton, TextField, Toolbar, Tooltip, Autocomplete, FormControl, Grid, InputLabel, MenuItem, Select, Dialog, DialogTitle, DialogActions, Typography } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";
import { Close as CloseIcon } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertDialog from '../../../UiElements/demos/DialogModal/AlertDialog';


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

const AppraisalList = () => {

    const { classes } = useStyles();

    const navigate = useNavigate();

    const [state, setState] = useState({
        id: "",
        employeeName: null,
        currentSalary: "",
        appraisalAmount: "",
        year: "",
        month: "",
        totalAmount: 0,
        isUpdate: false,
    })

    const [errors, setErrors] = useState({
        employeeName: null,
        currentSalary: "",
        appraisalAmount: "",
        year: "",
        month: "",
        totalAmount: ""
    });

    const validate = () => {
        let isValid = true;
        let errors = {};

        if (!state.employeeName) {
            errors.employeeName = "Employee Name is required";
            isValid = false;
        }
        if (!state.currentSalary) {
            errors.currentSalary = "Current Salary is required";
            isValid = false;
        }
        if (!state.appraisalAmount) {
            errors.appraisalAmount = "Appraisal Amount is required";
            isValid = false;
        }
        if (!state.year) {
            errors.year = "Year is required";
            isValid = false;
        }
        if (!state.month) {
            errors.month = "Month is required";
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
            id: "employeeID",
            numeric: false,
            disablePadding: false,
            label: "Employee ID",
        },
        {
            id: "employeeName",
            numeric: false,
            disablePadding: false,
            label: "Employee Name",
        },
        {
            id: "currentSalary",
            numeric: false,
            disablePadding: false,
            label: "Current Salary",
        },
        {
            id: "newSalary",
            numeric: false,
            disablePadding: false,
            label: "New Salary",
        },
        {
            id: "currentMonth",
            numeric: false,
            disablePadding: false,
            label: "Current Month",
        },
        {
            id: "currentYear",
            numeric: false,
            disablePadding: false,
            label: "Current Year",
        },
        { id: "actions", label: "Action" },
    ];

    const getAppraisalList = async () => {
        try {
            const loginHeaders = new Headers();
            loginHeaders.append("Content-Type", "application/json");

            // Assuming you have an authorization token stored in localStorage
            const authToken = localStorage.getItem("token");
            if (authToken) {
                loginHeaders.append("Authorization", `Bearer ${authToken}`);
            }

            const data = {
                "pageSize": 1,
                "pageNumber": 1
            }

            const requestOptions = {
                method: "POST",
                headers: loginHeaders,
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/getAllAppraisal`,
                requestOptions,
                data
            );
            const actualData = await res.json();
            console.log(actualData);

            if (actualData.status === 200) {
                setRowdata(
                    actualData.data.map((item) => ({
                        slNo: actualData.data.indexOf(item) + 1,
                        employeeID: item.employeeID || "N/A",
                        employeeName: item.employeeName || "N/A",
                        currentSalary: item.appraisal[0].currentSalary,
                        newSalary: item.appraisal[0].newSalary,
                        currentMonth: item.appraisal[0].month,
                        currentYear: item.appraisal[0].year,
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
                                            appraisalAmount: item.appraisal[0].appraisalAmount,
                                            currentSalary: item.appraisal[0].currentSalary,
                                            // newSalary: item.appraisal[0].newSalary,
                                            month: item.appraisal[0].month,
                                            year: item.appraisal[0].year,
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
        getAppraisalList();
    }, []);

    const handlePageChange = (event, newPage) => {
        setPage(newPage); // Update the current page
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10)); // Update the rows per page
        setPage(0); // Reset to first page
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseDialog = () => {
        setState({
            id: "",
            employeeName: null,
            currentSalary: "",
            appraisalAmount: "",
            year: "",
            month: "",
            totalAmount: 0,
            isUpdate: false,
        })
        setErrors({

        })
        setOpenDialog(false);
    };

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
        getAllEmployeeType();
    }, [])

    const currentYear = new Date().getFullYear();
    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]);

    useEffect(() => {
        const generateYears = () => {
            const yearsArray = [];
            for (let i = 0; i < 10; i++) {
                yearsArray.push(currentYear - i);
            }
            setYears(yearsArray);
        };

        generateYears();
    }, [currentYear]);

    useEffect(() => {
        setState({
            ...state,
            totalAmount: parseFloat(state.currentSalary || 0) + parseFloat(state.appraisalAmount || 0)
        });
    }, [state.currentSalary, state.appraisalAmount]);


    const handleCreateAppraisal = async () => {
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
                employeeName: state.employeeName.title,
                employeeID: state.employeeName.id,
                appraisal: [
                    {
                        currentSalary: parseInt(state.currentSalary, 10),
                        appraisalAmount: parseInt(state.appraisalAmount, 10),
                        newSalary: parseInt(state.totalAmount, 10),
                        month: state.month,
                        year: state.year,
                    },
                ],
            };
            const requestOptions = {
                method: "POST",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/createEmployeeAppraisal`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setState({
                    id: "",
                    employeeName: null,
                    currentSalary: "",
                    appraisalAmount: "",
                    year: "",
                    month: "",
                    totalAmount: 0
                });
                setMessage("Saved successfully!");
                setOpen(true);
                setSeverity("success");
            }
        } catch (err) {
            console.log(err);
            setMessage("Something went wrong!");
            setOpen(true);
            setSeverity("error");
        }
    }

    const handleUpdateAppraisal = async () => {
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
                appraisal: [
                    {
                        currentSalary: parseInt(state.currentSalary, 10),
                        appraisalAmount: parseInt(state.appraisalAmount, 10),
                        newSalary: parseInt(state.totalAmount, 10),
                        month: state.month,
                        year: state.year,
                    },
                ],
            };
            // console.log(data);
            const requestOptions = {
                method: "PUT",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/updateEmployeeAppraisal`,
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
                getAppraisalList();
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

    const handleDeletePayroll = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/deleteEmployeeAppraisal`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setDeleteDialogOpen(false);
                setIdToDelete(null);
                getAppraisalList();
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

    console.log(state);



    return (
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
                            <AddIcon /> Create Appraisal
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
                    Create Appraisal
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
                        <Grid item md={6} xs={12}>
                            <Autocomplete
                                sx={{
                                    marginTop: "-16px"
                                }}
                                id="tags-standard"
                                options={employees || []}
                                getOptionLabel={(option) => option.title || ""} // Safely access title
                                value={state.employeeName || null} // Ensure value is an object or null
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
                        {/* <Grid item md={6} xs={12} sx={{ textAlign: "right", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <Typography>New Salary (Auto calculated): </Typography>
                            <Typography color={"primary"} sx={{ fontSize: 20, marginLeft: "5px" }}>{state.totalAmount ? state.totalAmount : 0}</Typography>
                        </Grid> */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                sx={{
                                    marginBottom: 2,
                                }}
                                variant="standard"
                                id="currentSalary"
                                name="currentSalary"
                                label="Current Salary"
                                value={state.currentSalary}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const regex = /^[0-9]*[.]?[0-9]*$/; // Updated regex to allow decimals
                                    const maxValue = 10
                                    if (regex.test(value) && value.length <= maxValue) {
                                        setState({ ...state, currentSalary: e.target.value });
                                    }
                                }}
                                error={!!errors.currentSalary} // Show error if it exists
                                helperText={errors.currentSalary} // Display error message
                            />
                        </Grid>
                        <Grid item xs={6} style={{ marginTop: "-20px" }}>
                            <TextField
                                fullWidth
                                sx={{
                                    marginBottom: 2,
                                }}
                                variant="standard"
                                id="appraisalAmount"
                                name="appraisalAmount"
                                label="Appraisal Amount"
                                value={state.appraisalAmount}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const regex = /^[0-9]*[.]?[0-9]*$/; // Updated regex to allow decimals
                                    const maxValue = 10
                                    if (regex.test(value) && value.length <= maxValue) {
                                        setState({ ...state, appraisalAmount: e.target.value });
                                    }
                                }}
                                error={!!errors.appraisalAmount} // Show error if it exists
                                helperText={errors.appraisalAmount} // Display error message
                            />
                        </Grid>
                        <Grid item xs={6} style={{ marginTop: "-20px" }}>
                            <TextField
                                fullWidth
                                disabled
                                sx={{
                                    marginBottom: 2,
                                }}
                                variant="standard"
                                id="salary"
                                name="salary"
                                label="Salary (Auto calculated)"
                                value={state.totalAmount ? state.totalAmount : 0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const regex = /^[0-9+\s-]*$/;
                                    const maxValue = 10
                                    if (regex.test(value) && value.length <= maxValue) {
                                        setState({ ...state, totalAmount: e.target.value });
                                    }
                                }}
                                error={!!errors.salary} // Show error if it exists
                                helperText={errors.salary} // Display error message
                            />
                        </Grid>
                        <Grid item xs={6} style={{ marginTop: "-20px" }}>
                            <FormControl fullWidth variant="standard" error={!!errors.year}>
                                <InputLabel>Year</InputLabel>
                                <Select
                                    value={state.year}
                                    onChange={(e) => setState({ ...state, year: e.target.value })}
                                >
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.year && (
                                    <Typography variant="caption" color="error">
                                        {errors.year}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={6} style={{ marginTop: "-20px" }}>
                            <FormControl fullWidth variant="standard" error={!!errors.month}>
                                <InputLabel>Month</InputLabel>
                                <Select
                                    value={state.month}
                                    onChange={(e) => setState({ ...state, month: e.target.value })}
                                >
                                    {months.map((month, index) => (
                                        <MenuItem key={index} value={month}>
                                            {month}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.month && (
                                    <Typography variant="caption" color="error">
                                        {errors.month}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Close
                    </Button>
                    {state.isUpdate ? (
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={handleUpdateAppraisal}
                        >
                            Update
                        </Button>
                    ) : (
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={handleCreateAppraisal}
                        >
                            Create
                        </Button>
                    )}

                </DialogActions>
            </Dialog>
            {rowdata && (
                <TablePlayground
                    title="Appraisal List"
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
                onDelete={handleDeletePayroll}
            />
            <Popup
                open={open}
                message={message}
                onClose={handleClose}
                severity={severity} // You can change this to "error", "warning", etc.
            />
        </div>
    )
}

export default AppraisalList