import { Autocomplete, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui';
import Popup from '../../../../components/Popup/Popup';

const useStyles = makeStyles()((theme, _params, classes) => ({
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
    demo: {
        height: 'auto',
    },
    divider: {
        margin: `${theme.spacing(3)} 0`,
    },
    field: {
        margin: `${theme.spacing(3)} 5px`,
    },
    root: {
        color: green[600],
        [`&.${classes.checked}`]: {
            color: green[500],
        },
    },
    formControl: {
        margin: theme.spacing(3),
    },
    group: {
        margin: `${theme.spacing(1)} 0`,
    },
    checked: {},
    size: {
        width: 40,
        height: 40,
    },
    sizeIcon: {
        fontSize: 20,
    },
}));

const Appraisal = () => {

    const [state, setState] = useState({
        employeeName: null,
        currentSalary: "",
        appraisalAmount: "",
        year: "",
        month: "",
        totalAmount: 0
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

        setErrors(errors);
        return isValid;
    };


    const [employees, setEmployees] = useState([]);

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
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");

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
        // if (!validate()) {
        //     setMessage("Please fill all required fields");
        //     setOpen(true);
        //     setSeverity("warning");
        //     return;
        // }
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

    const handleClose = () => {
        setOpen(false);
    };

    console.log(state);



    return (
        <

            >
            <Grid item md={12} xs={12}>
                <Paper
                    elevation={2}
                    style={{ padding: "20px" }}
                >
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
                        <Grid item md={6} xs={12} sx={{ textAlign: "right", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <Typography>New Salary: </Typography>
                            <Typography color={"primary"} sx={{ fontSize: 20, marginLeft: "5px" }}>{state.totalAmount ? state.totalAmount : 0}</Typography>
                        </Grid>
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
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
                            <FormControl fullWidth variant="standard">
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
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth variant="standard">
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
                            </FormControl>
                        </Grid>
                        <Grid container justifyContent="end" marginTop={5}>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={handleCreateAppraisal}
                            >
                                Create
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Popup
                open={open}
                message={message}
                onClose={handleClose}
                severity={severity} // You can change this to "error", "warning", etc.
            />
        </>
    )
}

export default Appraisal