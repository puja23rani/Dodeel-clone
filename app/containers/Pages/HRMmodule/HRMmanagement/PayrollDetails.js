import { Autocomplete, Button, Divider, FormControlLabel, FormHelperText, Grid, Paper, Radio, RadioGroup, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme, Popper, ClickAwayListener, MenuList, MenuItem, Grow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { green } from '@mui/material/colors';
import MaterialDropZone from '../../../../components/Forms/MaterialDropZone';
import { storage } from '../../../../../firebase.config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from "date-fns";
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

const PayrollDetails = () => {

    const theme = useTheme(); // Get the current theme
    console.log(theme);
    const { classes } = useStyles();
    const navigate = useNavigate();

    const location = useLocation();
    const { id } = location.state || {};

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const [payrollData, setPayrollData] = useState([
        { month: "January", currentSalary: "50,000", netSalary: "20,000,000", status: "Paid" },
        { month: "February", currentSalary: "50,000", netSalary: "20,000,000", status: "Pending" },
        { month: "March", currentSalary: "52,000", netSalary: "20,000,000", status: "Paid" },
        { month: "April", currentSalary: "52,000", netSalary: "20,000,000", status: "Paid" },
        { month: "May", currentSalary: "54,000", netSalary: "20,000,000", status: "Pending" },
    ]);

    useEffect(() => {
        if (id) {
            (async function getEmployeeDetailsById() {
                try {
                    const loginHeaders = new Headers();
                    loginHeaders.append("Content-Type", "application/json");

                    const authToken = localStorage.getItem("token");
                    if (authToken) {
                        loginHeaders.append("Authorization", `Bearer ${authToken}`);
                    }

                    const data = {
                        employeeID: 65
                    };

                    const requestOptions = {
                        method: "POST",
                        headers: loginHeaders,
                        body: JSON.stringify(data),
                    };

                    const res = await fetch(
                        `${process.env.REACT_APP_BASE_URL}/api/auth/getPayrollByEmployeeID`,
                        requestOptions
                    );
                    const actualData = await res.json();

                    console.log(actualData);
                    setPayrollData(actualData?.payroll || []); // Assume payroll data is an array

                } catch (err) {
                    console.log(err);
                }
            })();
        }
    }, [id]);


    return (
        <div>
            <Paper style={{ padding: 30 }} id="Customer-content">
                <div>
                    <Typography style={{ fontWeight: "bold", fontSize: "20px", color: "#30ccde" }}>
                        Name: xyz
                    </Typography>
                    <Typography style={{ marginTop: 8 }}>
                        PhoneNumber: xyz
                    </Typography>
                    <Typography style={{ marginTop: 8 }}>
                        Email: xyz
                    </Typography>
                    <Divider className={classes.divider} />

                    <TableContainer component={Paper}>
                        <Table aria-label="payroll details table">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Month
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Current Salary
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Net Salary
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Status
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payrollData.length > 0 ? payrollData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.month}</TableCell>
                                        <TableCell>{row.currentSalary}</TableCell>
                                        <TableCell>{row.netSalary}</TableCell>
                                        <TableCell>{row.status}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            No payroll data available.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Paper>
        </div>
    );
};

export default PayrollDetails;
