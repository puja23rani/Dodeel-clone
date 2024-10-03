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
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import AlertDialog from "../../../UiElements/demos/DialogModal/AlertDialog";
import TablePlayground from "../../../Tables/TablePlayground";
import Popup from "../../../../components/Popup/Popup";
import { useNavigate } from "react-router-dom";
import MonthAndYear from "./MonthAndYear";

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

function Payroll() {
    const { classes } = useStyles();
    const navigate = useNavigate();

    const [state, setState] = useState({
        id: "",
        employeeName: "",
        salary: "",
        payrollStatus: "",
        payrollType: "",
        month: "",
        year: "",
        structure: [
            {
                payrollName: "",
                amountType: "",
                amount: "",
            }
        ],
        isUpdate: false,
    });

    const [errors, setErrors] = useState({
        employeeName: "",
        employeeName: "",
        salary: "",
        payrollStatus: "",
        payrollType: "",
        month: "",
        year: "",
        structure: [
            {
                payrollName: "",
                amountType: "",
                amount: "",
            }
        ],
    });


    const validate = () => {
        let isValid = true;
        let errors = {};

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
            id: "employeeName",
            numeric: false,
            disablePadding: false,
            label: "Employee Name",
        },
        {
            id: "payrollType",
            numeric: false,
            disablePadding: false,
            label: "Payroll Type",
        },
        {
            id: "salary",
            numeric: false,
            disablePadding: false,
            label: "Salary",
        },
        {
            id: "payrollStatus",
            numeric: false,
            disablePadding: false,
            label: "Payroll Status",
        },
        { id: "actions", label: "Action" },
    ];

    const [employees, setEmployees] = useState([]);

    const getPayrollList = async () => {
        try {
            const loginHeaders = new Headers();
            loginHeaders.append("Content-Type", "application/json");

            // Assuming you have an authorization token stored in localStorage
            const authToken = localStorage.getItem("token");
            if (authToken) {
                loginHeaders.append("Authorization", `Bearer ${authToken}`);
            }

            const data = {
                "pageNumber": 1,
                "pageSize": 1
            }

            const requestOptions = {
                method: "POST",
                headers: loginHeaders,
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/getAllPayrollDetails`,
                requestOptions,
                data
            );
            const actualData = await res.json();
            console.log(actualData);

            if (actualData.status === 200) {
                setRowdata(
                    actualData.data.map((item) => ({
                        slNo: actualData.data.indexOf(item) + 1,
                        id: item._id,
                        employeeID: item.employeeID,
                        employeeName: item.employeeName,
                        payrollType: item.payroll[0].payrollType,
                        salary: item.payroll[0].salary,
                        payrollStatus: item.payroll[0].payrollStatus,
                        actions: (
                            <>
                                <IconButton
                                    aria-label="Edit"
                                    onClick={(e) => {
                                        setState({
                                            id: item._id,
                                            employeeName: {
                                                title: item.employeeName,
                                                id: item.employeeID,
                                            },
                                            payrollType: {
                                                title: item.payroll[0].payrollType
                                            },
                                            salary: item.payroll[0].salary,
                                            payrollStatus: {
                                                title: item.payroll[0].payrollStatus
                                            },
                                            month: item.payroll[0].month,
                                            year: item.payroll[0].year,
                                            structure: item.payroll[0].structure.map((str) => ({
                                                payrollName: str.name,       // Update structure fields correctly
                                                amountType: str.amountType,
                                                amount: str.amount,
                                            })),

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
                                <IconButton
                                    aria-label="Info"
                                    onClick={(e) => {
                                        navigate("/app/hrm-setting/payroll-details", {
                                            state: { id: item._id },
                                        });
                                    }}
                                >
                                    <InfoIcon color={"primary"} />
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
            // console.log(actualData);
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
        getPayrollList();
        getAllEmployeeType();
    }, []);

    const hendleCreatePayroll = async () => {
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
                employeeName: state.employeeName.title,
                employeeID: state.employeeName.id,
                payroll: [
                    {
                        salary: parseInt(state.salary, 10),
                        structure: state.structure?.map((item) => ({
                            name: item.payrollName,
                            amount: parseInt(item.amount, 10),
                            amountType: item.amountType,
                        })),
                        month: state.month,
                        year: state.year,
                        payrollType: state.payrollType.title,
                        payrollStatus: state.payrollStatus.title,
                    },
                ],
            };
            const requestOptions = {
                method: "POST",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/createEmployeePayroll`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setState({
                    id: "",
                    employeeName: "",
                    salary: "",
                    payrollStatus: "",
                    payrollType: "",
                    month: "",
                    year: "",
                    structure: [
                        {
                            payrollName: "",
                            amountType: "",
                            amount: "",
                        }
                    ],
                    isUpdate: false,
                });
                setOpenDialog(false);
                setMessage("Created Sucessfully!");
                setOpen(true);
                setSeverity("success");
                getPayrollList();
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/deletePayroll`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setDeleteDialogOpen(false);
                setIdToDelete(null);
                getPayrollList();
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

    const handleUpdatePayroll = async () => {
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
                payroll: [
                    {
                        salary: parseInt(state.salary, 10),
                        structure: state.structure?.map((item) => ({
                            name: item.payrollName,
                            amount: parseInt(item.amount, 10),
                            amountType: item.amountType,
                        })),
                        month: state.month,
                        year: state.year,
                        payrollType: state.payrollType.title,
                        payrollStatus: state.payrollStatus.title,
                    },
                ],
            };
            const requestOptions = {
                method: "PUT",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/updateEmployeePayroll`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setState({
                    employeeName: "",
                    isUpdate: false,
                });
                setOpenDialog(false);
                setMessage("Updated successfully!");
                setOpen(true);
                setSeverity("success");
                getPayrollList();
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

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    const handleCloseDialog = () => {
        setState({
            id: "",
            employeeName: "",
            salary: "",
            payrollStatus: "",
            payrollType: "",
            month: "",
            year: "",
            structure: [
                {
                    payrollName: "",
                    amountType: "",
                    amount: "",
                }
            ],
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

    const handleAddSection = () => {
        setState({
            ...state,
            structure: [...state.structure, { payrollName: "", amountType: "", amount: "" }],
        });
    };

    const handleDeleteSection = (idx) => {
        setState({
            ...state,
            structure: state.structure.filter((_, index) => index !== idx),
        });
    };

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
        const calculatedSalary = state.structure.reduce((total, entry) => {
            const amount = parseFloat(entry.amount) || 0; // Parse amount to float, default 0 if empty
            if (entry.amountType === "Earning") {
                return total + amount;
            } else if (entry.amountType === "Deduction") {
                return total + amount;
            }
            return total;
        }, 0);

        // Update the salary in the state
        setState((prevState) => ({
            ...prevState,
            salary: calculatedSalary.toString(), // Convert to string if needed
        }));
    }, [state.structure]);

    const handleMonthYearChange = (month, year) => {
        console.log(month, year);
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
                                <AddIcon /> Create Payroll
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
                        Payroll
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
                                    fullWidth
                                    disabled
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="salary"
                                    name="salary"
                                    label="Salary (Auto calculated)"
                                    value={state.salary}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[0-9+\s-]*$/;
                                        const maxValue = 10
                                        if (regex.test(value) && value.length <= maxValue) {
                                            setState({ ...state, salary: e.target.value });
                                        }
                                    }}
                                    error={!!errors.salary} // Show error if it exists
                                    helperText={errors.salary} // Display error message
                                />
                            </Grid>
                            {/* <Grid item md={6} xs={12} sx={{ textAlign: "right", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <Typography>Salary (Auto calculated): </Typography>
                                <Typography color={"primary"} sx={{ fontSize: 20, marginLeft: "5px" }}>{state.salary ? state.salary : 0}</Typography>
                            </Grid> */}
                            <Grid item xs={6} style={{ marginTop: "-20px" }}>
                                <Autocomplete
                                    sx={{
                                        marginTop: "-16px"
                                    }}
                                    id="tags-standard"
                                    options={[
                                        { title: "Part-time" },
                                        { title: "Full-time" },
                                    ]}
                                    getOptionLabel={(option) => option.title || ""} // Safely access title
                                    value={state.payrollType} // Ensure value is an object or null
                                    onChange={(e, v) => {
                                        // console.log(v);
                                        setState({
                                            ...state,
                                            payrollType: v ? v : null, // Set campaignStatus to the selected object or null
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Payroll Type"
                                            margin="normal"
                                            variant="standard"
                                            error={!!errors.payrollType} // Show error if it exists
                                            helperText={errors.payrollType} // Display error message
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6} style={{ marginTop: "-20px" }}>
                                <Autocomplete
                                    sx={{
                                        marginTop: "-16px"
                                    }}
                                    id="tags-standard"
                                    options={[
                                        { title: "Pending" },
                                        { title: "Completed" },
                                    ]}
                                    getOptionLabel={(option) => option.title || ""} // Safely access title
                                    value={state.payrollStatus} // Ensure value is an object or null
                                    onChange={(e, v) => {
                                        // console.log(v);
                                        setState({
                                            ...state,
                                            payrollStatus: v ? v : null, // Set campaignStatus to the selected object or null
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Payroll Status"
                                            margin="normal"
                                            variant="standard"
                                            error={!!errors.payrollStatus} // Show error if it exists
                                            helperText={errors.payrollStatus} // Display error message
                                        />
                                    )}
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
                            {state.structure && state.structure.map((el, idx) => (
                                <Grid
                                    container
                                    spacing={2}
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginLeft: 0,
                                    }}
                                    xs={12}
                                >
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            id={`payrollName-${idx}`}
                                            name="payrollName"
                                            label="Payroll Name"
                                            value={el.payrollName}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                const regex = /^[a-zA-Z\s]*$/;
                                                const maxValue = 50
                                                if (regex.test(inputValue) && inputValue.length <= maxValue) {
                                                    const newFieldset = [...state.structure];
                                                    newFieldset[idx].payrollName = inputValue;
                                                    setState({ ...state, structure: newFieldset });
                                                }
                                            }}
                                            error={!!errors[`fieldsetName${idx}`]} // Show error if it exists
                                            helperText={errors[`fieldsetName${idx}`]} // Display error message
                                        />
                                    </Grid>
                                    <Grid item xs={3} style={{ marginTop: "8px" }}>
                                        <Autocomplete
                                            id={`amountType-${idx}`}
                                            options={[
                                                { title: "Earning" },
                                                { title: "Deduction" },
                                            ]} // Replace with your actual options
                                            getOptionLabel={(option) => option.title || ""} // Access title safely
                                            value={el.amountType ? { title: el.amountType } : null} // Ensures the selected value
                                            onChange={(e, v) => {
                                                const newFieldset = [...state.structure];
                                                newFieldset[idx].amountType = v ? v.title : ""; // Update with selected title or clear it
                                                setState({ ...state, structure: newFieldset });
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Amount Type"
                                                    variant="standard"
                                                    error={!!errors[`structure${idx}`]} // Show error if it exists
                                                    helperText={errors[`structure${idx}`]} // Display error message
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            id={`amount-${idx}`}
                                            name="amount"
                                            label="Amount"
                                            value={el.amount}
                                            onChange={(e) => {
                                                const inputValue = e.target.value;

                                                // Allow only digits
                                                const regex = /^[0-9]*$/;
                                                const maxValue = 10
                                                if (regex.test(inputValue) && inputValue.length <= maxValue) {
                                                    const newFieldset = [...state.structure];
                                                    newFieldset[idx].amount = inputValue;
                                                    setState({ ...state, structure: newFieldset });
                                                }
                                            }}
                                            error={!!errors[`structure${idx}`]} // Show error if it exists
                                            helperText={errors[`structure${idx}`]} // Display error message
                                        />
                                    </Grid>

                                    {/* Delete Icon (unchanged) */}
                                    {idx > 0 && (
                                        <Grid item xs={1}>
                                            <DeleteIcon
                                                onClick={() => handleDeleteSection(idx)}
                                                style={{
                                                    cursor: "pointer",
                                                    color: "red",
                                                    width: 24,
                                                    height: 24,
                                                    marginTop: 8,
                                                }}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            ))}
                            <Grid item xs={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddSection}
                                >
                                    + Add Section
                                </Button>
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
                                    onClick={handleUpdatePayroll}
                                >
                                    Update
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={hendleCreatePayroll}
                                >
                                    Create
                                </Button>
                            </>
                        )}

                    </DialogActions>
                </Dialog>
            </div >

            {rowdata && (
                <TablePlayground
                    title="Payroll List"
                    columnData={columnData}
                    rowData={rowdata}
                    component="div"
                    count={rowdata.length} // Total number of rows
                    rowsPerPage={rowsPerPage} // Number of rows per page
                    page={page} // Current page
                    onPageChange={handlePageChange} // Handle page change
                    onRowsPerPageChange={handleRowsPerPageChange} // Handle rows per page change
                    MonthAndYear={MonthAndYear} // Pass the component reference
                    onMonthYearChange={handleMonthYearChange} // Pass the callback function
                />
            )
            }

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
        </>
    );
}

export default Payroll;
