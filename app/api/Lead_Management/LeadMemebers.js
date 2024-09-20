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

function LeadMemebers() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");

  const [state, setState] = useState({
    employeeName: [],
    membersID: [],
    leadName: null,
    isUpdate: false,
  });
  const [errors, setErrors] = useState({
    employeeName: "",

    leadName: null,
  });

  const validate = () => {
    let isValid = true;
    let errors = {};
    if (state.membersID.length === 0) {
      errors.employeeName = "At least one Employee must be selected";
      isValid = false;
    }
    if (!state.leadName) {
      errors.leadName = "Campaign Status is required";
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };

  const [rowdata, setRowdata] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [length, setLength] = useState(0);
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
      id: "members",
      numeric: false,
      disablePadding: false,
      label: "Members",
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

  const [leadList, setleadList] = React.useState([]);
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllLeadDetails`,
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
          title: item.leadName, // Set the title from channelName
          id: item._id, // Set the id from _id
        }));
        //console.log(newobj, "neee");
        // Update state with the new array of objects
        setleadList(newobj);
        // setleadList(actualData.data);
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
  }, []);

  function fetchLead(pg) {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllLeadMembers`,
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
            response.data.data.map((item) => ({
              slNo: response.data.data.indexOf(item) + 1,
              id: item._id,
              leadName: item.leadName || "N/A",
              members: item.membersID?.map((name, idx) => (
                <div>
                  {name?.employeeName}
                  {item.membersID?.length - 1 != idx ? "," : " "}
                </div>
              )),

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
                        leadName: { title: item.leadName, id: item.leadID },
                        membersID: item.membersID.map((member) => member.id), // Extract only IDs from membersID
                        employeeName: item.membersID.map((member) => ({
                          title: member.employeeName,
                          id: member.id,
                        })), // Format employeeName as [{ title, id }]

                        isUpdate: true, // Set isUpdate to true for edit mode

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
                </>
              ),
            }))
          );
          setLength(response.data.totalItems);
          setPagination(true);
        }
        // console.log(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  useEffect(() => {
    fetchLead(page);
  }, [page, rowsPerPage]);

  const handleCreatemembers = async () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    try {
      //   Prepare the data to match the required request body format
      const data = {
        leadID: state.leadName.id,
        membersID: state.membersID,
      };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createLeadMember`,
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
        fetchLead();
        window.scrollTo({
          top: 400,
          behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
        });
        // Reset the state after successful creation
        setState({
          employeeName: [],
          membersID: [],
          leadName: null,

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
      //   setMessage(err.message);
      //   setOpen(true);
      //   setSeverity("error");
    }
  };

  const handleCampaignDelete = async () => {
    try {
      const data = { id: parseInt(itemToDelete) };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteLeadMember`,
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
        setMessage(result.message);
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
        leadID: state.leadName.id,
        membersID: state.membersID,
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
          `${process.env.REACT_APP_BASE_URL}/api/auth/updateLeadMember`,
          requestOptions
        );

        const actualData = await res.json();
        //console.log(actualData);
        // setVisaList(actualData.Country);
        if (actualData.status == 200) {
          fetchLead();
          window.scrollTo({
            top: 400,
            behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
          });
          setOpenDialog(false);
          setState({
            employeeName: [],
            membersID: [],
            leadName: null,

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
  console.log(state);
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
                <AddIcon /> Add Lead Members
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
          <DialogTitle>Lead Members</DialogTitle>
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
                        label="Members"
                        placeholder="Member"
                        error={!!errors.employeeName} // Show error if it exists
                        helperText={errors.employeeName} // Display error message
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
                    options={leadList}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    value={state.leadName} // Ensure value is an object or null
                    onChange={(e, v) => {
                      setState({
                        ...state,
                        leadName: v ? v : null, // Set leadName to the selected object or null
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Lead Name"
                        margin="normal"
                        variant="standard"
                        error={!!errors.leadName} // Show error if it exists
                        helperText={errors.leadName} // Display error message
                      />
                    )}
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
                  onClick={handleCreatemembers}
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
          title="Lead Member List"
          columnData={columnData}
          rowData={rowdata}
          pagination={pagination}
          component="div"
          count={length} // Total number of rows
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

export default LeadMemebers;