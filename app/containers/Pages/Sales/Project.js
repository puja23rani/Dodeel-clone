import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";

import axios from "axios";
import { PapperBlock } from "enl-components";

import { toast } from "react-toastify";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import DeleteIcons from "@mui/icons-material/Delete";
import TablePlayground from "../../Tables/TablePlayground";
import Popup from "../../../components/Popup/Popup";
import AlertDialog from "../../UiElements/demos/DialogModal/AlertDialog";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  Menu,
  Switch,
} from "@mui/material";
import { Close as CloseIcon, Description } from "@mui/icons-material";
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

import { useNavigate } from "react-router-dom";
import { end, start } from "@popperjs/core";

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

function Project() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    Project_Title: "",
    Start_Date: "",
    End_Date: "",
    Description: "",
    Progress: null,
    Project_File: null,
    Status: "",
    searchText: "",
    isUpdate: false,
  });
  const [errors, setErrors] = useState({
    Project_Title: "",
    Start_Date: "",
    End_Date: "",
    Description: "",
    Progress: "",
    Project_File: "",
    // Photos: ["https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fphotos%2Fjob&psig=AOvVaw0ENWvfhd_yYYWehvVXrHcA&ust=1718197241609000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKiq2ujN04YDFQAAAAAdAAAAABAE",
    Status: "",
    searchText: "",
    isUpdate: false,
  });
  const validateProjectFields = () => {
    let isValid = true;
    let errors = {};

    if (!state.Project_Title) {
      errors.Project_Title = "Project Title is required";
      isValid = false;
    }

    if (!state.Start_Date.trim()) {
      errors.Start_Date = "Start Date is required";
      isValid = false;
    }

    if (!state.End_Date.trim()) {
      errors.End_Date = "End Date is required";
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
      id: "projectTitle",
      numeric: false,
      disablePadding: false,
      label: "Project Title",
    },
    {
      id: "startdate",
      numeric: true,
      disablePadding: false,
      label: "Start Date",
    },
    {
      id: "enddate",
      numeric: true,
      disablePadding: false,
      label: "End Date",
    },
    {
      id: "progress",
      numeric: true,
      disablePadding: false,
      label: "Progress",
    },
    {
      id: "status",
      numeric: true,
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
        setEmpList(actualData.employees);
      }
    } catch (err) {
      //console.log(err);
    }
  };
  function fetchProject(pg) {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllProjects`,
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
              projectTitle: item.projectTitle || "N/A",
              startdate: item.projectStartDate.slice(0, 10) || "",
              enddate: item.projectEndDate.slice(0, 10) || "",
              enddate: item.projectEndDate.slice(0, 10) || "",
              progress: item.projectProgressRate || "N/A",
              status: item.projectStatus || "N/A",

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
                        
                        Employee_Name: item.projectCreatorID.employeeName,
                        
                        Project_Title: vs.projectTitle,
                        Project_File: vs.projectCvfileName,
                        Start_Date: vs.projectStartDate.slice(0, 10),
                        End_Date: vs.projectEndDate.slice(0, 10),
                        Description: vs.projectDescription,
                        Status: vs.projectStatus,
                        Progress: vs.projectProgressRate,
                  
                        id: vs._id,
                      })
                    
                     
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
          setLength(response.data.totalCustomers);
          setPagination(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  useEffect(() => {
    fetchProject(page);
  }, [page, rowsPerPage]);
  useEffect(() => {
    table3();
  },[])
  const handleCreateProject = async () => {
    if (!validateProjectFields()) {
      return;
    }
    try {
      // Prepare the data to match the required request body format
      const data = {
        projectTitle: state.Project_Title,
        projectStartDate: state.Start_Date,
        projectEndDate: state.End_Date,
      };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createProject`,
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
        fetchProject(page);
        window.scrollTo({
          top: 400,
          behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
        });
        // Reset the state after successful creation
        setState({
          Project_Title: "",
          Start_Date: "",
          End_Date: "",
          Description: "",
          Progress: null,
          Project_File: null,
          Status: "",
          searchText: "",
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
  console.log(state, "sssssss");
  const handleProjectDelete = async () => {
    try {
      const data = { id: parseInt(itemToDelete) };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteProjectById`,
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
        fetchProject(page);
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
  const handleClear = () => {
    setState({
      Company_Name: "",
      Customer_Name: "",
      Phone_Number: "",
      Email: "",
      Lead_Name: "",
      Lead_Id: "",
      Employee_Name: "",
      Employee_Id: "",
      Description: "",
      Billing_Address: "",
      Shipping_Address: "",
      Status: "",
      searchText: "",
      isUpdate: false,

      toggle: false,
    });
    setErrors({
      Company_Name: "",
      Customer_Name: "",
      Phone_Number: "",
      Email: "",
      Lead_Name: "",
      Lead_Id: "",
      Employee_Name: "",
      Employee_Id: "",

      Billing_Address: "",
      Shipping_Address: "",
      Status: "",

      isUpdate: false,

      toggle: false,
    });
    setOpenDialog(false);
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
                <AddIcon /> Add Project
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
          open={openDialog}
          onClose={handleClear}
          style={{ width: "80vw" }}
        >
          <DialogTitle>Project</DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClear}
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
              {state.isUpdate &&(<> <Grid item xs={6}>
                  <Autocomplete
                    sx={{
                      marginTop: "-16px",
                    }}
                    id="highlights-demo"
                    options={
                      empList.map((item) => {
                        return {
                          id: item._id,
                          title: item.personalDetails.employeeName,
                        };
                      }) || []
                    }
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    isOptionEqualToValue={(option, value) =>
                      value && value.id ? option.id === value.id : false
                    }
                    value={state.Employee_Name}
                    onChange={(e, v, reason) => {
                      if (reason === "clear") {
                        setState({
                          ...state,
                          Employee_Name: "",
                        });
                      } else {
                        // const selectedLeadStatus = MemberList.find(
                        //   (item) => item.personalDetails.employeeName === v
                        // );
                        setState({
                          ...state,
                          Employee_Name: v,
                        });
                      }
                    }}
                   
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        
                        label="Employee Name"
                        margin="normal"
                        variant="standard"
                        name="employeeName"
                        error={!!errors.Employee_Name} // Show error if it exists
                        helperText={errors.Employee_Name} // Display error message
                      />
                    )}
                  />
                </Grid></>)}
             
                <Grid item xs={state.isUpdate?6:9 }>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="ProjectTitle"
                    name="ProjectTitle"
                    label="Project Title"
                    value={state.Project_Title}
                    onChange={(e) => {
                      const input = e.target.value;
                      const validInput = input.replace(/[^a-zA-Z\s]/g, "");
                      setState({
                        ...state,
                        Project_Title: validInput,
                      });
                    }}
                    error={!!errors.Project_Title} // Show error if it exists
                    helperText={errors.Project_Title} // Display error message
                  />
                </Grid>
                
                <Grid item xs={state.isUpdate?6:7}>
                  <TextField
                    id="date"
                    label="Start Date"
                    type="date"
                    variant="standard"
                    value={state.Start_Date}
                    onChange={(e) =>
                      setState({
                        ...state,
                        Start_Date: e.target.value,
                      })
                    }
                   width={!state.isUpdate?350:414}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.Start_Date} // Show error if it exists
                    helperText={errors.Start_Date} // Display error message
                  />
                </Grid>
                <Grid item xs={state.isUpdate?6:7}>
                  <TextField
                    id="date"
                    label="End Date"
                    type="date"
                    variant="standard"
                    value={state.End_Date}
                    onChange={(e) =>
                      setState({
                        ...state,
                        End_Date: e.target.value,
                      })
                    }
                    width={!state.isUpdate?350:414}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.End_Date} // Show error if it exists
                    helperText={errors.End_Date} // Display error message
                    inputProps={{
                      ...(state.Start_Date && {
                        min: new Date(
                          new Date(state.Start_Date).setDate(
                            new Date(state.Start_Date).getDate() + 1
                          )
                        )
                          .toISOString()
                          .split("T")[0], // Adding one day to invoiceDate if it's not empty
                      }),
                    }}
                  />
                </Grid>
                {state.isUpdate && (
                  <> <Grid item xs={6}>
                  <Autocomplete
                    sx={{
                      marginTop: "-16px",
                    }}
                    id="highlights-demo"
                    options={[
                      { title: "In Progress" },
                      { title: "On Hold" },                     
                      { title: "Completed" },
                      { title: "Cancelled" },
                    ]}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    value={state.Status} // Ensure value is an object or null
                    onChange={(e, v) => {
                      setState({
                        ...state,
                        Status: v ? v : null, // Set campaignStatus to the selected object or null
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Status"
                        margin="normal"
                        variant="standard"
                        error={!!errors.Status} // Show error if it exists
                        helperText={errors.Status} // Display error message
                      />
                    )}
                  />
                </Grid></>
                )}
                {state.isUpdate && (
                  <> 
                  <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="Notes"
                    name="Notes"
                    label="Notes"
                    value={state.Description}
                    onChange={(e) => {
                      const input = e.target.value;
                      
                      setState({
                        ...state,
                        Description: input,
                      });
                    }}
                    error={!!errors.Description} // Show error if it exists
                    helperText={errors.Description} // Display error message
                  />
                </Grid></>
                )}
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClear} color="secondary">
              Close
            </Button>
            {state.isUpdate ? (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  //onClick={handleUpdateLead}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateProject}
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
          title="Project List"
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
        onDelete={handleProjectDelete}
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

export default Project;