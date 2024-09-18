import { Autocomplete, Divider, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui';
import { green } from '@mui/material/colors';

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
        departmentID: "",
        departmentName: "",
        designationName: "",
        designationID: "",
        workShift: "",
        workShiftID: "",
        recentCertification: "",
        passportSizePhoto: "",
        identity: "",
        panCard: "",
        workShiftID: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        bankName: "",
        branchName: "",
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
        departmentID: "",
        departmentName: "",
        designationName: "",
        designationID: "",
        workShift: "",
        workShiftID: "",
        recentCertification: "",
        passportSizePhoto: "",
        identity: "",
        panCard: "",
        workShiftID: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        bankName: "",
        branchName: "",
    });

    const validate = () => {
        let isValid = true;
        let errors = {};

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

    return (
        <Grid
            container
            alignItems="stretch" // Ensures all items have the same height
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
                                defaultValue={state.dateOfBirth}
                                sx={{ width: "100%" }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </div>
                    <div>
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
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
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
                                label="Create a password"
                                value={state.password}
                            // onChange={(e) => {
                            //     const value = e.target.value;
                            //     const maxValue = 50
                            //     if (value.length <= maxValue) {
                            //         setState({ ...state, companyName: e.target.value });
                            //     }
                            // }}
                            // error={!!errors.companyName} // Show error if it exists
                            // helperText={errors.companyName} // Display error message
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
                                    const maxValue = 15
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
                                    const maxValue = 15
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
                    <div style={{ display: "flex", gap: "20px", marginTop: "-10px" }}>
                        <Grid sx={{ width: "100%" }}>
                            <Autocomplete
                                sx={{
                                    marginTop: "-16px"
                                }}
                                id="tags-standard"
                                options={workList}
                                getOptionLabel={(option) => option.title || ""} // Safely access title
                                value={workList} // Ensure value is an object or null
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
                                defaultValue={state.dateOfBirth}
                                sx={{ width: "100%" }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </div>
                    <div>
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
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
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
                                label="Create a password"
                                value={state.password}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const maxValue = 50
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
                                    const maxValue = 15
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
                                    const maxValue = 15
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
                                id="accountHolderName"
                                name="accountHolderName"
                                label="Account Name"
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
                                id="date"
                                label="Date of Birth"
                                type="date"
                                variant="standard"
                                defaultValue={state.dateOfBirth}
                                sx={{ width: "100%" }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </div>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default CreateEmployee