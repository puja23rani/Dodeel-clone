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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Breadcrumbs from "../../containers/UiElements/Breadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
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
    Status_Name: "",
    Description: "",
    searchText: "",
    isUpdate: false,
  });
  const [errors, setErrors] = useState({
    Status_Name: "",
    Description: "",
  });

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.Status_Name.trim()) {
      errors.Status_Name = "Status Name is required";
      isValid = false;
    }

    if (!state.Description.trim()) {
      errors.Description = "Description is required";
      isValid = false;
    }

    setErrors(errors);
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
  const [openDialog, setOpenDialog] = useState(false);

  const columnData = [
    {
      id: "slNo",
      numeric: true,
      disablePadding: false,
      label: "Sl No",
    },
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
  useEffect(() => { 
    table();
    table1();
    table2();
    fetchLeadStatus();
  }, []);
  
  const fetchLeadStatus = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/auth/getAllLeadStatus`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.data) {
          setRowdata(
            response.data.data.map((item) => ({
              slNo: response.data.data.indexOf(item) + 1,
              id: item._id,
              statusName: item.statusName,
              description: item.description,
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
                        Status_Name: item.statusName,
                        Description: item.description,
                        isUpdate: true,
                      });
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    onClick={() => {
                      setItemToDelete(item._id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              ),
            }))
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleCreateLeadStatus = async () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    try {
      const data = {
        statusName: state.Status_Name,
        description: state.Description,
      };

      if (!state.Status_Name || !state.Description) {
        toast.error("Fill all the information", { position: "top-center" });
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createLeadStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result.status === 200) {
        fetchLeadStatus();
        window.scrollTo({
          top: 400,
          behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
        });
        setState({
          Status_Name: "",
          Description: "",
          id: "",
          searchText: "",
          isUpdate: false,
        });
        setMessage("Saved successfully!");
        setOpen(true);
        setSeverity("success");
        setOpenDialog(false);
      } else {
        setMessage(result.message);
        setOpen(true);
        setSeverity("error");
      }
    } catch (err) {
      //console.log(err);
      setMessage(err.message);
      setOpen(true);
      setSeverity("error");
    }
  };

  const handleLeadStatusDelete = async () => {
    try {
      const data = { id: itemToDelete };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteLeadStatus`,
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
        fetchLeadStatus();
        setMessage("Deleted successfully!");
        setOpen(true);
        setSeverity("success");
      } else {
        setMessage(actualData.message);
        setOpen(true);
        setSeverity("error");
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
  const handleUpdateLeadStatus = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const token = localStorage.getItem("token");
      if (token) {
        loginHeaders.append("Authorization", `Bearer ${token}`);
      }
      const data = {
        id: itemToDelete,
        statusName: state.Status_Name,
        description: state.Description,
      };

      if (state.Status_Name == "" || state.Description == "") {
        setMessage("Please fill all required fields");
        setOpen(true);
        setSeverity("warning");
        return;
      } else {
        const requestOptions = {
          method: "PUT",
          headers: loginHeaders,
          body: JSON.stringify(data),
        };
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/auth/updateLeadStatus`,
          requestOptions
        );

        const actualData = await res.json();
        //console.log(actualData.holidays);
        // setVisaList(actualData.Country);
        if (actualData.status == 200) {
          fetchLeadStatus();
          window.scrollTo({
            top: 400,
            behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
          });
          setState({
            Status_Name: "",
            Description: "",
            id: "",
            searchText: "",
            isUpdate: false,
          });
          setMessage("Updated successfully!");
          setOpen(true);
          setSeverity("success");
          // Navigate("/Department");
          setOpenDialog(false);
        } else {
          setMessage(actualData.message);
          setOpen(true);
          setSeverity("error");
        }
      }
    } catch (err) {
      //console.log(err);
      // toast.error("Failed to save. Please try again.", {
      //   position: "top-center",
      // });
      setMessage(err.message);
      setOpen(true);
      setSeverity("error");
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
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
          <Typography variant="button" className={classes.divider}>Lead Log</Typography>
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
                   // onClick={handleClickOpen}
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
                    <Typography  color="textSecondary">
                      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                        Lead Name:
                      </span>
                      <span>{mainlist?.leadName || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography  color="textSecondary">
                      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                        Contact Number:
                      </span>
                      <span>{mainlist?.contactNumber || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography  color="textSecondary">
                      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                        Email:
                      </span>
                      <span>{mainlist?.email || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography  color="textSecondary">
                      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                        Channel Name:
                      </span>
                      <span>{mainlist?.channelID?.channelName || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography  color="textSecondary">
                      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                        Campaign Name:
                      </span>
                      <span>{mainlist?.campaignID?.campaignName || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography  color="textSecondary">
                      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                        Lead Status Name:
                      </span>
                      <span>{mainlist?.leadStatusID?.StatusName || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography  color="textSecondary">
                      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
                        Description:
                      </span>
                      <span>{mainlist?.notes || "N/A"}</span>
                    </Typography>
                  </Grid>
                </Grid>
           </Paper>
           {/* <Dialog
                open={openleadDetailsDialog}
                onClose={handleCloseLeadDetailsDialog}
              >
                <DialogTitle>Update Lead Details</DialogTitle>
                <DialogContent>
                  <Grid container spacing={3}>
                    <Grid item xs={5}>
                      <CustomInputField
                        label="Name"
                        fullWidth
                        value={state.leadName}
                        onChange={(e) => {
                          const input = e.target.value;
                          const validInput = input.replace(/[^a-zA-Z\s]/g, "");
                          setState({ ...state, leadName: validInput });
                        }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <CustomInputField
                        label="Phone Number"
                        fullWidth
                        value={state.contactNumber}
                        onChange={(e) => {
                          const input = e.target.value;
                          const validInput = input
                            .replace(/[^0-9]/g, "")
                            .slice(0, 10);
                          setState({ ...state, contactNumber: validInput });
                        }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <CustomInputField
                        label="Email"
                        fullWidth
                        value={state.email}
                        onChange={(e) =>
                          setState({ ...state, email: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <CustomInputAndSelectField
                        options={campList.map((item) => item.campaignName)}
                        value={state.campaignName}
                        changeCallBack={(e, v, reason) => {
                          if (reason === "clear") {
                            setState({
                              ...state,
                              campaignName: "",
                              campaignID: "",
                            });
                          } else {
                            const selectedCampaign = campList.find(
                              (item) => item.campaignName === v
                            );
                            setState({
                              ...state,
                              campaignName: v,
                              campaignID: selectedCampaign
                                ? selectedCampaign._id
                                : null,
                            });
                          }
                        }}
                        label="Campaign"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <CustomInputAndSelectField
                        options={channelList.map((item) => item.channelName)}
                        value={state.channelName}
                        changeCallBack={(e, v, reason) => {
                          if (reason === "clear") {
                            setState({
                              ...state,
                              channelName: "",
                              channelID: "",
                            });
                          } else {
                            const selectedChannel = channelList.find(
                              (item) => item.channelName === v
                            );
                            setState({
                              ...state,
                              channelName: v,
                              channelID: selectedChannel
                                ? selectedChannel._id
                                : null,
                            });
                          }
                        }}
                        label="Channel"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <CustomInputAndSelectField
                        options={LeadStatusList.map((item) => item.statusName)}
                        value={state.StatusName}
                        changeCallBack={(e, v, reason) => {
                          if (reason === "clear") {
                            setState({
                              ...state,
                              StatusName: "",
                              leadStatusID: "",
                            });
                          } else {
                            const selectedLeadStatus = LeadStatusList.find(
                              (item) => item.statusName === v
                            );
                            setState({
                              ...state,
                              StatusName: v,
                              leadStatusID: selectedLeadStatus
                                ? selectedLeadStatus._id
                                : null,
                            });
                          }
                        }}
                        label="Lead Status"
                        fullWidth
                        isOptionEqualToValue={(option, value) =>
                          option === value
                        }
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <CustomInputField
                        label="Description"
                        fullWidth
                        value={state.notes}
                        onChange={(e) =>
                          setState({ ...state, notes: e.target.value })
                        }
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseLeadDetailsDialog}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateNewLead} color="primary">
                    Update
                  </Button>
                </DialogActions>
                
              </Dialog> */}

          </div>
        </Grid>
        <Grid item md={4} xs={12}>
          <Typography variant="button" className={classes.divider}>Log Notes</Typography>
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
                   // onClick={handleClickOpen}
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
                                  <LeaderboardIcon
                                    style={{  zIndex: 1 }}
                                  />
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
                                  //onClick={() => handleUpdateClick(detail, log)}
                                />
                              </div>
                            </Grid>
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography variant="body1" color="textSecondary" marginLeft="26px" marginTop="20px">
                      No log details available.
                    </Typography>
                  )}
                </Grid>
               
              </Paper>
          </div>
        </Grid>
        <Grid item md={4} xs={12}>
          <Typography variant="button" className={classes.divider}>Lead Follow Up</Typography>
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
                   // onClick={handleClickOpen}
                  >
                    Create
                  </Button>
                </div>
                <Grid container spacing={1} direction="column" marginTop="15px">
                  {Followlist.map((followup, index) => (
                    <Grid item key={index} style={{ position: "relative" }}>
                      <div style={{ display: "flex", alignItems: "center" ,}}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <AccessAlarmIcon style={{  zIndex: 1 }} />
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
                
                {/* lead log dialog */}
                {/* <Dialog open={open} onClose={handleleadlogClose}>
                  <DialogTitle>Create Lead Log</DialogTitle>
                  <DialogContent>
                    <DialogContentText
                      style={{ gap: "5px", marginBottom: "15px" }}
                    >
                      To create a new lead Log, please enter all the information
                      below.
                    </DialogContentText>
                    <Grid item xs={6}>
                      <CustomInputField
                        label="Lead name"
                        fullWidth
                        value={mainlist?.leadName}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <CustomInputField
                        label="Date"
                        fullWidth
                        type="date"
                        value={statelog.date}
                        onChange={(e) =>
                          setStatelog({
                            ...statelog,
                            date: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <CustomInputField
                        label="Time"
                        fullWidth
                        type="time"
                        value={statelog.time}
                        onChange={(e) =>
                          setStatelog({
                            ...statelog,
                            time: e.target.value,
                          })
                        }
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <p
                        style={{
                          textAlign: "left",
                          fontWeight: "normal",
                          fontSize: "15px",
                        }}
                      >
                        Lead status
                      </p>

                      <CustomInputAndSelectField
                        options={LeadStatusList?.map((item) => item.statusName)}
                        value={statelog.statusName}
                        changeCallBack={(e, v) => {
                          const selectedDept = LeadStatusList.find(
                            (item) => item.statusName === v
                          );
                          setStatelog({
                            ...statelog,
                            statusName: v,
                            leadStatusID: selectedDept._id
                              ? selectedDept._id
                              : null,
                          });
                        }}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <p
                        style={{
                          textAlign: "left",
                          fontWeight: "normal",
                          fontSize: "15px",
                        }}
                      >
                        Employee Name
                      </p>

                      <CustomInputAndSelectField
                        options={MemberList?.map(
                          (item) => item.personalDetails.employeeName
                        )}
                        value={statelog.employeeName}
                        changeCallBack={(e, v) => {
                          const selectedEmp = MemberList.find(
                            (item) => item.personalDetails.employeeName === v
                          );
                          setStatelog({
                            ...statelog,
                            employeeName: v,
                            members: selectedEmp._id ? selectedEmp._id : null,
                          });
                        }}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <p
                        style={{
                          textAlign: "left",
                          fontWeight: "normal",
                          fontSize: "15px",
                        }}
                      >
                        Notes
                      </p>

                      <CustomInputAndSelectField
                        options={NoteList?.map((item) => item.noteDescription)}
                        value={statelog.noteDescription}
                        changeCallBack={(e, v) => {
                          const selectedDept = NoteList.find(
                            (item) => item.noteDescription === v
                          );
                          setStatelog({
                            ...statelog,
                            noteDescription: v,
                            noteID: selectedDept._id ? selectedDept._id : null,
                          });
                        }}
                        fullWidth
                      />
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleleadlogClose} color="primary">
                      Cancel
                    </Button>

                    {statelog.isUpdatelog ? (
                      <Button
                        //onClick={() => handleUpdateLeadlog(state.id)}
                        color="primary"
                      >
                        Update
                      </Button>
                    ) : (
                      <Button 
                     // onClick={handleCreateLeadlog} 
                      color="primary">
                        Create
                      </Button>
                    )}
                  </DialogActions>
                </Dialog> */}
              </Paper>
          </div>
        </Grid>
      </Grid>
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            Lead Status
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => setOpenDialog(false)}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <div className={classes.form}>
              <Grid
                container
                spacing={3}
                alignItems="flex-start"
                direction="row"
                justifyContent="stretch"
              >
                <Grid item xs={12}>
                  <div className={classes.form}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          variant="standard"
                          id="Status"
                          name="Status"
                          label="Status"
                          value={state.Status_Name}
                          onChange={(e) => {
                            const regex = /^[a-zA-Z\s]*$/; // Regular expression to allow only letters and spaces
                            if (regex.test(e.target.value)) {
                              setState({
                                ...state,
                                Status_Name: e.target.value,
                              });
                            }
                          }}
                          error={!!errors.Status_Name}
                          helperText={errors.Status_Name}
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
                          onChange={(e) =>
                            setState({ ...state, Description: e.target.value })
                          }
                          error={!!errors.Description}
                          helperText={errors.Description}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            {state.isUpdate ? (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleUpdateLeadStatus}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateLeadStatus}
                >
                  Create
                </Button>
              </>
            )}
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>  

    

      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        onDelete={handleLeadStatusDelete}
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

export default LeadDetails;
