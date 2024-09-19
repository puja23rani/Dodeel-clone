import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";

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
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import Breadcrumbs from "../../containers/UiElements/Breadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
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

function LeadDetails() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { leadId } = location.state || {};
  const token = localStorage.getItem("token");

  const [state, setState] = useState({
    leadID: leadId,
    leadName: "",
    employeeName: [],
    followupTime: "",
    minuteBeforeReminder: "",
    reminderNote: "",
    membersID: [],
    leadStatusID: "",
    date: "",
    time: "",
    showtime: "",
    noteID: "",
    contactNumber: "",
    email: "",
    campaignID: "",
    campaignName: "",
    channelName: "",
    channelID: "",
    notes: "",
    StatusName: "",
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
    id: null,
    isUpdate: false,
  });
  const [statelog, setStatelog] = useState({
    leadID: leadId,
    leadName: "",
    employeeName: [],
    followupTime: "",
    minuteBeforeReminder: "",
    reminderNote: "",
    membersID: [],
    leadStatusID: "",
    date: "",
    time: "",
    showtime: "",
    noteID: "",
    contactNumber: "",
    email: "",
    campaignID: "",
    campaignName: "",
    channelName: "",
    channelID: "",
    notes: "",
    StatusName: "",
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
    id: null,
    isUpdate: false,
    islogUpdate: false,
  });
  const [statefollow, setStateFollow] = useState({
    leadID: leadId,
    leadName: "",
    employeeName: [],
    followupTime: "",
    minuteBeforeReminder: "",
    reminderNote: "",
    membersID: [],
    leadStatusID: "",
    date: "",
    time: "",
    showtime: "",
    noteID: "",
    contactNumber: "",
    email: "",
    campaignID: "",
    campaignName: "",
    channelName: "",
    channelID: "",
    notes: "",
    StatusName: "",
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
    id: null,
    isUpdate: false,
  });
  const [errors, setErrors] = useState({
    Name: "",
    Email: "",
    Campaign: "",
    Channel: "",
    Lead_Status: "",
    Phone_Number: "",
    Description: "",
  });
  
  const validate = () => {
    let isValid = true;
    let errors = {};
  
    // Validate Name (leadName)
    if (!state.Name.trim()) {
      errors.Name = "Lead Name is required";
      isValid = false;
    }
  
    // Validate Email
    if (!state.Email.trim()) {
      errors.Email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.Email)) {
      errors.Email = "Invalid email format";
      isValid = false;
    }
  
    // Validate Campaign ID
    if (!state.Campaign || !state.Campaign.id) {
      errors.Campaign = "Campaign selection is required";
      isValid = false;
    }
  
    // Validate Channel ID
    if (!state.Channel || !state.Channel.id) {
      errors.Channel = "Channel selection is required";
      isValid = false;
    }
  
    // Validate Lead Status ID
    if (!state.Lead_Status || !state.Lead_Status.id) {
      errors.Lead_Status = "Lead Status selection is required";
      isValid = false;
    }
  
    // Validate Phone Number
    if (!state.Phone_Number.toString().trim()) {
      errors.Phone_Number = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(state.Phone_Number.toString())) {
      errors.Phone_Number = "Phone number must be a valid 10-digit number";
      isValid = false;
    }
  
    // Validate Description (notes)
    if (!state.Description.trim()) {
      errors.Description = "Description is required";
      isValid = false;
    }
  
    setErrors(errors);
    return isValid;
  };
  
  const [errorsfollow, setErrorsfollow] = useState({
    leadName: "",
    employeeName: "",
    followupTime: "",
    minuteBeforeReminder: "",
    reminderNote: "",
    reminderDate: "",
  });
  
  const validateFieldsfollow = () => {
    let isValid = true;
    let errorsfollow = {};
  
    if (!statefollow.Name.trim()) {
      errorsfollow.leadName = "Lead Name is required";
      isValid = false;
    }
  
    if (!statefollow.employeeName || statefollow.employeeName.length === 0) {
      errorsfollow.employeeName = "At least one Employee Name is required";
      isValid = false;
    }
  
    if (!statefollow.time.trim()) {
      errorsfollow.followupTime = "Follow-up Time is required";
      isValid = false;
    }
  
    if (!statefollow.minuteBeforeReminder.trim()) {
      errorsfollow.minuteBeforeReminder = "Minute Before Reminder is required";
      isValid = false;
    } else if (
      parseInt(statefollow.minuteBeforeReminder) < 1 ||
      parseInt(statefollow.minuteBeforeReminder) > 59
    ) {
      errorsfollow.minuteBeforeReminder = "Value must be between 1 and 59 minutes";
      isValid = false;
    }
  
    if (!statefollow.reminderNote.trim()) {
      errorsfollow.reminderNote = "Reminder Note is required";
      isValid = false;
    }
  
    if (!statefollow.date.trim()) {
      errorsfollow.reminderDate = "Reminder Date is required";
      isValid = false;
    }
  
    setErrorsfollow(errorsfollow);
    return isValid;
  };
  
  const [rowdata, setRowdata] = useState([]);
  const [mainlist, setMainList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [opendetailsDialog, setOpendetailsDialog] = useState(false);
  const [openlogDialog, setOpenlogDialog] = useState(false);
  const [openfollowUpDialog, setOpenfollowUpDialog] = useState(false);

  const table = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }
      const data = { id: leadId };
      console.log(data);
      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getLeadDetailById`,
        requestOptions
      );
      const actualData = await res.json();

      console.log(actualData);
      setMainList(actualData.data || []); // Ensure it's an array
      setState({
        Name: actualData.data.leadName,
        Phone_Number: actualData.data.contactNumber,
        Email: actualData.data.email,
        Campaign: {
          title: actualData.data.campaignID.campaignName,
          id: actualData.data.campaignID.id,
        },
        Channel: {
          title: actualData.data.channelID.channelName,
          id: actualData.data.channelID.id,
        },
        Lead_Status: {
          title: actualData.data.leadStatusID.StatusName,
          id: actualData.data.leadStatusID.id,
        },
        Campaign_Id: actualData.data.campaignID.id,

        Channel_Id: actualData.data.channelID.id,

        Lead_Status_Id: actualData.data.leadStatusID.id,
        Description: actualData.data.notes,
        isUpdate: true, // Assuming this is an update scenario
      });
      setStateFollow({
        ...statefollow,
        leadName: actualData.data.leadName,
        Name: actualData.data.leadName,
      });
      setStatelog({
        ...statefollow,
        Name: actualData.data.leadName,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const [Leadloglist, setLeadlogList] = React.useState([]);
  const table1 = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }
      const data = { leadID: leadId };
      console.log(data);
      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllLogByLeadID`,
        requestOptions
      );
      const actualData = await res.json();

      console.log(actualData);
      setLeadlogList(actualData.data || []); // Ensure it's an array
    } catch (err) {
      console.log(err);
    }
  };

  const [Followlist, setFollowlist] = React.useState([]);
  const table2 = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }
      const data = { leadID: leadId };
      console.log(data);
      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getReminderByLeadID`,
        requestOptions
      );
      const actualData = await res.json();

      console.log(actualData);
      setFollowlist(actualData.data || []); // Ensure it's an array
    } catch (err) {
      console.log(err);
    }
  };
  const [channelList, setChannelList] = React.useState([]);
  const channel_all = async () => {
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
  function campaign_all() {
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
  function leadStats_all() {
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
  const [NoteList, setNoteList] = React.useState([]);
  const note_all = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllNotes`,
        requestOptions
      );
      const actualData = await res.json();

      console.log(actualData);
      setNoteList(actualData.data);
    } catch (err) {
      console.log(err);
    }
  };
  const [MemberList, setmemberList] = React.useState([]);
  const emp_all = async () => {
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
      setmemberList(actualData?.employees);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    table();
    table1();
    table2();
    leadStats_all();
    channel_all();
    campaign_all();
    note_all();
    emp_all();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateNewLead = async () => {
    if(!validate()){return;}
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }

      const data = {
        id: leadId,
        leadName: state.Name,
        email: state.Email,
        campaignID: state.Campaign.id, // campaignName from state
        channelID: state.Channel.id,
        leadStatusID: state.Lead_Status.id,

        contactNumber: parseInt(state.Phone_Number),
        notes: state.Description,
      };

      // console.log(Leadloglist);
      console.log(state);
      console.log(data);

      const requestOptions = {
        method: "PUT",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };

      console.log(requestOptions);

      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updateLeadDetail`,
        requestOptions
      );
      const actualData = await res.json();
      console.log(actualData);

      if (actualData.status === 200) {
        table();
        setState((prevState) => ({
          ...prevState,
          leadName: "",
          contactNumber: "",
          email: "",
          campaignID: "",
          campaignName: "",
          channelName: "",
          channelID: "",
          notes: "",
          StatusName: "",
          isUpdate: false, // Clear memberID
        }));
        setOpendetailsDialog(false);
        setMessage("Updated successfully!");
        setOpen(true);
        setSeverity("success");
      } else {
        setMessage(actualData.message);
        setOpen(true);
        setSeverity("error");
      }
      setState({
        isUpdate: false,
      });
    } catch (err) {
      console.log(err);
    }
  };
  function formatTimeTo12Hour(time24) {
    let [hour, minute] = time24.split(":");
    hour = parseInt(hour, 10);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert hour to 12-hour format
    if (hour < 10) {
      return `0${hour}:${minute} ${period}`;
    } else {
      return `${hour}:${minute} ${period}`;
    }
  }
  console.log(state);
  const handleCreateLeadlog = async () => {
    console.log(state);

    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }

      const data = {
        leadID: leadId,
        leadName: statelog.leadName, // Fallback in case Leadloglist is empty
        logDetails: [
          {
            leadStatusID: statelog.Lead_Status.id,
            date: statelog.date,
            time: statelog.time,
            memberID: statelog.employeeName.id,
            employeeName: statelog.employeeName.title, // Ensure memberID is included
            noteID: statelog.notes.id,
          },
        ],
      };

      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };

      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createLeadLog`,
        requestOptions
      );
      const actualData = await res.json();
      console.log(actualData);

      if (actualData.status === 200) {
        setMessage("Created successfully!");
        setOpen(true);
        setSeverity("success");
        table();
        setStatelog({
          ...statelog,
          date: "",
          time: "",
          employeeName: "",
          notes: "",
          membersID: [],
        });
        setOpenlogDialog(false);
      } else {
        setMessage(actualData.message);
        setOpen(true);
        setSeverity("error");
      }
    } catch (err) {
      console.log(err);
    }
  };
  function formatTimeTo24Hour(time12) {
    const [time, period] = time12.trim().split(" "); // Ensure there's a space between time and period
    let [hour, minute] = time.split(":");
    hour = parseInt(hour, 10);

    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, "0")}:${minute}`;
  }

  // Test examples
  const handleUpdateLeadlog = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }

      const data = {
        id: statelog.id,
        leadID: leadId,
        leadName: statelog.leadName,
        logDetails: [
          {
            leadStatusID: statelog.Lead_Status.id,
            date: statelog.date,
            time: statelog.time,
            memberID: statelog.employeeName.id,
            employeeName: statelog.employeeName.title, // Ensure memberID is included
            noteID: statelog.notes.id,
          },
        ],
      };

      const requestOptions = {
        method: "PUT",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };

      console.log(requestOptions);

      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updateLeadLog`,
        requestOptions
      );
      const actualData = await res.json();
      console.log(actualData);

      if (actualData.status === 200) {
        setMessage("Updated successfully!");
        setOpen(true);
        setSeverity("success");
        table1();
        setStatelog({
          ...statelog,
          date: "",
          id: "",
          time: "",
          employeeName: "",
          notes: "",
          membersID: [],
          Lead_Status: "",
          islogUpdate: false,
        });
        setOpenlogDialog(false);
      } else {
        setMessage(actualData.message);
        setOpen(true);
        setSeverity("error");
      }
    } catch (err) {
      setMessage("Something went wrong");
      setOpen(true);
      setSeverity("error");
      console.log(err);
    }
  };

  const handleCreateFollowUp = async () => {
    if (!validateFieldsfollow()) return;
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }

      const data = {
        leadID: leadId,
        leadName: statefollow.Name,
        employeeName: statefollow.employeeName.map((item) => item.title),
        followupTime: statefollow.time,
        minuteBeforeReminder: statefollow.minuteBeforeReminder,
        reminderNote: statefollow.reminderNote,
        reminderDate: statefollow.date.slice(0, 10),
        membersID: statefollow.membersID,
      };

      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };

      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createFollowupReminder`,
        requestOptions
      );
      const actualData = await res.json();
      console.log(actualData);

      if (actualData.status === 200) {
        setMessage("Created successfully!");
        setOpen(true);
        setSeverity("success");
        table2();
        setStateFollow({
          ...statefollow,
          employeeName: [],
          time: "",
          minuteBeforeReminder: "",
          reminderNote: "",
          membersID: [],
          date: "",
        });
        setOpenfollowUpDialog(false);
      } else {
        setMessage(actualData.message);
        setOpen(true);
        setSeverity("error");
      }
    } catch (err) {
      console.log(err);
      setMessage("Something went wrong");
      setOpen(true);
      setSeverity("error");
    }
  };
  console.log(errorsfollow, "ssstttttttttttaaaaaaaaa");
  return (
    <>
      <div>
        <Grid
          container
          alignItems="flex-start"
          justifyContent="flex-start"
          direction="row"
          spacing={2}
        >
          <Grid item md={4} xs={12}>
            <Typography variant="button" className={classes.divider}>
              Lead Details
            </Typography>
            <div className={classes.root}>
              <Paper
                elevation={2}
                style={{ padding: "20px", marginBottom: "20px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpendetailsDialog(true)}
                  >
                    Update
                  </Button>
                </div>
                <Grid
                  container
                  spacing={3}
                  direction="column"
                  style={{ marginTop: "20px" }}
                >
                  <Grid item>
                    <Typography color="textSecondary">
                      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                        Lead Name:
                      </span>
                      <span>{mainlist?.leadName || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="textSecondary">
                      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                        Contact Number:
                      </span>
                      <span>{mainlist?.contactNumber || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="textSecondary">
                      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                        Email:
                      </span>
                      <span>{mainlist?.email || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="textSecondary">
                      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                        Channel Name:
                      </span>
                      <span>{mainlist?.channelID?.channelName || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="textSecondary">
                      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                        Campaign Name:
                      </span>
                      <span>{mainlist?.campaignID?.campaignName || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="textSecondary">
                      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                        Lead Status Name:
                      </span>
                      <span>{mainlist?.leadStatusID?.StatusName || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="textSecondary">
                      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                        Description:
                      </span>
                      <span>{mainlist?.notes || "N/A"}</span>
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              <Dialog
                open={opendetailsDialog}
                onClose={() => setOpendetailsDialog(false)}
                fullWidth
                maxWidth="md"
              >
                <DialogTitle>Update Lead Details</DialogTitle>
                <IconButton
                  aria-label="close"
                  className={classes.closeButton}
                  onClick={() => setOpendetailsDialog(false)}
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
                            const validInput = input.replace(
                              /[^a-zA-Z\s]/g,
                              ""
                            );
                            setState({
                              ...state,
                              Name: validInput,
                            });
                          }}
                          // error={!!errors.Name} // Show error if it exists
                          // helperText={errors.Name} // Display error message
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
                          onChange={(e) =>
                            setState({
                              ...state,
                              Email: e.target.value,
                            })
                          }
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
                          }) || []}
                          getOptionLabel={(option) => option.title || ""} // Safely access title
                          isOptionEqualToValue={(option, value) =>
                            value && value.id ? option.id === value.id : false
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
                          }) || []}
                          getOptionLabel={(option) => option.title || ""} // Safely access title
                          isOptionEqualToValue={(option, value) =>
                            value && value.id ? option.id === value.id : false
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
                          }) || []}
                          getOptionLabel={(option) => option.title || ""} // Safely access title
                          isOptionEqualToValue={(option, value) =>
                            value && value.id ? option.id === value.id : false
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
                    onClick={() => setOpendetailsDialog(false)}
                    color="secondary"
                  >
                    Close
                  </Button>
                  {state.isUpdate ? (
                    <>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={handleUpdateNewLead}
                      >
                        Update
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        color="primary"
                        variant="contained"
                        // onClick={handleCreatemembers}
                      >
                        Create
                      </Button>
                    </>
                  )}
                </DialogActions>
              </Dialog>
            </div>
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography variant="button" className={classes.divider}>
              Log Notes
            </Typography>
            <div className={classes.root}>
              <Paper
                elevation={2}
                style={{ padding: "20px", marginBottom: "20px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenlogDialog(true)}
                  >
                    Create
                  </Button>
                </div>
                <Grid container spacing={3} direction="column">
                  {Leadloglist.length > 0 ? (
                    Leadloglist.map((log, logIndex) => (
                      <React.Fragment key={logIndex}>
                        {log.logDetails.map((detail, detailIndex) => (
                          <React.Fragment key={detailIndex}>
                            <Grid item style={{ position: "relative" }}>
                              <div style={{ display: "flex" }}>
                                {/* Alarm Icon */}
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <LeaderboardIcon style={{ zIndex: 1 }} />
                                  {/* Vertical line */}
                                  {detailIndex < Leadloglist.length - 1 && (
                                    <div
                                      style={{
                                        height: "8vw", // Adjust height as needed
                                        width: "2px",
                                        backgroundColor: "grey",
                                        marginTop: "6px",
                                        marginBottom: "1px",
                                      }}
                                    />
                                  )}
                                </div>
                                {/* Lead Status and other details */}
                                <div
                                  style={{
                                    marginLeft: "10px",
                                    alignItems: "start",
                                    flex: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    color="textSecondary"
                                  >
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                      }}
                                    >
                                      Lead Status Name:
                                    </span>
                                    <span>
                                      {detail.leadStatusName || "N/A"}
                                    </span>
                                  </Typography>
                                  <Grid item>
                                    <Grid container spacing={1} direction="row">
                                      <Grid item>
                                        <Typography
                                          variant="body1"
                                          color="textSecondary"
                                        >
                                          <span
                                            style={{
                                              fontWeight: "bold",
                                              marginRight: "10px",
                                            }}
                                          >
                                            Date:
                                          </span>
                                          <span>
                                            {new Date(
                                              detail.date
                                            ).toLocaleDateString() || "N/A"}
                                          </span>
                                        </Typography>
                                      </Grid>
                                      <Grid item>
                                        <Typography
                                          variant="body1"
                                          color="textSecondary"
                                        >
                                          <span
                                            style={{
                                              fontWeight: "bold",
                                              marginRight: "10px",
                                            }}
                                          >
                                            Time:
                                          </span>
                                          <span>{detail.time || "N/A"}</span>
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <Grid item>
                                    <Typography
                                      variant="body1"
                                      color="textSecondary"
                                    >
                                      <span
                                        style={{
                                          fontWeight: "bold",
                                          marginRight: "10px",
                                        }}
                                      >
                                        Employee Name:
                                      </span>
                                      <span>
                                        {detail.employeeName || "N/A"}
                                      </span>
                                    </Typography>
                                  </Grid>
                                  <Grid item>
                                    <Typography
                                      variant="body1"
                                      color="textSecondary"
                                    >
                                      <span
                                        style={{
                                          fontWeight: "bold",
                                          marginRight: "20px",
                                        }}
                                      >
                                        Note Description:
                                      </span>
                                      <span>
                                        {detail.noteDescription || "N/A"}
                                      </span>
                                    </Typography>
                                  </Grid>
                                </div>
                                {/* Update Icon */}
                                <EditIcon
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "10px",
                                  }}
                                  onClick={() => {
                                    setOpenlogDialog(true);
                                    setStatelog({
                                      ...statelog,
                                      Lead_Status: { title: detail.leadStatusName, id: detail.leadStatusID },
                                      date: detail.date.slice(0, 10),
                                      time: detail.time,
                                      showtime: formatTimeTo24Hour(detail.time),
                                      employeeName: {
                                        title: detail.employeeName,
                                        id: detail.memberID,
                                      },
                                      notes: {
                                        title: detail.noteDescription,
                                        id: detail.noteID,
                                      },
                                      islogUpdate: true,
                                      id: log._id,
                                    });
                                  }}
                                />
                              </div>
                            </Grid>
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      marginLeft="26px"
                      marginTop="20px"
                    >
                      No log details available.
                    </Typography>
                  )}
                </Grid>
                <Dialog
                  open={openlogDialog}
                  onClose={() => {
                    setStatelog({
                      ...statelog,
                      date: "",
                      time: "",
                      showtime: "",
                      employeeName: "",
                      notes: "",
                      islogUpdate: false,
                      islogUpdate: false,
                      Lead_Status: "",
                    });
                    setOpenlogDialog(false);
                  }}
                  fullWidth
                  maxWidth="md"
                >
                  <DialogTitle>Lead Log</DialogTitle>
                  <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={() => {
                      setStatelog({
                        ...statelog,
                        date: "",
                        time: "",
                        showtime: "",
                        employeeName: "",
                        notes: "",
                        islogUpdate: false,
                        islogUpdate: false,
                        Lead_Status: "",
                      });
                      setOpenlogDialog(false);
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
                            value={statelog.Name}
                            InputProps={{ readOnly: true }}
                            // error={!!errors.Name} // Show error if it exists
                            // helperText={errors.Name} // Display error message
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            id="date"
                            label="Date"
                            type="date"
                            variant="standard"
                            value={statelog.date}
                            onChange={(e) =>
                              setStatelog({
                                ...statelog,
                                date: e.target.value,
                              })
                            }
                            sx={{ width: 414 }}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            id="time"
                            label="End Time"
                            type="time"
                            value={statelog.showtime}
                            onChange={(e) => {
                              const selectedTime = e.target.value; // Get the selected time from input

                              // Convert selectedTime from 24-hour to 12-hour format with AM/PM
                              const formattedTime =
                                formatTimeTo12Hour(selectedTime);

                              // Update the state with the formatted time
                              setStatelog({
                                ...statelog,
                                showtime: selectedTime,
                                time: formattedTime,
                              });
                            }}
                            variant="standard"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputProps={{
                              step: 300, // 5 min
                            }}
                            sx={{ width: 414 }}
                            //   error={!!errors.endTime} // Show error if it exists
                            //   helperText={errors.endTime} // Display error message
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <Autocomplete
                            sx={{
                              marginTop: "-16px",
                            }}
                            id="highlights-demo"
                            options={NoteList.map((item) => {
                              return {
                                id: item._id,
                                title: item.noteDescription,
                              };
                            }) || []}
                            getOptionLabel={(option) => option.title || ""} // Safely access title
                            isOptionEqualToValue={(option, value) =>
                              value && value.id ? option.id === value.id : false
                            }
                            value={statelog.notes}
                            onChange={(e, v, reason) => {
                              if (reason === "clear") {
                                setStatelog({
                                  ...statelog,
                                  notes: "",
                                  noteID: "",
                                });
                              } else {
                                const selectedChannel = NoteList.find(
                                  (item) => item.noteDescription === v
                                );
                                setStatelog({
                                  ...statelog,
                                  notes: v,
                                  noteID: selectedChannel
                                    ? selectedChannel._id
                                    : null,
                                });
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Notes"
                                margin="normal"
                                variant="standard"
                                // error={!!errors.Channel} // Show error if it exists
                                // helperText={errors.Channel} // Display error message
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
                            }) || []}
                            getOptionLabel={(option) => option.title || ""} // Safely access title
                            isOptionEqualToValue={(option, value) =>
                              value && value.id ? option.id === value.id : false
                            }
                            value={statelog.Lead_Status}
                            onChange={(e, v, reason) => {
                              if (reason === "clear") {
                                setStatelog({
                                  ...statelog,
                                  Lead_Status: "",
                                  Lead_Status_Id: "",
                                });
                              } else {
                                const selectedLeadStatus = leadStatusList.find(
                                  (item) => item.statusName === v
                                );
                                setStatelog({
                                  ...statelog,
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
                                // error={!!errors.Lead_Status} // Show error if it exists
                                // helperText={errors.Lead_Status} // Display error message
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
                            options={MemberList.map((item) => {
                              return {
                                id: item._id,
                                title: item.personalDetails.employeeName,
                              };
                            }) || []}
                            getOptionLabel={(option) => option.title || ""} // Safely access title
                            isOptionEqualToValue={(option, value) =>
                              value && value.id ? option.id === value.id : false
                            }
                            value={statelog.employeeName}
                            onChange={(e, v, reason) => {
                              if (reason === "clear") {
                                setStatelog({
                                  ...statelog,
                                  employeeName: "",
                                });
                              } else {
                                // const selectedLeadStatus = MemberList.find(
                                //   (item) => item.personalDetails.employeeName === v
                                // );
                                setStatelog({
                                  ...statelog,
                                  employeeName: v,
                                });
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Employee Name"
                                margin="normal"
                                variant="standard"
                                // error={!!errors.Lead_Status} // Show error if it exists
                                // helperText={errors.Lead_Status} // Display error message
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        setStatelog({
                          ...statelog,
                          date: "",
                          time: "",
                          showtime: "",
                          employeeName: "",
                          notes: "",
                          islogUpdate: false,
                          islogUpdate: false,
                          Lead_Status: "",
                        });
                        setOpenlogDialog(false);
                      }}
                      color="secondary"
                    >
                      Close
                    </Button>
                    {statelog.islogUpdate ? (
                      <>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={handleUpdateLeadlog}
                        >
                          Update
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={handleCreateLeadlog}
                        >
                          Create
                        </Button>
                      </>
                    )}
                  </DialogActions>
                </Dialog>
              </Paper>
            </div>
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography variant="button" className={classes.divider}>
              Lead Follow Up
            </Typography>
            <div className={classes.root}>
              <Paper
                elevation={2}
                style={{ padding: "20px", marginBottom: "20px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenfollowUpDialog(true)}
                  >
                    Create
                  </Button>
                </div>
                <Grid container spacing={1} direction="column" marginTop="15px">
                  {Followlist.map((followup, index) => (
                    <Grid item key={index} style={{ position: "relative" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <AccessAlarmIcon style={{ zIndex: 1 }} />
                          {index < Followlist.length - 1 && (
                            <div
                              style={{
                                // position: 'absolute',
                                // top: '40px',
                                // left: '18px', // Align with the center of the alarm icon
                                height: ["4vw"], // Adjust height as needed
                                width: "2px",
                                backgroundColor: "grey",
                                marginTop: "6px",
                                marginBottom: "1px",
                                // zIndex: 0,
                              }}
                            />
                          )}
                        </div>

                        <Typography
                          variant="h6"
                          color="textSecondary"
                          style={{ marginLeft: "10px" }}
                        >
                          {followup.reminderNote || "N/A"}
                        </Typography>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
              <Dialog
                open={openfollowUpDialog}
                onClose={() => {
                  setStateFollow({
                    ...statefollow,
                    reminderNote: "",
                    date: "",
                    time: "",
                    showtime: "",
                    membersID: [],
                    employeeName: [],
                    minuteBeforeReminder: "",
                  });
                  setOpenfollowUpDialog(false);
                }}
                fullWidth
                maxWidth="md"
              >
                <DialogTitle>FolloW Up Reminder</DialogTitle>
                <IconButton
                  aria-label="close"
                  className={classes.closeButton}
                  onClick={() => {
                    setStateFollow({
                      ...statefollow,
                      reminderNote: "",
                      date: "",
                      time: "",
                      showtime: "",
                      membersID: [],
                      employeeName: [],
                      minuteBeforeReminder: "",
                    });
                    setOpenfollowUpDialog(false);
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
                          value={statefollow.Name}
                          InputProps={{ readOnly: true }}
                          // error={!!errors.Name} // Show error if it exists
                          // helperText={errors.Name} // Display error message
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextField
                          id="time"
                          label="Follow Up Time"
                          type="time"
                          value={statefollow.showtime}
                          onChange={(e) => {
                            const selectedTime = e.target.value; // Get the selected time from input

                            // Convert selectedTime from 24-hour to 12-hour format with AM/PM
                            const formattedTime =
                              formatTimeTo12Hour(selectedTime);

                            // Update the state with the formatted time
                            setStateFollow({
                              ...statefollow,
                              showtime: selectedTime,
                              time: formattedTime,
                            });
                          }}
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                          sx={{ width: 414 }}
                            error={!!errorsfollow.followupTime} // Show error if it exists
                            helperText={errorsfollow.followupTime} // Display error message
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Autocomplete
                          multiple
                          id="tags-standard"
                          options={MemberList.map((item) => {
                            return {
                              title: item.personalDetails.employeeName,
                              id: item._id,
                            };
                          }) || []}
                          value={statefollow.employeeName}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          onChange={(e, v) => {
                            const selectempIds = v.map((item) => item.id);
                            setStateFollow({
                              ...statefollow,
                              employeeName: v, // Store selected objects
                              membersID: selectempIds, // Store IDs
                            });
                          }}
                          getOptionLabel={(option) => option.title}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              label="Employee Name"
                              placeholder="Employee Name"
                              error={!!errorsfollow.employeeName} // Show error if it exists
                              helperText={errorsfollow.employeeName} // Display error message
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id="date"
                          label="Folllow Up Date"
                          type="date"
                          variant="standard"
                          value={statefollow.date}
                          onChange={(e) =>
                            setStateFollow({
                              ...statefollow,
                              date: e.target.value,
                            })
                          }
                          sx={{ width: 414 }}
                          InputLabelProps={{ shrink: true }}
                          error={!!errorsfollow.reminderDate} // Show error if it exists
                        helperText={errorsfollow.reminderDate} // Display error message
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          variant="standard"
                          id="minnutesBeforeReminder"
                          name="minnutesBeforeReminder"
                          label="Minutes Before Reminder"
                          value={statefollow.minuteBeforeReminder}
                          onChange={(e) => {
                            const input = e.target.value;
                            // Remove any non-numeric characters
                            let validInput = input.replace(/[^0-9]/g, "");

                            // Check if validInput is between 1 and 59 (inclusive)
                            if (
                              validInput !== "" &&
                              (parseInt(validInput) < 1 ||
                                parseInt(validInput) > 59)
                            ) {
                              validInput = ""; // Set to empty if not in range
                            }

                            setStateFollow({
                              ...statefollow,
                              minuteBeforeReminder: validInput,
                            });
                          }}
                          error={!!errorsfollow.minuteBeforeReminder} // Show error if it exists
                          helperText={errorsfollow.minuteBeforeReminder} // Display error message
                          
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextField
                          variant="standard"
                          id="reminderNote"
                          name="reminderNote"
                          label="Reminder Note"
                          fullWidth
                          value={statefollow.reminderNote}
                          onChange={(e) =>
                            setStateFollow({
                              ...statefollow,
                              reminderNote: e.target.value,
                            })
                          }
                          error={!!errorsfollow.reminderNote} // Show error if it exists
                          helperText={errorsfollow.reminderNote} // Display error message
                        />
                      </Grid>
                    </Grid>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      setStateFollow({
                        ...statefollow,
                        reminderNote: "",
                        date: "",
                        time: "",
                        showtime: "",
                        membersID: [],
                        employeeName: [],
                        minuteBeforeReminder: "",
                      });
                      setOpenfollowUpDialog(false);
                    }}
                    color="secondary"
                  >
                    Close
                  </Button>

                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleCreateFollowUp}
                  >
                    Create
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Grid>
        </Grid>
      </div>

      <Popup
        open={open}
        message={message}
        onClose={handleClose}
        severity={severity} // You can change this to "error", "warning", etc.
      />
    </>
  );
}

export default LeadDetails;
