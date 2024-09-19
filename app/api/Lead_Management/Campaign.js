import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";
import AlertDialog from "../../containers/UiElements/demos/DialogModal/AlertDialog";
import axios from "axios";
import TablePlayground from "../../containers/Tables/TablePlayground";
import Popup from "../../components/Popup/Popup"
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";

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

function Campaign() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");

  const [state, setState] = useState({
    membersID: [],
    campaignName: "",
    employeeName: [],
    campaignStatus: null,
    channelID: [],
    channelName: [],
    isUpdate: false,
    fieldset: [{ name: "", value: "" }],
  });

  // console.log(state);

  const [errors, setErrors] = useState({
    campaignName: "",
    employeeName: "",
    channelName: "",
    campaignStatus: "",
    fieldset: [{ name: "", value: "" }],
  });

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.campaignName.trim()) {
      errors.campaignName = "Campaign Name is required";
      isValid = false;
    }

    if (state.employeeName.length === 0) {
      errors.employeeName = "At least one Employee must be selected";
      isValid = false;
    }

    if (state.channelName.length === 0) {
      errors.channelName = "At least one Channel must be selected";
      isValid = false;
    }

    if (!state.campaignStatus) {
      errors.campaignStatus = "Campaign Status is required";
      isValid = false;
    }

    state.fieldset.forEach((item, index) => {
      if (!item.name.trim()) {
        errors[`fieldsetName${index}`] = "Field name is required";
        isValid = false;
      }
      if (!item.value.trim()) {
        errors[`fieldsetValue${index}`] = "Field value is required";
        isValid = false;
      }
    });

    setErrors(errors);
    return isValid;
  };

  const [rowdata, setRowdata] = useState([]);
  // console.log(rowdata, "rowdata");
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
      id: "campaignName",
      numeric: false,
      disablePadding: false,
      label: "Campaign Name",
    },
    {
      id: "status",
      numeric: false,
      disablePadding: false,
      label: "Status",
    },
    {
      id: "startedOn",
      numeric: false,
      disablePadding: false,
      label: "Started On",
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
  // console.log(channelList);
  // console.log(state);
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
        setChannelList(newobj);
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

  useEffect(() => {
    table3();
    table4();
    fetchCampaign();
  }, []);

  const fetchCampaign = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/auth/getAllCampaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.data) {
          setRowdata(
            response.data.data.map((item) => ({
              slNo: response.data.data.indexOf(item) + 1,
              id: item._id,
              campaignName: item.campaignName,
              status: item.campaignStatus,
              startedOn: item.createDate.slice(0, 10),
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
                      // Set state with required format
                      setState({
                        campaignName: item.campaignName, // Set campaign name
                        membersID: item.membersID.map((member) => member.id), // Extract only IDs from membersID
                        employeeName: item.membersID.map((member) => ({
                          title: member.employeeName,
                          id: member.id,
                        })), // Format employeeName as [{ title, id }]
                        campaignStatus: { title: item.campaignStatus }, // Set campaignStatus as { title: 'Active' }
                        channelID: item.channelID.map((channel) => channel.id), // Extract only IDs from channelID
                        channelName: item.channelID.map((channel) => ({
                          title: channel.channelName,
                          id: channel.id,
                        })), // Format channelName as [{ title, id }]
                        isUpdate: true, // Set isUpdate to true for edit mode
                        fieldset: item.fields.map((field) => ({
                          name: field.name,
                          value: field.value.toString(),
                        })), // Format fieldset as [{ name, value }]
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

  const handleCreateCampaign = async () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    try {
      // Prepare the data to match the required request body format
      const data = {
        campaignName: state.campaignName, // campaignName from state
        membersID: state.membersID, // membersID from state
        fields: state.fieldset.map((field) => ({
          name: field.name,
          value: parseInt(field.value),
        })), // Transform fieldset into fields array
        channelID: state.channelID, // channelID from state
        campaignStatus: state.campaignStatus.title, // campaignStatus title from state
      };

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createCampaign`,
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
        fetchCampaign();
        window.scrollTo({
          top: 400,
          behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
        });
        // Reset the state after successful creation
        setState({
          campaignName: "",
          membersID: [],
          employeeName: [],
          channelName: [],
          channelID: [],
          campaignStatus: "",
          fieldset: [{ name: "", value: "" }],
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
      //console.log(err);
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
        fetchCampaign();
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
  const handleUpdateCampaign = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const token = localStorage.getItem("token");
      if (token) {
        loginHeaders.append("Authorization", `Bearer ${token}`);
      }
      const data = {
        id: parseInt(itemToDelete), // id from itemToDelete,
        campaignName: state.campaignName, // campaignName from state
        membersID: state.membersID, // membersID from state
        fields: state.fieldset.map((field) => ({
          name: field.name,
          value: parseInt(field.value),
        })), // Transform fieldset into fields array
        channelID: state.channelID, // channelID from state
        campaignStatus: state.campaignStatus.title, // campaignStatus title from state
      };

      if (!validate()) {
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
          `${process.env.REACT_APP_BASE_URL}/api/auth/updateCampaign`,
          requestOptions
        );

        const actualData = await res.json();
        //console.log(actualData);
        // setVisaList(actualData.Country);
        if (actualData.status == 200) {
          fetchCampaign();
          window.scrollTo({
            top: 400,
            behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
          });
          setOpenDialog(false);
          setState({
            campaignName: "",
            membersID: [],
            employeeName: [],
            channelName: [],
            channelID: [],
            campaignStatus: "",
            fieldset: [{ name: "", value: "" }],
            isUpdate: false,
          });
          setMessage("Updated successfully!");
          setOpen(true);
          setSeverity("success");
          // Navigate("/Department");
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
  const handlePageChange = (event, newPage) => {
    setPage(newPage); // Update the current page
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update the rows per page
    setPage(0); // Reset to first page
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
  //console.log(state, "sssssss");
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
                <AddIcon /> Add Campaign
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
          open={openDialog}
          onClose={() => { 
            setState({
              membersID: [],
    campaignName: "",
    employeeName: [],
    campaignStatus: null,
    channelID: [],
    channelName: [],
    isUpdate: false,
    fieldset: [{ name: "", value: "" }],
            })
            setOpenDialog(false)}}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            Campaign
          </DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => { 
              setState({
                membersID: [],
      campaignName: "",
      employeeName: [],
      campaignStatus: null,
      channelID: [],
      channelName: [],
      isUpdate: false,
      fieldset: [{ name: "", value: "" }],
              })
              setOpenDialog(false)}}
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
                    id="CampaignName"
                    name="CampaignName"
                    label="Campaign Name"
                    value={state.campaignName}
                    onChange={(e) => {
                      const regex = /^[a-zA-Z\s]*$/; // Allow only letters and spaces
                      if (regex.test(e.target.value)) {
                        setState({ ...state, campaignName: e.target.value });
                      }
                    }}
                    error={!!errors.campaignName} // Show error if it exists
                    helperText={errors.campaignName} // Display error message
                  />
                </Grid>

                <Grid item xs={6}>
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={empList}
                    value={state.employeeName}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(e, v) => {
                      const selectempIds = v.map((item) => item.id);
                      setState({
                        ...state,
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
                        placeholder="Favorites"
                        error={!!errors.employeeName} // Show error if it exists
                        helperText={errors.employeeName} // Display error message
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={channelList}
                    getOptionLabel={(option) => option.title}
                    value={state.channelName}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(e, v) => {
                      const selectedChannelIds = v.map((item) => item.id);
                      setState({
                        ...state,
                        channelName: v,
                        channelID: selectedChannelIds,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Channel Name"
                        placeholder="Favorites"
                        error={!!errors.channelName} // Show error if it exists
                        helperText={errors.channelName} // Display error message
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    sx={{
                      marginTop: "-16px"
                    }}
                    id="highlights-demo"
                    options={[
                      { title: "Active" },
                      { title: "Inactive" },
                      { title: "Completed" },
                    ]}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    value={state.campaignStatus} // Ensure value is an object or null
                    onChange={(e, v) => {
                      setState({
                        ...state,
                        campaignStatus: v ? v : null, // Set campaignStatus to the selected object or null
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Campaign Status"
                        margin="normal"
                        variant="standard"
                        error={!!errors.campaignStatus} // Show error if it exists
                        helperText={errors.campaignStatus} // Display error message
                      />
                    )}
                  />
                </Grid>

                {state.fieldset.map((el, idx) => (
                  <Grid
                    container
                    spacing={2}
                    key={idx}
                    style={{ display: "flex", alignItems: "center", marginLeft: 0 }}
                    xs={12}
                  >
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        variant="standard"
                        id={`name-${idx}`}
                        name="name"
                        label="Name"
                        value={el.name}
                        onChange={(e) => {
                          const newFieldset = [...state.fieldset];
                          newFieldset[idx].name = e.target.value;
                          setState({ ...state, fieldset: newFieldset });
                        }}
                        error={!!errors[`fieldsetName${idx}`]} // Show error if it exists
                        helperText={errors[`fieldsetName${idx}`]} // Display error message
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        variant="standard"
                        id={`value-${idx}`}
                        name="value"
                        label="Value"
                        value={el.value}
                        onChange={(e) => {
                          const newFieldset = [...state.fieldset];
                          newFieldset[idx].value = e.target.value;
                          setState({ ...state, fieldset: newFieldset });
                        }}
                        error={!!errors[`fieldsetValue${idx}`]} // Show error if it exists
                        helperText={errors[`fieldsetValue${idx}`]} // Display error message
                      />
                    </Grid>
                    {idx > 0 && (
                      <Grid item xs={1}>
                        <DeleteIcon
                          onClick={() => handleDeleteSection(idx)}
                          style={{ cursor: "pointer", color: "red", width: 24, height: 24, marginTop: 8 }}
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
            </div>
          </DialogContent>
          <DialogActions>
          <Button onClick={() => { 
            setState({
              membersID: [],
    campaignName: "",
    employeeName: [],
    campaignStatus: null,
    channelID: [],
    channelName: [],
    isUpdate: false,
    fieldset: [{ name: "", value: "" }],
            })
            setOpenDialog(false)}} color="secondary">
              Close
            </Button>
            {state.isUpdate ? (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleUpdateCampaign}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateCampaign}
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
          title="Campaign List"
          columnData={columnData}
          rowData={rowdata}
          component="div"
          count={rowdata.length} // Total number of rows
          rowsPerPage={rowsPerPage} // Number of rows per page
          page={page} // Current page
          onPageChange={handlePageChange} // Handle page change
          onRowsPerPageChange={handleRowsPerPageChange} // Handle rows per page change
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

export default Campaign;
