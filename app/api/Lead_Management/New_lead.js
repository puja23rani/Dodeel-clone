import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";
import AlertDialog from "../../containers/UiElements/demos/DialogModal/AlertDialog";
import axios from "axios";
import { PapperBlock } from "enl-components";
import TablePlayground from "../../containers/Tables/TablePlayground";
import { toast } from "react-toastify";
import Popup from "../../components/Popup/Popup";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import DeleteIcons from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { Buttons } from "../../containers/pageListAsync";
import { useNavigate } from "react-router-dom";

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

function New_lead() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    Name: "",
    Phone_Number: "",
    Email: "",
    Campaign: "",
    Campaign_Id: "",
    Channel: "",
    Channel_Id: "",
    Lead_Status: "",
    Lead_Status_Id: "",
    Description: "",
    isUpdate: false,
  });
  const [errors, setErrors] = useState({
    Name: "",
    Phone_Number: "",
    Email: "",
    Campaign: "",
    Campaign_Id: "",
    Channel: "",
    Channel_Id: "",
    Lead_Status: "",
    Lead_Status_Id: "",
    Description: "",
  });
  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.Name.trim()) {
      errors.Name = "Name is required";
      isValid = false;
    }

    if (!state.Phone_Number.toString().trim()) {
      errors.Phone_Number = "Phone Number is required";
      isValid = false;
    } else if (state.Phone_Number.toString().length !== 10) {
      errors.Phone_Number = "Phone Number must be 10 digits";
      isValid = false;
    }

    if (!state.Email.trim()) {
      errors.Email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.Email)) {
      errors.Email = "Email is invalid";
      isValid = false;
    }

    if (!state.Campaign.id) {
      errors.Campaign = "Campaign is required";
      isValid = false;
    }

    if (!state.Channel.id) {
      errors.Channel = "Channel is required";
      isValid = false;
    }

    if (!state.Lead_Status.id) {
      errors.Lead_Status = "Lead Status is required";
      isValid = false;
    }

    if (!state.Description.trim()) {
      errors.Description = "Description is required";
      isValid = false;
    }
    console.log(errors);
    console.log(isValid);
    setErrors(errors);
    return isValid;
  };

  const [rowdata, setRowdata] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [length, setLength] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [pagination, setPagination] = useState(false);

  const columnData = [
    {
      id: "slNo",
      numeric: true,
      disablePadding: false,
      label: "Sl No",
    },
    {
      id: "leadName",
      numeric: false,
      disablePadding: false,
      label: "Lead Name",
    },
    {
      id: "contactNumber",
      numeric: true,
      disablePadding: false,
      label: "Contact Number",
    },
    {
      id: "email",
      numeric: true,
      disablePadding: false,
      label: "Email",
    },
    {
      id: "campaignName",
      numeric: false,
      disablePadding: false,
      label: "Campaign Name",
    },
    {
      id: "channelName",
      numeric: false,
      disablePadding: false,
      label: "Channel Name",
    },
    {
      id: "status",
      numeric: false,
      disablePadding: false,
      label: "Status",
    },

    { id: "actions", label: "Action" },
  ];
  const [empList, setEmpList] = React.useState([]);
  const table3 = async () => {
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
      if (Array.isArray(actualData.employees)) {
        const newobj = actualData.employees.map((item) => ({
          title: item.personalDetails.employeeName, // Set the title from channelName
          id: item._id, // Set the id from _id
        }));
        setEmpList(newobj);
      }
    } catch (err) {
      //console.log(err);
    }
  };
  const [channelList, setChannelList] = React.useState([]);
  const table4 = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllChannels`,
        requestOptions
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const actualData = await res.json();
      //console.log(actualData, "ressss");
      // Check if actualData.data is an array
      if (Array.isArray(actualData.data)) {
        // Map the data to an array of objects with 'title' and 'id'
        const newobj = actualData.data.map((item) => ({
          title: item.channelName, // Set the title from channelName
          id: item._id, // Set the id from _id
        }));
        //console.log(newobj, "neee");
        // Update state with the new array of objects
        setChannelList(actualData.data);
        // setChannelList(actualData.data);
        // Return the array if needed
        return newobj;
      } else {
        throw new Error("Data format is incorrect");
      }
    } catch (err) {
      //console.log(err);
    }
  };
  const [campaignList, setCampaignList] = React.useState([]);
  function table2() {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/auth/getAllCampaigns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle the response
        setCampaignList(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }
  const [leadStatusList, setLeadStatusList] = React.useState([]);
  function table1() {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/auth/getAllLeadStatus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle the response
        setLeadStatusList(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }

  useEffect(() => {
    table1();
    table2();
    table3();
    table4();
  }, []);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);

  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget); // Set the clicked button as the anchor
    setSelectedEmployee(employee); // Set the selected employee
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Reset anchorEl to null to close the menu
    setSelectedEmployee(null); // Reset selected employee
  };

  function fetchLead(pg) {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllLeadDetails`,
        {
          pageNumber: pg,
          pageSize: rowsPerPage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data.data);
        if (response.data.data) {
          setRowdata(
            response.data.data.map((item, index) => ({
              slNo: response.data.data.indexOf(item) + 1,
              id: item._id,
              leadName: item.leadName || "N/A",
              contactNumber: item.contactNumber || "N/A",
              email: item.email || "N/A",
              campaignName: item.campaignID?.campaignName || "N/A",
              channelName: item.channelID?.channelName || "N/A",
              status: item.leadStatusID?.StatusName || "N/A",
              actions: (
                <>
                  <IconButton
                    aria-label="Edit"
                    onClick={(e) => {
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
                      });
                      setItemToDelete(item._id);
                      setState({
                        Name: item.leadName,
                        Phone_Number: item.contactNumber,
                        Email: item.email,
                        Campaign: {
                          id: item.campaignID?.id,
                          title: item.campaignID?.campaignName,
                        },
                        Channel: {
                          id: item.channelID?.id,
                          title: item.channelID?.channelName,
                        },
                        Lead_Status: {
                          id: item.leadStatusID?.id,
                          title: item.leadStatusID?.StatusName,
                        },
                        Description: item.notes,
                        isUpdate: true,
                      });
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon color={"primary"} />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    onClick={() => {
                      setItemToDelete(item._id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <DeleteIcon color={"primary"} />
                  </IconButton>
                  <IconButton
                    aria-label="Info"
                    // onClick={() => {
                    //   setItemToDelete(item._id);
                    //   setDeleteDialogOpen(true);
                    // }}
                    onClick={(e) => {
                      navigate("/app/lead/new-lead/lead-details", {
                        state: { leadId: item._id },
                      });
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </>
              ),
            }))
          );
          setLength(response.data.totalItems);
          setPagination(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  useEffect(() => {
    fetchLead(page);
  }, [page, rowsPerPage]);
  const handleCreateLead = async () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    console.log("p1");
    try {
      // Prepare the data to match the required request body format
      const data = {
        leadName: state.Name,
        email: state.Email,
        campaignID: state.Campaign.id, // campaignName from state
        channelID: state.Channel.id,
        leadStatusID: state.Lead_Status.id,

        contactNumber: parseInt(state.Phone_Number),
        notes: state.Description,
      };
      console.log("p2");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createLeadDetail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      console.log("p3");
      const result = await response.json();
      if (result.status === 200) {
        fetchLead();
        window.scrollTo({
          top: 400,
          behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
        });
        // Reset the state after successful creation
        setState({
          Name: "",
          Phone_Number: "",
          Email: "",
          Campaign: "",
          Campaign_Id: "",
          Channel: "",
          Channel_Id: "",
          Lead_Status: "",
          Lead_Status_Id: "",
          Description: "",

          isUpdate: false,
        });
        setOpenDialog(false);
        setMessage("Created Sucessfully!");
        setOpen(true);
        setSeverity("success");
      } else {
        setMessage(result.message);
        setOpen(true);
        setSeverity("error");
      }
    } catch (err) {
      console.log(err);
      setMessage(err.message);
      setOpen(true);
      setSeverity("error");
    }
  };
  const handleUpdateLead = async () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    console.log("p1");
    try {
      // Prepare the data to match the required request body format
      const data = {
        id: parseInt(itemToDelete),
        leadName: state.Name,
        email: state.Email,
        campaignID: state.Campaign.id, // campaignName from state
        channelID: state.Channel.id,
        leadStatusID: state.Lead_Status.id,

        contactNumber: parseInt(state.Phone_Number),
        notes: state.Description,
      };
      console.log("p2");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updateLeadDetail`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      console.log("p3");
      const result = await response.json();
      if (result.status === 200) {
        fetchLead();
        window.scrollTo({
          top: 400,
          behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
        });
        // Reset the state after successful creation
        setState({
          Name: "",
          Phone_Number: "",
          Email: "",
          Campaign: "",
          Campaign_Id: "",
          Channel: "",
          Channel_Id: "",
          Lead_Status: "",
          Lead_Status_Id: "",
          Description: "",

          isUpdate: false,
        });
        setOpenDialog(false);
        setMessage("Updated successfully!");
        setOpen(true);
        setSeverity("success");
      } else {
        setMessage(result.message);
        setOpen(true);
        setSeverity("error");
      }
    } catch (err) {
      console.log(err);
      setMessage(err.message);
      setOpen(true);
      setSeverity("error");
    }
  };
  const handleCampaignDelete = async () => {
    try {
      const data = { id: parseInt(itemToDelete) };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteLeadDetail`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result.status === 200) {
        setDeleteDialogOpen(false);
        fetchLead();
        setMessage("Deleted successfully!");
        setOpen(true);
        setSeverity("success");
        setItemToDelete(null);
      } else {
        setMessage(actualData.message);
        setOpen(true);
        setSeverity("error");
        setItemToDelete(null);
      }
    } catch (err) {
      //console.log(err);
      setMessage(err.message);
      setOpen(true);
      setSeverity("error");
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handlePageChange = (event, newPage) => {
    console.log(newPage);
    if (newPage !== 0) {
      setPage(newPage + 1); // Update the current page
    }
    if (newPage === 0) {
      setPage(1);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update the rows per page
    setPage(1); // Reset to first page
  };
  const handleAddSection = () => {
    setState({
      ...state,
      fieldset: [...state.fieldset, { name: "", value: "" }],
    });
  };

  // Delete a section by index
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
                <AddIcon /> Add Lead
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
          open={openDialog}
          onClose={() => {
            setState({
              Name: "",
              Phone_Number: "",
              Email: "",
              Campaign: "",
              Campaign_Id: "",
              Channel: "",
              Channel_Id: "",
              Lead_Status: "",
              Lead_Status_Id: "",
              Description: "",
              isUpdate: false,
            });
            setOpenDialog(false);
          }}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>New lead</DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {
              setState({
                Name: "",
                Phone_Number: "",
                Email: "",
                Campaign: "",
                Campaign_Id: "",
                Channel: "",
                Channel_Id: "",
                Lead_Status: "",
                Lead_Status_Id: "",
                Description: "",
                isUpdate: false,
              });
              setOpenDialog(false);
            }}
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
            <div className={classes.form}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="Name"
                    name="Name"
                    label="Name"
                    value={state.Name}
                    onChange={(e) => {
                      const input = e.target.value;

                      // Remove any non-alphabetic characters and limit to 70 characters
                      const validInput = input
                        .replace(/[^a-zA-Z\s]/g, "")
                        .slice(0, 70);

                      setState({
                        ...state,
                        Name: validInput,
                      });
                    }}
                    error={!!errors.Name} // Show error if it exists
                    helperText={errors.Name} // Display error message
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="PhoneNumber"
                    name="PhoneNumber"
                    label="Phone Number"
                    value={state.Phone_Number}
                    onChange={(e) => {
                      const input = e.target.value;
                      const validInput = input
                        .replace(/[^0-9]/g, "")
                        .slice(0, 10);
                      setState({
                        ...state,
                        Phone_Number: validInput,
                      });
                    }}
                    error={!!errors.Phone_Number} // Show error if it exists
                    helperText={errors.Phone_Number} // Display error message
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="standard"
                    id="Email"
                    name="Email"
                    label="Email"
                    fullWidth
                    value={state.Email}
                    onChange={(e) => {
                      const input = e.target.value;

                      // Updated regex to ensure the email doesn't start with a digit, includes @, and ends with .com
                      const validEmailRegex =
                        /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;

                      setState({
                        ...state,
                        Email: input,
                      });

                      // Check if the email matches the regex pattern
                      if (
                        !validEmailRegex.test(input) ||
                        !input.endsWith(".com")
                      ) {
                        setErrors({
                          ...errors,
                          Email:
                            "Invalid email address. Must not start with a digit and should end with .com",
                        });
                      } else {
                        setErrors({ ...errors, Email: "" });
                      }
                    }}
                    error={!!errors.Email} // Show error if it exists
                    helperText={errors.Email} // Display error message
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    sx={{
                      marginTop: "-16px",
                    }}
                    id="highlights-demo"
                    options={campaignList.map((item) => {
                      return { id: item._id, title: item.campaignName };
                    })}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    value={state.Campaign}
                    onChange={(e, v, reason) => {
                      if (reason === "clear") {
                        setState({
                          ...state,
                          Campaign: "",
                          Campaign_Id: "",
                        });
                      } else {
                        const selectedCampaign = campaignList.find(
                          (item) => item.campaignName === v
                        );
                        setState({
                          ...state,
                          Campaign: v,
                          Campaign_Id: selectedCampaign
                            ? selectedCampaign._id
                            : null,
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Campaign"
                        margin="normal"
                        variant="standard"
                        error={!!errors.Campaign} // Show error if it exists
                        helperText={errors.Campaign} // Display error message
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    sx={{
                      marginTop: "-16px",
                    }}
                    id="highlights-demo"
                    options={channelList.map((item) => {
                      return { id: item._id, title: item.channelName };
                    })}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    value={state.Channel}
                    onChange={(e, v, reason) => {
                      if (reason === "clear") {
                        setState({
                          ...state,
                          Channel: "",
                          Channel_Id: "",
                        });
                      } else {
                        const selectedChannel = channelList.find(
                          (item) => item.channelName === v
                        );
                        setState({
                          ...state,
                          Channel: v,
                          Channel_Id: selectedChannel
                            ? selectedChannel._id
                            : null,
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Channel"
                        margin="normal"
                        variant="standard"
                        error={!!errors.Channel} // Show error if it exists
                        helperText={errors.Channel} // Display error message
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    sx={{
                      marginTop: "-16px",
                    }}
                    id="highlights-demo"
                    options={leadStatusList.map((item) => {
                      return { id: item._id, title: item.statusName };
                    })}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    value={state.Lead_Status}
                    onChange={(e, v, reason) => {
                      if (reason === "clear") {
                        setState({
                          ...state,
                          Lead_Status: "",
                          Lead_Status_Id: "",
                        });
                      } else {
                        const selectedLeadStatus = leadStatusList.find(
                          (item) => item.statusName === v
                        );
                        setState({
                          ...state,
                          Lead_Status: v,
                          Lead_Status_Id: selectedLeadStatus
                            ? selectedLeadStatus._id
                            : null,
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Lead Status"
                        margin="normal"
                        variant="standard"
                        error={!!errors.Lead_Status} // Show error if it exists
                        helperText={errors.Lead_Status} // Display error message
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="standard"
                    id="Description"
                    name="Description"
                    label="Description"
                    fullWidth
                    value={state.Description}
                    onChange={(e) =>
                      setState({
                        ...state,
                        Description: e.target.value,
                      })
                    }
                    error={!!errors.Description} // Show error if it exists
                    helperText={errors.Description} // Display error message
                  />
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setState({
                  Name: "",
                  Phone_Number: "",
                  Email: "",
                  Campaign: "",
                  Campaign_Id: "",
                  Channel: "",
                  Channel_Id: "",
                  Lead_Status: "",
                  Lead_Status_Id: "",
                  Description: "",
                  isUpdate: false,
                });
                setOpenDialog(false);
              }}
              color="secondary"
            >
              Close
            </Button>
            {state.isUpdate ? (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleUpdateLead}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateLead}
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
          title="Lead List"
          columnData={columnData}
          rowData={rowdata}
          component="div"
          count={length} // Total number of rows
          rowsPerPage={rowsPerPage} // Number of rows per page
          page={page} // Current page
          onPageChange={handlePageChange} // Handle page change
          onRowsPerPageChange={handleRowsPerPageChange} // Handle rows per page change
          pagination={pagination}
        />
      )}

      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        onDelete={handleCampaignDelete}
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

export default New_lead;