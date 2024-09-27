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
  CircularProgress,
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
import { storage } from "../../../../firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
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
    fieldset: [{ name: "", value: "" }],
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
  const [openDialogMeta, setOpenDialogMeta] = useState(false);
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getallemployeeuser`,
        requestOptions
      );
      const actualData = await res.json();
      if (Array.isArray(actualData.users)) {
        const newobj = actualData.users.map((item) => ({
          title: item.adminName, // Set the title from channelName
          id: item._id, // Set the id from _id
        }));
        setEmpList(actualData.users);
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
                        Employee_Name: {title:item.projectCreatorID.creatorName,id:item.projectCreatorID.value},

                        Project_Title: item.projectTitle,
                        Project_File: item.projectCvfileName,
                        Start_Date: item.projectStartDate.slice(0, 10),
                        End_Date: item.projectEndDate.slice(0, 10),
                        Description: item.projectDescription,
                        Status: {title:item.projectStatus},
                        Progress: item.projectProgressRate,
                        isUpdate:true,
                        id: item._id,
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
                  <IconButton
                    aria-label="Info"
                    
                    onClick={(e) => {
                     navigate("/app/sales/project/project-metadata",{state:{id:item._id}});
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </>
              ),
            }))
          );
          setLength(response.data.totalRecords);
          setPagination(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  const validateAllFields = () => {
    let isValid = true;
    let errors = {};
  
    if (!state.Project_Title) {
      errors.Project_Title = "Project Title is required";
      isValid = false;
    }
  
    if (!state.Start_Date) {
      errors.Start_Date = "Start Date is required";
      isValid = false;
    }
  
    if (!state.End_Date) {
      errors.End_Date = "End Date is required";
      isValid = false;
    }
  
    if (!state.Description) {
      errors.Description = "Description is required";
      isValid = false;
    }
  
    if (!state.Progress) {
      errors.Progress = "Progress is required";
      isValid = false;
    }
  
    if (!state.Project_File) {
      errors.Project_File = "Project File is required";
      isValid = false;
    }
  
    if (!state.Status) {
      errors.Status = "Status is required";
      isValid = false;
    }
  
    if (!state.Employee_Name.title) {
      errors.Employee_Name = "Employee Name is required";
      isValid = false;
    }
  
    console.log(errors);
    console.log(isValid);
    setErrors(errors);
    return isValid;
  };
  
  useEffect(() => {
    fetchProject(page);
  }, [page, rowsPerPage]);
  useEffect(() => {
    table3();
  }, []);
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
  const handleUpdateProject = async () => {
    if(!validateAllFields())return;
    try {
      // Prepare the data to match the required request body format
      const data = {
        id:parseInt(itemToDelete),
        projectCreatorID: state.Employee_Name.id,
      projectTitle: state.Project_Title,
      projectCvfileName: state.Project_File,
      projectStartDate: state.Start_Date,
      projectEndDate: state.End_Date,
      projectDescription: state.Description,
      projectStatus: state.Status.title,
      projectProgressRate: parseInt(state.Progress),
      };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updateProject`,
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
  const handleAddSection = () => {
    setState({
      ...state,
      fieldset: [...state.fieldset, { name: "", value: "" }],
    });
  };
  const handleDeleteSection = (idx) => {
    setState({
      ...state,
      fieldset: state.fieldset.filter((_, index) => index !== idx),
    });
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
  const [isLoading, setisLoading] = useState(false);
  const handleFilesChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setisLoading(true);
      const imageRef = ref(storage, `/photo/${file.name}`);
      uploadBytes(imageRef, file).then(() => {
        getDownloadURL(imageRef).then((url) => {
          // console.log(url);
          setState((prevState) => ({
            ...prevState,
            Project_File: url,
          }));
          setisLoading(false);
        });
      });
    }
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
               
               {state.isUpdate ?(<>
                 
             
                <Grid item xs={6}>
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

                <Grid item xs={6}>
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
                    sx={{ width: 270 }} // Set width to 414px
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.Start_Date} // Show error if it exists
                    helperText={errors.Start_Date} // Display error message
                  />
                </Grid>
                <Grid item xs={6}>
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
                    sx={{ width: 270 }} // Set width to 414px
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
                          .split("T")[0], // Adding one day to Start_Date if it's not empty
                      }),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
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
                </Grid>              
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="ProgressRate"
                    name="ProgressRate"
                    label="Progress Rate"
                    value={state.Progress}
                    onChange={(e) => {
                      const input = e.target.value;
                      const validInput = input.replace(/[^0-9]/g, ""); // Allow only digits (0-9)
                      setState({
                        ...state,
                        Progress: validInput,
                      });
                    }}
                    
                    error={!!errors.Progress} // Show error if it exists
                    helperText={errors.Progress} // Display error message
                  />
                </Grid>
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
                </Grid>
                <Grid item xs={12}>
                            <Typography color={"primary"} sx={{ marginTop: "10px" }}>
                                <label style={{ cursor: 'pointer', position: 'relative' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFilesChange}
                                        style={{ display: 'none' }}
                                    />
                                    <AddIcon /> Click to upload project file
                                </label>
                                {isLoading && (
                                    <div
                                        style={{
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            width: '100vw',
                                            height: '100vh',
                                            backgroundColor: 'rgba(255, 255, 255, 0.7)', // semi-transparent white background
                                            backdropFilter: 'blur(2px)', // apply the blur effect
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 9999, // ensure it is on top of other content
                                        }}
                                    >
                                        <CircularProgress size={24} />
                                    </div>
                                )}
                                {errors.Project_File && <Typography color="error" style={{ fontSize: "12px" }}>{errors.Project_File}</Typography>}
                            </Typography>

                            <Grid container spacing={2} sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", marginTop: "10px", paddingLeft: "20px" }}>
                                {state.Project_File && 
                                    <img src={state.Project_File}  alt="..." style={{ width: "100px", height: "100px", margin: "5px", borderRadius: "10px", objectFit: "cover" }} />
                                }
                            </Grid>

                        </Grid>
               </>):(
                <> <Grid item xs={9}>
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

                <Grid item xs={7}>
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
                    sx={{ width: 414 }} // Set width to 414px
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.Start_Date} // Show error if it exists
                    helperText={errors.Start_Date} // Display error message
                  />
                </Grid>
                <Grid item xs={7}>
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
                    sx={{ width: 414 }} // Set width to 414px
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
                          .split("T")[0], // Adding one day to Start_Date if it's not empty
                      }),
                    }}
                  />
                </Grid></>)} 
              

               
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
                  onClick={handleUpdateProject}
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
        {/* <Dialog
  open={openDialogMeta}
  onClose={handleClear}
  fullWidth
  maxWidth="md"
>
  <DialogTitle>Project Meta Data</DialogTitle>
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
        {state.fieldset.map((el, idx) => (
          <Grid
            container
            spacing={2}
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: 0,
            }}
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
                  const inputValue = e.target.value;
                  if (inputValue.length <= 50) {
                    const newFieldset = [...state.fieldset];
                    newFieldset[idx].name = inputValue;
                    setState({ ...state, fieldset: newFieldset });
                  }
                }}
                error={!!errors[`fieldsetName${idx}`]}
                helperText={errors[`fieldsetName${idx}`]}
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
                  const inputValue = e.target.value;
                  const regex = /^[0-9]*$/;
                  if (regex.test(inputValue)) {
                    const newFieldset = [...state.fieldset];
                    newFieldset[idx].value = inputValue;
                    setState({ ...state, fieldset: newFieldset });
                  }
                }}
                error={!!errors[`fieldsetValue${idx}`]}
                helperText={errors[`fieldsetValue${idx}`]}
              />
            </Grid>
            {idx > 0 && (
              <Grid item xs={1}>
                <DeleteIcon
                  onClick={() => handleDeleteSection(idx)}
                  style={{
                    cursor: "pointer",
                    color: "red",
                    width: 24,
                    height: 24,
                    marginTop: 8,
                  }}
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
    <Button
      onClick={handleClear}
      color="secondary"
    >
      Close
    </Button>
    {state.isUpdate ? (
      <Button
        color="primary"
        variant="contained"
        //onClick={handleUpdateCampaign}
      >
        Update
      </Button>
    ) : (
      <Button
        color="primary"
        variant="contained"
        //onClick={handleCreateCampaign}
      >
        Create
      </Button>
    )}
  </DialogActions>
</Dialog> */}

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
