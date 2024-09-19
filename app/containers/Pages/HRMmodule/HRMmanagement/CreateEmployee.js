import { Autocomplete, Button, Divider, FormControlLabel, FormHelperText, Grid, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui';
import { green } from '@mui/material/colors';
import MaterialDropZone from '../../../../components/Forms/MaterialDropZone';
import { storage } from '../../../../../firebase.config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from "date-fns"; // Use date-fns for date manipulation
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


const CreateEmployee = () => {
    const { classes } = useStyles();
    const navigate = useNavigate();

    const location = useLocation();
    const { updateId } = location.state || {};

    console.log(updateId);

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");

    const today = new Date();
    const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18));
    const formattedMaxDate = format(eighteenYearsAgo, "yyyy-MM-dd");

    const [state, setState] = useState({
        employeeName: "",
        dateOfBirth: "",
        gender: "",
        email: "",
        emergencyPhoneNumber: "",
        address: "",
        country: "",
        password: "",
        phoneNumber: "",
        companyName: "",
        companyCode: "",
        departmentName: "",
        designationName: "",
        workShift: "",
        passportSizePhoto: "",
        identity: "",
        educationCertificate: "",
        panCard: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        bankName: "",
        branchName: "",
        isUpdate: false
    });


    const [errors, setErrors] = useState({
        employeeName: "",
        dateOfBirth: "",
        gender: "",
        email: "",
        emergencyPhoneNumber: "",
        address: "",
        country: "",
        password: "",
        phoneNumber: "",
        companyName: "",
        companyCode: "",
        departmentName: "",
        designationName: "",
        workShift: "",
        passportSizePhoto: "",
        identity: "",
        panCard: "",
        educationCertificate: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        bankName: "",
        branchName: "",
    });

    const validate = () => {
        let isValid = true;
        let errors = {};

        if (!state.employeeName.trim()) {
            errors.employeeName = "Employee Name is required";
            isValid = false;
        }

        if (!state.dateOfBirth.trim()) {
            errors.dateOfBirth = "Date Of Birth is required";
            isValid = false;
        }

        if (!state.gender.trim()) {
            errors.gender = "Gender is required";
            isValid = false;
        }

        if (!state.email.trim()) {
            errors.email = "Email is required";
            isValid = false;
        }

        // console.log(state.phoneNumber.length === 10);

        if (state.phoneNumber.length !== 10) {
            errors.phoneNumber = "Please Enter Valid Phone Number";
            isValid = false;
        }

        if (state.emergencyPhoneNumber.length !== 10) {
            errors.emergencyPhoneNumber = "Please Enter Valid Phone Number";
            isValid = false;
        }

        if (!state.address.trim()) {
            errors.address = "Address is required";
            isValid = false;
        }

        if (!state.country.trim()) {
            errors.country = "Country is required";
            isValid = false;
        }

        if (!state.password.trim()) {
            errors.password = "Password is required";
            isValid = false;
        }

        if (!state.companyName.trim()) {
            errors.companyName = "Company Name is required";
            isValid = false;
        }

        if (!state.companyCode.trim()) {
            errors.companyCode = "Company Code is required";
            isValid = false;
        }

        if (!state.departmentName) {
            errors.departmentName = "Department Name is required";
            isValid = false;
        }

        if (!state.designationName) {
            errors.designationName = "Designation Name is required";
            isValid = false;
        }

        if (!state.workShift) {
            errors.workShift = "Work Shift is required";
            isValid = false;
        }

        if (!state.passportSizePhoto) {
            errors.passportSizePhoto = "Passport Size Photo is required";
            isValid = false;
        }

        if (!state.identity) {
            errors.identity = "Identity is required";
            isValid = false;
        }

        if (!state.panCard) {
            errors.panCard = "Pan Card is required";
            isValid = false;
        }

        if (!state.educationCertificate) {
            errors.educationCertificate = "Education Certificate is required";
            isValid = false;
        }

        if (!state.accountNumber.trim()) {
            errors.accountNumber = "Account Number is required";
            isValid = false;
        }

        if (!state.ifscCode.trim()) {
            errors.ifscCode = "IFSC Code is required";
            isValid = false;
        }

        if (!state.accountHolderName.trim()) {
            errors.accountHolderName = "Account Holder Name is required";
            isValid = false;
        }

        if (!state.bankName.trim()) {
            errors.bankName = "Bank Name is required";
            isValid = false;
        }

        if (!state.branchName.trim()) {
            errors.branchName = "Branch Name is required";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const [dptList, setDtLptist] = useState([]);
    const [degList, setDegList] = useState([]);
    const [workList, setWorkList] = React.useState([]);

    const getDepartmentDetails = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/getDepartmentDetails`,
                requestOptions
            );
            const actualData = await res.json();
            // console.log(actualData);
            if (Array.isArray(actualData.departments)) {
                // Map the data to an array of objects with 'title' and 'id'
                const newobj = actualData.departments.map((item) => ({
                    title: item.departmentName, // Set the title from channelName
                    id: item._id, // Set the id from _id
                }));
                //console.log(newobj, "neee");
                // Update state with the new array of objects
                setDtLptist(newobj);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getDesignationDetails = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/getDesignationDetails`,
                requestOptions
            );
            const actualData = await res.json();
            // console.log(actualData);

            if (Array.isArray(actualData.designations)) {
                // Map the data to an array of objects with 'title' and 'id'
                const newobj = actualData.designations.map((item) => ({
                    title: item.designationName, // Set the title from channelName
                    id: item._id, // Set the id from _id
                }));
                //console.log(newobj, "neee");
                // Update state with the new array of objects
                setDegList(newobj);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getWorkShiftDetails = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/getWorkshiftDetails`,
                requestOptions
            );
            const actualData = await res.json();

            // console.log(actualData);
            if (Array.isArray(actualData.workshifts)) {
                // Map the data to an array of objects with 'title' and 'id'
                const newobj = actualData.workshifts.map((item) => ({
                    title: item.workShift, // Set the title from channelName
                    id: item._id, // Set the id from _id
                }));
                //console.log(newobj, "neee");
                // Update state with the new array of objects
                setWorkList(newobj);
            }

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getDepartmentDetails();
        getDesignationDetails();
        getWorkShiftDetails();
    }, []);

    useEffect(() => {
        if (updateId) {
            (async function getEmployeeDetailsById() {
                try {
                    const loginHeaders = new Headers();
                    loginHeaders.append("Content-Type", "application/json");

                    // Assuming you have an authorization token stored in localStorage
                    const authToken = localStorage.getItem("token");
                    if (authToken) {
                        loginHeaders.append("Authorization", `Bearer ${authToken}`);
                    }

                    const data = {
                        id: updateId
                    }

                    const requestOptions = {
                        method: "POST",
                        headers: loginHeaders,
                        body: JSON.stringify(data),
                    };
                    const res = await fetch(
                        `${process.env.REACT_APP_BASE_URL}/api/auth/getEmployeeDetailsById`,
                        requestOptions
                    );
                    const actualData = await res.json();

                    console.log(actualData);
                    // console.log(actualData.employee.officialDetails.startTime);
                    // console.log(actualData.employee.officialDetails.endTime);
                    // console.log(`${actualData.employee.officialDetails.startTime} - ${actualData.employee.officialDetails.endTime}`);

                    setState((prevState) => ({
                        ...prevState,
                        employeeName: actualData.employee.personalDetails.employeeName,
                        dateOfBirth: actualData.employee.personalDetails.dateOfBirth.split('T')[0],
                        gender: actualData.employee.personalDetails.gender,
                        email: actualData.employee.personalDetails.email,
                        phoneNumber: actualData.employee.personalDetails.phoneNumber,
                        emergencyPhoneNumber: actualData.employee.personalDetails.emergencyPhoneNumber,
                        address: actualData.employee.personalDetails.address,
                        country: actualData.employee.personalDetails.country,
                        companyName: actualData.employee.officialDetails.companyDetails,
                        companyCode: actualData.employee.officialDetails.employeeCode,
                        departmentName: {
                            title: actualData.employee.officialDetails.departmentName,
                            id: actualData.employee.officialDetails.departmentID
                        },
                        designationName: {
                            title: actualData.employee.officialDetails.designationName,
                            id: actualData.employee.officialDetails.designationID
                        },
                        workShift: {
                            title: `${actualData.employee.officialDetails.startTime} - ${actualData.employee.officialDetails.endTime}`,
                            id: actualData.employee.officialDetails.workShiftID
                        },
                        passportSizePhoto: actualData.employee.documents.passportSizePhoto,
                        identity: actualData.employee.documents.identity,
                        panCard: actualData.employee.documents.panCard,
                        educationCertificate: actualData.employee.documents.recentCertification,
                        accountNumber: actualData.employee.documents.bankAccountDetails.accountNumber,
                        ifscCode: actualData.employee.documents.bankAccountDetails.ifscCode,
                        accountHolderName: actualData.employee.documents.bankAccountDetails.accountHolderName,
                        bankName: actualData.employee.documents.bankAccountDetails.bankName,
                        branchName: actualData.employee.documents.bankAccountDetails.branchName,
                        isUpdate: true
                    }));

                } catch (err) {
                    console.log(err);
                }
            })()
        }
    }, [])

    const [isLoading, setisLoading] = useState(false)

    const handleUpdateEmployee = async () => {
        if (!validate) {

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
                id: updateId,
                personalDetails: {
                    employeeName: state.employeeName,
                    dateOfBirth: state.dateOfBirth,
                    gender: state.gender,
                    phoneNumber: state.phoneNumber,
                    emergencyPhoneNumber: state.emergencyPhoneNumber,
                    address: state.address,
                    country: state.country,
                    email: state.email,
                    password: state.password,
                },
                officialDetails: {
                    departmentID: state.departmentName.id,
                    departmentName: state.departmentName.title,
                    designationID: state.designationName.id,
                    designationName: state.designationName.title,
                    workShiftID: state.workShift.id,
                    workShift: state.workShift.title,

                    companyDetails: state.companyName,
                    employeeCode: state.companyCode,
                },
                documents: {
                    recentCertification: state.educationCertificate,
                    passportSizePhoto: state.passportSizePhoto,
                    identity: state.identity,
                    panCard: state.panCard,

                    bankAccountDetails: {
                        accountNumber: state.accountNumber,
                        ifscCode: state.ifscCode,
                        accountHolderName: state.accountHolderName,
                        bankName: state.bankName,
                        branchName: state.branchName,
                    },
                },
            };
            const requestOptions = {
                method: "PUT",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/updateEmployee`,
                requestOptions
            );
            const actualData = await res.json();
            console.log(actualData);

            if (actualData.status == 200) {

                setState((prevState) => ({
                    ...prevState,
                    employeeName: "",
                    dateOfBirth: "",
                    gender: "",
                    email: "",
                    emergencyPhoneNumber: "",
                    address: "",
                    country: "",
                    password: "",
                    phoneNumber: "",
                    companyName: "",
                    companyCode: "",
                    departmentName: "",
                    designationName: "",
                    workShift: "",
                    passportSizePhoto: "",
                    identity: "",
                    educationCertificate: "",
                    panCard: "",
                    accountNumber: "",
                    ifscCode: "",
                    accountHolderName: "",
                    bankName: "",
                    branchName: "",
                }));
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleFilesChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setisLoading(true);
            const imageRef = ref(storage, `/photo/${file.name}`);
            uploadBytes(imageRef, file).then(() => {
                getDownloadURL(imageRef).then(url => {
                    // console.log(url);
                    setState(prevState => ({
                        ...prevState,
                        [field]: url
                    }));
                    setisLoading(false);
                });
            });
        }
    };

    const handleCreateEMP = async () => {
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
                personalDetails: {
                    employeeName: state.employeeName,
                    dateOfBirth: state.dateOfBirth,
                    gender: state.gender,
                    phoneNumber: state.phoneNumber,
                    emergencyPhoneNumber: state.emergencyPhoneNumber,
                    address: state.address,
                    country: state.country,
                    email: state.email,
                    password: state.password,
                },
                officialDetails: {
                    departmentID: state.departmentName.id,
                    designationID: state.designationName.id,
                    workShiftID: state.workShift.id,
                    companyDetails: state.companyName,
                    employeeCode: state.companyCode,
                },
                documents: {
                    recentCertification: state.educationCertificate,
                    passportSizePhoto: state.passportSizePhoto,
                    identity: state.identity,
                    panCard: state.panCard,
                    bankAccountDetails: {
                        accountNumber: state.accountNumber,
                        ifscCode: state.ifscCode,
                        accountHolderName: state.accountHolderName,
                        bankName: state.bankName,
                        branchName: state.branchName,
                    },
                },
            };
            const requestOptions = {
                method: "POST",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/createEmployee`,
                requestOptions
            );
            const actualData = await res.json();
            // console.log(actualData);
            // setVisaList(actualData.Country);
            if (actualData.status == 200) {
                setState((prevState) => ({
                    ...prevState,
                    employeeName: "",
                    dateOfBirth: "",
                    gender: "",
                    email: "",
                    emergencyPhoneNumber: "",
                    address: "",
                    country: "",
                    password: "",
                    phoneNumber: "",
                    companyName: "",
                    companyCode: "",
                    departmentName: "",
                    designationName: "",
                    workShift: "",
                    passportSizePhoto: "",
                    identity: "",
                    panCard: "",
                    educationCertificate: "",
                    accountNumber: "",
                    ifscCode: "",
                    accountHolderName: "",
                    bankName: "",
                    branchName: "",
                }));
                navigate("/app/hrm-setting/employee-details");
            } else {
                setMessage(actualData.message);
                setOpen(true);
                setSeverity("error");
            }
        } catch (err) {
            console.log(err);
            setMessage("Something went wrong!");
            setOpen(true);
            setSeverity("error");
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Grid
                container
                alignItems="stretch"
                justifyContent="flex-start"
                direction="row"
                spacing={2}
            >
                <Grid item md={6} xs={12}>
                    <Paper
                        elevation={2}
                        style={{ padding: "20px" }}
                    >
                        <Typography variant="button" className={classes.divider} style={{ paddingBottom: "40px" }}>Personal Detail</Typography>
                        <Divider />
                        <div style={{ display: "flex", gap: "20px" }}>
                            <Grid sx={{ width: "100%" }}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="employeeName"
                                    name="employeeName"
                                    label="Employee Name"
                                    value={state.employeeName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const maxValue = 50
                                        if (value.length <= maxValue) {
                                            setState({ ...state, employeeName: e.target.value });
                                        }
                                    }}
                                    error={!!errors.employeeName}
                                    helperText={errors.employeeName}
                                />
                            </Grid>
                            <Grid sx={{ width: "100%" }}>
                                <TextField
                                    id="date"
                                    label="Date of Birth"
                                    type="date"
                                    variant="standard"
                                    value={state.dateOfBirth} // Set default value to 18 years ago
                                    sx={{ width: "100%" }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        max: formattedMaxDate, // Set the max date to exactly 18 years ago
                                    }}
                                    onChange={(e) => setState({ ...state, dateOfBirth: e.target.value })}
                                    error={!!errors.dateOfBirth}
                                    helperText={errors.dateOfBirth}
                                />
                            </Grid>
                        </div>
                        <div style={{ display: "flex", gap: "20px" }}>
                            <Grid sx={{ width: "100%" }}>
                                <p style={{ fontSize: "12px", fontWeight: "bold" }}>Gender</p>
                                <RadioGroup
                                    aria-label="gender"
                                    name="gender1"
                                    className={classes.group}
                                    value={state.gender}
                                    onChange={(e) => setState({ ...state, gender: e.target.value })}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                    <FormHelperText error>{errors.gender}</FormHelperText>
                                </RadioGroup>
                            </Grid>
                            <Grid sx={{ width: "100%" }}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="country"
                                    name="country"
                                    label="Country Name"
                                    value={state.country}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const maxValue = 50
                                        if (value.length <= maxValue) {
                                            setState({ ...state, country: e.target.value });
                                        }
                                    }}
                                    error={!!errors.country}
                                    helperText={errors.country}
                                />
                            </Grid>
                        </div>
                        <div style={{ display: "flex", gap: "20px" }}>
                            <Grid sx={{ width: "100%", marginTop: "-10px" }}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    value={state.email}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const maxValue = 50
                                        if (value.length <= maxValue) {
                                            setState({ ...state, email: e.target.value });
                                        }
                                    }}
                                    error={!!errors.email} // Show error if it exists
                                    helperText={errors.email} // Display error message
                                />
                            </Grid>
                            <Grid sx={{ width: "100%", marginTop: "-10px" }}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="password"
                                    name="password"
                                    label={`${updateId ? "Update or Leave it blank" : "Create a password"}`}
                                    value={state.password}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const maxValue = 15
                                        if (value.length <= maxValue) {
                                            setState({ ...state, password: e.target.value });
                                        }
                                    }}
                                    error={!!errors.password} // Show error if it exists
                                    helperText={errors.password} // Display error message
                                />
                            </Grid>
                        </div>
                        <div style={{ display: "flex", gap: "20px" }}>
                            <Grid sx={{ width: "100%", marginTop: "-10px" }}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    label="Phone Number"
                                    value={state.phoneNumber}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const maxValue = 10
                                        const regex = /^[0-9]*$/;
                                        if (regex.test(value) && value.length <= maxValue) {
                                            setState({ ...state, phoneNumber: e.target.value });
                                        }
                                    }}
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber}
                                />
                            </Grid>
                            <Grid sx={{ width: "100%", marginTop: "-10px" }}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="emergencyPhoneNumber"
                                    name="emergencyPhoneNumber"
                                    label="Emergency Phone Number"
                                    value={state.emergencyPhoneNumber}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const maxValue = 10
                                        const regex = /^[0-9]*$/;
                                        if (regex.test(value) && value.length <= maxValue) {
                                            setState({ ...state, emergencyPhoneNumber: e.target.value });
                                        }
                                    }}
                                    error={!!errors.emergencyPhoneNumber}
                                    helperText={errors.emergencyPhoneNumber}
                                />
                            </Grid>
                        </div>
                        <div style={{ marginTop: "-10px" }}>
                            <Grid sx={{ width: "100%" }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="address"
                                    name="address"
                                    label="Address (e.g. 123 Main St, Anytown, USA)"
                                    value={state.address}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const maxValue = 50
                                        if (value.length <= maxValue) {
                                            setState({ ...state, address: e.target.value });
                                        }
                                    }}
                                    error={!!errors.address} // Show error if it exists
                                    helperText={errors.address} // Display error message
                                />
                            </Grid>
                        </div>
                    </Paper>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Paper
                        elevation={2}
                        style={{ padding: "20px" }}
                    >
                        <Typography variant="button" className={classes.divider} style={{ paddingBottom: "40px" }}>Offical Details</Typography>
                        <Divider />
                        <div style={{ display: "flex", gap: "20px" }}>
                            <Grid sx={{ width: "100%" }}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="companyName"
                                    name="companyName"
                                    label="Company Name"
                                    value={state.companyName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        const maxValue = 50
                                        if (regex.test(value) && value.length <= maxValue) {
                                            setState({ ...state, companyName: e.target.value });
                                        }
                                    }}
                                    error={!!errors.companyName} // Show error if it exists
                                    helperText={errors.companyName} // Display error message
                                />
                            </Grid>
                            <Grid sx={{ width: "100%" }}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="companyCode"
                                    name="companyCode"
                                    label="Company Code"
                                    value={state.companyCode}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const maxValue = 10
                                        if (value.length <= maxValue) {
                                            setState({ ...state, companyCode: e.target.value });
                                        }
                                    }}
                                    error={!!errors.companyCode} // Show error if it exists
                                    helperText={errors.companyCode} // Display error message
                                />
                            </Grid>
                        </div>
                        <div style={{ display: "flex", gap: "20px", marginTop: "-10px" }}>
                            <Grid sx={{ width: "100%" }}>
                                <Autocomplete
                                    sx={{
                                        marginTop: "-16px"
                                    }}
                                    id="tags-standard"
                                    options={dptList}
                                    getOptionLabel={(option) => option.title || ""} // Safely access title
                                    value={state.departmentName} // Ensure value is an object or null
                                    onChange={(e, v) => {
                                        // console.log(v);
                                        setState({
                                            ...state,
                                            departmentName: v ? v : null, // Set campaignStatus to the selected object or null
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Department Name"
                                            margin="normal"
                                            variant="standard"
                                            error={!!errors.departmentName} // Show error if it exists
                                            helperText={errors.departmentName} // Display error message
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid sx={{ width: "100%" }}>
                                <Autocomplete
                                    sx={{
                                        marginTop: "-16px"
                                    }}
                                    id="tags-standard"
                                    options={degList}
                                    getOptionLabel={(option) => option.title || ""} // Safely access title
                                    value={state.designationName} // Ensure value is an object or null
                                    onChange={(e, v) => {
                                        // console.log(v);
                                        setState({
                                            ...state,
                                            designationName: v ? v : null, // Set campaignStatus to the selected object or null
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Designation Name"
                                            margin="normal"
                                            variant="standard"
                                            error={!!errors.designationName} // Show error if it exists
                                            helperText={errors.designationName} // Display error message
                                        />
                                    )}
                                />
                            </Grid>
                        </div>
                        <div style={{ display: "flex", gap: "20px" }}>
                            <Grid sx={{ width: "100%" }}>
                                <Autocomplete
                                    sx={{
                                        marginTop: "-16px"
                                    }}
                                    id="tags-standard"
                                    options={workList}
                                    getOptionLabel={(option) => option.title || ""} // Safely access title
                                    value={state.workShift} // Ensure value is an object or null
                                    onChange={(e, v) => {
                                        // console.log(v);
                                        setState({
                                            ...state,
                                            workShift: v ? v : null, // Set campaignStatus to the selected object or null
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Work Shift Name"
                                            margin="normal"
                                            variant="standard"
                                            error={!!errors.workShift} // Show error if it exists
                                            helperText={errors.workShift} // Display error message
                                        />
                                    )}
                                />
                            </Grid>
                        </div>
                    </Paper>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Paper
                        elevation={2}
                        style={{ padding: "20px" }}
                    >
                        <Typography variant="button" className={classes.divider} style={{ paddingBottom: "40px" }}>Personal Document</Typography>
                        <Divider />
                        <div style={{ display: "flex", gap: "20px" }}>
                            <Grid sx={{ width: "50%", paddingTop: "28px" }}>
                                <Typography variant="body2">Passport Size Photo</Typography>
                            </Grid>
                            <Grid sx={{ paddingTop: "28px" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    <label
                                        style={{
                                            cursor: 'pointer',
                                            position: 'relative',
                                            width: '100%',
                                            overflow: 'hidden',
                                            borderRadius: '0.75rem', // Equivalent to rounded-xl
                                            border: '1px solid #27282C',
                                            backgroundColor: 'white',
                                            fontWeight: '500', // Equivalent to font-medium
                                            color: '#27282C',
                                            fontSize: "12px",
                                            padding: "10px"
                                        }}
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFilesChange(e, "passportSizePhoto")}
                                            style={{
                                                display: 'none', // Equivalent to hidden
                                            }}
                                        />
                                        Click to upload photo
                                    </label>
                                    {state.passportSizePhoto && (
                                        <img src={state.passportSizePhoto} alt="..." width={64} height={64} style={{ marginTop: "10px" }} />
                                    )}
                                </div>
                            </Grid>
                        </div>

                        <div style={{ display: "flex", gap: "20px" }}>
                            <Grid sx={{ width: "50%", paddingTop: "28px" }}>
                                <Typography variant="body2">Identity Proof</Typography>
                            </Grid>
                            <Grid sx={{ paddingTop: "28px" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    <label
                                        style={{
                                            cursor: 'pointer',
                                            position: 'relative',
                                            width: '100%',
                                            overflow: 'hidden',
                                            borderRadius: '0.75rem', // Equivalent to rounded-xl
                                            border: '1px solid #27282C',
                                            backgroundColor: 'white',
                                            fontWeight: '500', // Equivalent to font-medium
                                            color: '#27282C',
                                            fontSize: "12px",
                                            padding: "10px"
                                        }}
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFilesChange(e, "identity")}
                                            style={{
                                                display: 'none', // Equivalent to hidden
                                            }}
                                        />
                                        Click to upload photo
                                    </label>
                                    {state.identity && (
                                        <img src={state.identity} alt="..." width={64} height={64} style={{ marginTop: "10px" }} />
                                    )}
                                </div>
                            </Grid>
                        </div>

                        <div style={{ display: "flex", gap: "20px" }}>
                            <Grid sx={{ width: "50%", paddingTop: "28px" }}>
                                <Typography variant="body2">PAN Card</Typography>
                            </Grid>
                            <Grid sx={{ paddingTop: "28px" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    <label
                                        style={{
                                            cursor: 'pointer',
                                            position: 'relative',
                                            width: '100%',
                                            overflow: 'hidden',
                                            borderRadius: '0.75rem', // Equivalent to rounded-xl
                                            border: '1px solid #27282C',
                                            backgroundColor: 'white',
                                            fontWeight: '500', // Equivalent to font-medium
                                            color: '#27282C',
                                            fontSize: "12px",
                                            padding: "10px"
                                        }}
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFilesChange(e, "panCard")}
                                            style={{
                                                display: 'none', // Equivalent to hidden
                                            }}
                                        />
                                        Click to upload photo
                                    </label>
                                    {state.panCard && (
                                        <img src={state.panCard} alt="..." width={64} height={64} style={{ marginTop: "10px" }} />
                                    )}
                                </div>
                            </Grid>
                        </div>

                        <div style={{ display: "flex", gap: "20px" }}>
                            <Grid sx={{ width: "50%", paddingTop: "28px" }}>
                                <Typography variant="body2">Certificate</Typography>
                            </Grid>
                            <Grid sx={{ paddingTop: "28px" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    <label
                                        style={{
                                            cursor: 'pointer',
                                            position: 'relative',
                                            width: '100%',
                                            overflow: 'hidden',
                                            borderRadius: '0.75rem', // Equivalent to rounded-xl
                                            border: '1px solid #27282C',
                                            backgroundColor: 'white',
                                            fontWeight: '500', // Equivalent to font-medium
                                            color: '#27282C',
                                            fontSize: "12px",
                                            padding: "10px"
                                        }}
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFilesChange(e, "educationCertificate")}
                                            style={{
                                                display: 'none', // Equivalent to hidden
                                            }}
                                        />
                                        Click to upload photo
                                    </label>
                                    {state.educationCertificate && (
                                        <img src={state.educationCertificate} alt="..." width={64} height={64} style={{ marginTop: "10px" }} />
                                    )}
                                </div>
                            </Grid>
                        </div>
                    </Paper>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Paper
                        elevation={2}
                        style={{ padding: "20px" }}
                    >
                        <Typography variant="button" className={classes.divider} style={{ paddingBottom: "40px" }}>Bank Account Details</Typography>
                        <Divider />
                        <div style={{ display: "flex", gap: "20px" }}>
                            <Grid sx={{ width: "100%" }}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="accountHolderName"
                                    name="accountHolderName"
                                    label="Account Holder Name"
                                    value={state.accountHolderName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        const maxValue = 50
                                        if (regex.test(value) && value.length <= maxValue) {
                                            setState({ ...state, accountHolderName: e.target.value });
                                        }
                                    }}
                                    error={!!errors.accountHolderName} // Show error if it exists
                                    helperText={errors.accountHolderName} // Display error message
                                />
                            </Grid>
                            <Grid sx={{ width: "100%" }}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="accountNumber"
                                    name="accountNumber"
                                    label="Account Number"
                                    value={state.accountNumber}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const maxValue = 15
                                        const regex = /^[0-9]*$/;
                                        if (regex.test(value) && value.length <= maxValue) {
                                            setState({ ...state, accountNumber: e.target.value });
                                        }
                                    }}
                                    error={!!errors.accountNumber}
                                    helperText={errors.accountNumber}
                                />
                            </Grid>
                        </div>
                        <div style={{ display: "flex", gap: "20px" }}>
                            <Grid sx={{ width: "100%" }}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="bankName"
                                    name="bankName"
                                    label="Bank Name"
                                    value={state.bankName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        const maxValue = 15
                                        if (regex.test(value) && value.length <= maxValue) {
                                            setState({ ...state, bankName: e.target.value });
                                        }
                                    }}
                                    error={!!errors.bankName} // Show error if it exists
                                    helperText={errors.bankName} // Display error message
                                />
                            </Grid>
                            <Grid sx={{ width: "100%" }}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="branchName"
                                    name="branchName"
                                    label="Branch Name"
                                    value={state.branchName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const maxValue = 15
                                        if (value.length <= maxValue) {
                                            setState({ ...state, branchName: e.target.value });
                                        }
                                    }}
                                    error={!!errors.branchName}
                                    helperText={errors.branchName}
                                />
                            </Grid>
                        </div>
                        <div style={{ display: "flex", gap: "20px" }}>
                            <Grid sx={{ width: "100%" }}>
                                <TextField
                                    fullWidth
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                    variant="standard"
                                    id="ifscCode"
                                    name="ifscCode"
                                    label="IFSC Code"
                                    value={state.ifscCode}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const maxValue = 15
                                        if (value.length <= maxValue) {
                                            setState({ ...state, ifscCode: e.target.value });
                                        }
                                    }}
                                    error={!!errors.ifscCode}
                                    helperText={errors.ifscCode}
                                />
                            </Grid>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container justifyContent="end" marginTop={5}>
                {state.isUpdate ? (
                    <>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={handleUpdateEmployee}
                        >
                            Update
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={handleCreateEMP}
                        >
                            Create
                        </Button>
                    </>
                )}
            </Grid>

            <Popup
                open={open}
                message={message}
                onClose={handleClose}
                severity={severity}
            />
        </div>
    )
}

export default CreateEmployee