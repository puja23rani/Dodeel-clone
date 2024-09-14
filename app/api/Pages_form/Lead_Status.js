import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useFormik } from "formik";
import * as yup from "yup";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";
import DoneIcon from "@mui/icons-material/Done";
import AdvFilter from "../../containers/Tables/demos/AdvFilter";
import { Chip, LinearProgress } from "@mui/material";
import { PapperBlock } from "enl-components";
import TablePlayground from "../../containers/Tables/TablePlayground";
import { Description } from "@mui/icons-material";
import axios from "axios";
import AlertDialog from "../../containers/UiElements/demos/DialogModal/AlertDialog";

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
  fieldBasic: {
    width: "100%",
    marginBottom: 20,
    marginTop: 10,
  },
  inlineWrap: {
    display: "flex",
    flexDirection: "row",
  },
  buttonInit: {
    margin: theme.spacing(4),
    textAlign: "center",
  },
}));

function Lead_Status() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");
  const defaultData = {
    Status: "",
    Description: "",
  };
  const [state, setState] = React.useState({
    Status_Name: "",
    Description: "",
    searchText: "",
    isUpdate: false,
  });
  const [sampleData, setSampleData] = useState(defaultData);
  const [leadStatusList, setLeadStatusList] = React.useState([]);
  const [rowdata, setRowdata] = React.useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [id, setId] = useState(0);

  const columnData = [
    {
      id: "statusName",
      numeric: false,
      disablePadding: false,
      label: "Status Name",
    },
    {
      id: "description",
      numeric: false,
      disablePadding: false,
      label: "Description",
    },
    { id: "actions", label: "Action" },
  ];

  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) =>
    setRowsPerPage(parseInt(event.target.value, 10));
  function table() {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/auth/getAllLeadStatus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle the response
        if (response.data.data) {
          // setLeadStatusList(response.data.data);
          setRowdata(
            response.data.data.map((item) => ({
              id: item._id, // Use _id from API as the row ID
              statusName: item.statusName, // Map statusName from API
              description: item.description, // Map description from API
              actions: (
                <>
                  <IconButton aria-label="Edit">
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    aria-label="Delete"
                    onClick={() => {
                      setId(item._id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              ),
            }))
          );
        }
        console.log(response.data.data);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }
  React.useEffect(() => {
    table();
  }, []);
  const handleCreateLeadStatus = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const token = localStorage.getItem("token");
      if (token) {
        loginHeaders.append("Authorization", `Bearer ${token}`);
      }
      const data = {
        statusName: state.Status_Name,
        description: state.Description,
      };

      if (state.Status_Name == "" || state.Description == "") {
        toast.error("Fill all the information", {
          position: "top-center",
        });
      } else {
        const requestOptions = {
          method: "POST",
          headers: loginHeaders,
          body: JSON.stringify(data),
        };
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/auth/createLeadStatus`,
          requestOptions
        );

        const actualData = await res.json();
        console.log(actualData);
        // setVisaList(actualData.Country);
        if (actualData.status == 200) {
          table();
          setState({
            Status_Name: "",
            Description: "",
            id: "",
            searchText: "",
            isUpdate: false,
          });

          toast.success("Created successfully!", {
            position: "top-center",
          });

          localStorage.removeItem("fee_icon");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to save. Please try again.", {
        position: "top-center",
      });
    }
  };
  const handleLeadStatusDelete = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const Token = localStorage.getItem("token");
      if (Token) {
        loginHeaders.append("Authorization", `Bearer ${Token}`);
      }
      const data = { id: id };
      const requestOptions = {
        method: "DELETE",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteLeadStatus`,
        requestOptions
      );
      const actualData = await res.json();
      console.log(actualData);
      // setVisaList(actualData.Country);
      if (actualData.status == 200) {
        handleCloseDialog();
        table();
        toast.success("Deleted successfully!", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
      });
    }
  };
  const handleUpdateLeadStatus = async (idx) => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const token = localStorage.getItem("token");
      if (token) {
        loginHeaders.append("Authorization", `Bearer ${token}`);
      }
      const data = {
        id: idx,
        statusName: state.Status_Name,
        description: state.Description,
      };

      if (state.Status_Name == "" || state.Description == "" || idx == "") {
        toast.error("Fill all the information", {
          position: "top-center",
        });
      } else {
        const requestOptions = {
          method: "PUT",
          headers: loginHeaders,
          body: JSON.stringify(data),
        };
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/updateLeadStatus`,
          requestOptions
        );

        const actualData = await res.json();
        console.log(actualData.holidays);
        // setVisaList(actualData.Country);
        if (actualData.status == 200) {
          table();
          setState({
            Status_Name: "",
            Description: "",
            id: "",
            searchText: "",
            isUpdate: false,
          });
          toast.success("Updated successfully!", {
            position: "top-center",
          });

          localStorage.removeItem("updateId");
          localStorage.removeItem("fee_icon");
          // Navigate("/Department");
        }
      }
    } catch (err) {
      console.log(err);
      // toast.error("Failed to save. Please try again.", {
      //   position: "top-center",
      // });
    }

    console.log(idx);
  };
  return (
    <>
      <PapperBlock title="Lead Status" icon="library_books">
        <div>
          <Grid
            container
            spacing={3}
            alignItems="flex-start"
            direction="row"
            justifyContent="stretch"
          >
            <Grid item xs={12}>
              {/* <Button color="primary" onClick={initData}>
                Load Sample Data
              </Button>
              <Button onClick={clearData}>Clear Data</Button> */}
              <div className={classes.form}>
                <Grid container spacing={2}>
                  {/* Align Name and Email fields side by side */}
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      variant="standard"
                      id="Status"
                      name="Status"
                      label="Status"
                      value={state.Status_Name}
                      onChange={(e) => {
                        setState({ ...state, Status_Name: e.target.value });
                      }}
                      // error={
                      //   formik.touched.Status && Boolean(formik.errors.Status)
                      // }
                      // helperText={formik.touched.Status && formik.errors.Status}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      variant="standard"
                      id="Description"
                      name="Description"
                      label="Description"
                      value={state.Description}
                      onChange={(e) => {
                        setState({ ...state, Description: e.target.value });
                      }}
                      // error={
                      //   formik.touched.Description &&
                      //   Boolean(formik.errors.Description)
                      // }
                      // helperText={
                      //   formik.touched.Description && formik.errors.Description
                      // }
                    />
                  </Grid>
                </Grid>

                {/* Password field takes up the full row */}
                {/* <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                </Grid>

                <FormControl fullWidth>
                  <InputLabel variant="standard" id="demo-simple-select-label">
                    Select
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="select"
                    name="select"
                    variant="standard"
                    label="Select Option"
                    value={formik.values.select}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="option 1">Option 1</MenuItem>
                    <MenuItem value="option 2">Option 2</MenuItem>
                    <MenuItem value="option 3">Option 3</MenuItem>
                  </Select>
                </FormControl>

                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="check"
                        name="check"
                        checked={formik.values.check}
                        onChange={formik.handleChange}
                      />
                    }
                    label="Check"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        id="switch"
                        name="switch"
                        checked={formik.values.switch}
                        onChange={formik.handleChange}
                      />
                    }
                    label="Switch ON/OFF"
                  />
                </FormGroup> */}

                {/* Rest of your fields */}
                {/* <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">
                    Options
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={formik.values.option}
                    onChange={formik.handleChange}
                    id="option"
                    name="option"
                  >
                    <FormControlLabel
                      value="option 1"
                      control={<Radio />}
                      label="Option 1"
                    />
                    <FormControlLabel
                      value="option 2"
                      control={<Radio />}
                      label="Option 2"
                    />
                    <FormControlLabel
                      value="option 3"
                      control={<Radio />}
                      label="Option 3"
                    />
                    <FormControlLabel
                      value="option 4"
                      control={<Radio />}
                      label="Option 4"
                    />
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <FormLabel id="demo-check--group-label">Options</FormLabel>
                  <FormGroup row aria-labelledby="demo-check--group-label">
                    <FormControlLabel
                      value="option 1"
                      checked={formik.values.group.indexOf("option 1") > -1}
                      name="group"
                      onChange={formik.handleChange}
                      control={<Checkbox />}
                      label="Option 1"
                    />
                    <FormControlLabel
                      value="option 2"
                      checked={formik.values.group.indexOf("option 2") > -1}
                      name="group"
                      onChange={formik.handleChange}
                      control={<Checkbox />}
                      label="Option 2"
                    />
                    <FormControlLabel
                      value="option 3"
                      checked={formik.values.group.indexOf("option 3") > -1}
                      name="group"
                      onChange={formik.handleChange}
                      control={<Checkbox />}
                      label="Option 3"
                    />
                    <FormControlLabel
                      value="option 4"
                      checked={formik.values.group.indexOf("option 4") > -1}
                      name="group"
                      onChange={formik.handleChange}
                      control={<Checkbox />}
                      label="Option 4"
                    />
                  </FormGroup>
                </FormControl> */}

                {/* <TextField
                  fullWidth
                  multiline
                  variant="standard"
                  rows={4}
                  id="textarea"
                  name="textarea"
                  label="Textarea"
                  value={formik.values.textarea}
                  onChange={formik.handleChange}
                /> */}

                <Grid container justifyContent="flex-end">
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    onClick={handleCreateLeadStatus}
                  >
                    Submit
                  </Button>
                </Grid>
                {/* </orm> */}
              </div>
            </Grid>
          </Grid>
        </div>
      </PapperBlock>

      {rowdata && (
        <TablePlayground
          columnData={columnData}
          rowData={rowdata}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}
      {id && <AlertDialog onDelete={handleLeadStatusDelete} />}
    </>
  );
}

export default Lead_Status;
