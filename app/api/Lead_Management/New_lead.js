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
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import AddIcon from "@mui/icons-material/Add";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
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

    if (!state.Phone_Number.trim()) {
      errors.Phone_Number = "Phone Number is required";
      isValid = false;
    } else if (state.Phone_Number.length !== 10) {
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
  const [open2, setOpen2] = React.useState(false);
  const [openPopperId, setOpenPopperId] = useState(null); // State to track which row's menu is open

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

  //   const fetchLead = () => {
  //     axios
  //       .get(`${process.env.REACT_APP_BASE_URL}/api/auth/getAllCampaigns`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then((response) => {
  //         if (response.data.data) {
  //           setRowdata(
  //             response.data.data.map((item) => ({
  //               slNo: response.data.data.indexOf(item) + 1,
  //               id: item._id,
  //               campaignName: item.campaignName,
  //               status: item.campaignStatus,
  //               startedOn: item.createDate.slice(0, 10),
  //               actions: (
  //                 <>
  //                   <IconButton
  //                     aria-label="Edit"
  //                     onClick={(e) => {
  //                       window.scrollTo({
  //                         top: 0,
  //                         behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
  //                       });
  //                       setItemToDelete(item._id);
  //                       // Set state with required format
  //                       setState({
  //                         campaignName: item.campaignName, // Set campaign name
  //                         membersID: item.membersID.map((member) => member.id), // Extract only IDs from membersID
  //                         employeeName: item.membersID.map((member) => ({
  //                           title: member.employeeName,
  //                           id: member.id,
  //                         })), // Format employeeName as [{ title, id }]
  //                         campaignStatus: { title: item.campaignStatus }, // Set campaignStatus as { title: 'Active' }
  //                         channelID: item.channelID.map((channel) => channel.id), // Extract only IDs from channelID
  //                         channelName: item.channelID.map((channel) => ({
  //                           title: channel.channelName,
  //                           id: channel.id,
  //                         })), // Format channelName as [{ title, id }]
  //                         isUpdate: true, // Set isUpdate to true for edit mode
  //                         fieldset: item.fields.map((field) => ({
  //                           name: field.name,
  //                           value: field.value.toString(),
  //                         })), // Format fieldset as [{ name, value }]
  //                       });
  //                       setOpenDialog(true);
  //                     }}
  //                   >
  //                     <EditIcon />
  //                   </IconButton>
  //                   <IconButton
  //                     aria-label="Delete"
  //                     onClick={() => {
  //                       setItemToDelete(item._id);
  //                       setDeleteDialogOpen(true);
  //                     }}
  //                   >
  //                     <DeleteIcon />
  //                   </IconButton>
  //                 </>
  //               ),
  //             }))
  //           );
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //       });
  //   };
  const handleToggle = (id) => {
    setOpenPopperId((prevId) => (prevId === id ? null : id)); // Toggle Popper for each row
  };

  const handleClose2 = (event, id) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpenPopperId(null); // Close Popper for specific row
  };

  const anchorRef = useRef([]);
  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen2(false);
    }
  }
  const prevOpen = React.useRef(open2);
  React.useEffect(() => {
    if (prevOpen.current === true && open2 === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open2;
  }, [open2]);
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
                  <div style={{ display: "flex" }}>
                    <Button
                      ref={(el) => (anchorRef.current[index] = el)}
                      aria-controls={
                        openPopperId === index ? "menu-list-grow" : undefined
                      }
                      aria-haspopup="true"
                      onClick={() => handleToggle(index)}
                    >
                      v
                    </Button>
                    <Popper
                      open={openPopperId === index}
                      anchorEl={anchorRef.current[index]}
                      role={undefined}
                      transition
                      disablePortal
                    >
                      {({ TransitionProps, placement }) => (
                        <Grow
                          {...TransitionProps}
                          style={{
                            transformOrigin:
                              placement === "bottom"
                                ? "center top"
                                : "center bottom",
                          }}
                        >
                          <Paper>
                            <ClickAwayListener
                              onClickAway={(e) => handleClose2(e, index)}
                            >
                              <MenuList
                                autoFocusItem={openPopperId === index}
                                id="menu-list-grow"
                              >
                                <MenuItem
                                  onClick={() => handleClose2(null, index)}
                                >
                                  Profile
                                </MenuItem>
                                <MenuItem
                                  onClick={() => handleClose2(null, index)}
                                >
                                  My account
                                </MenuItem>
                                <MenuItem
                                  onClick={() => handleClose2(null, index)}
                                >
                                  Logout
                                </MenuItem>
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </div>
                </>
              ),
            }))
          );
          setLength(response.data.totalItems);
          setPagination(true);
        }
        console.log(response.data.data);
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
        setMessage("Saved successfully!");
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteCampaign`,
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
  //   const handleUpdateCampaign = async () => {
  //     try {
  //       const loginHeaders = new Headers();
  //       loginHeaders.append("Content-Type", "application/json");

  //       // Assuming you have an authorization token stored in localStorage
  //       const token = localStorage.getItem("token");
  //       if (token) {
  //         loginHeaders.append("Authorization", `Bearer ${token}`);
  //       }
  //       const data = {
  //         id: parseInt(itemToDelete), // id from itemToDelete,
  //         campaignName: state.campaignName, // campaignName from state
  //         membersID: state.membersID, // membersID from state
  //         fields: state.fieldset.map((field) => ({
  //           name: field.name,
  //           value: parseInt(field.value),
  //         })), // Transform fieldset into fields array
  //         channelID: state.channelID, // channelID from state
  //         campaignStatus: state.campaignStatus.title, // campaignStatus title from state
  //       };

  //       if (!validate()) {
  //         setMessage("Please fill all required fields");
  //         setOpen(true);
  //         setSeverity("warning");
  //         return;
  //       } else {
  //         const requestOptions = {
  //           method: "PUT",
  //           headers: loginHeaders,
  //           body: JSON.stringify(data),
  //         };
  //         const res = await fetch(
  //           `${process.env.REACT_APP_BASE_URL}/api/auth/updateCampaign`,
  //           requestOptions
  //         );

  //         const actualData = await res.json();
  //         //console.log(actualData);
  //         // setVisaList(actualData.Country);
  //         if (actualData.status == 200) {
  //           fetchLead();
  //           window.scrollTo({
  //             top: 400,
  //             behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
  //           });
  //           setOpenDialog(false);
  //           setState({
  //             campaignName: "",
  //             membersID: [],
  //             employeeName: [],
  //             channelName: [],
  //             channelID: [],
  //             campaignStatus: "",
  //             fieldset: [{ name: "", value: "" }],
  //             isUpdate: false,
  //           });
  //           setMessage("Updated successfully!");
  //           setOpen(true);
  //           setSeverity("success");
  //           // Navigate("/Department");
  //         } else {
  //           setMessage(actualData.message);
  //           setOpen(true);
  //           setSeverity("error");
  //         }
  //       }
  //     } catch (err) {
  //       //console.log(err);
  //       // toast.error("Failed to save. Please try again.", {
  //       //   position: "top-center",
  //       // });
  //       setMessage(err.message);
  //       setOpen(true);
  //       setSeverity("error");
  //     }
  //   };
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
  const handleDeleteSection = (idx) => {
    setState({
      ...state,
      fieldset: state.fieldset.filter((_, index) => index !== idx),
    });
  };
  console.log(state, "sssssss");
  console.log(open2, "eeeeeee");
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
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>New lead</DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => setOpenDialog(false)}
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
                      const validInput = input.replace(/[^a-zA-Z\s]/g, "");
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
            {state.isUpdate ? (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  //   onClick={handleUpdateCampaign}
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
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Close
            </Button>
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