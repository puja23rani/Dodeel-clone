import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";

import axios from "axios";
import { PapperBlock } from "enl-components";
import TablePlayground from "../../Tables/TablePlayground";
import Popup from "../../../components/Popup/Popup";
import AlertDialog from "../../UiElements/demos/DialogModal/AlertDialog";
import { toast } from "react-toastify";
import InfoIcon from "@mui/icons-material/Info";
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
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { convertFromRaw, EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { useNavigate } from "react-router-dom";
const useStyles = makeStyles()((theme) => ({
  textEditor: {
    // optional padding for better spacing
    padding: "5px",
    backgroundColor: "#ececec",
    minHeight: "300px", // set a minimum height for the editor
    border: "1px solid #ccc", // optional border for better visibility
  },
  toolbarEditor: {
    // boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',  // slight shadow effect
    // optional padding for better spacing

    borderRadius: "4px", // optional rounded corners
    border: "1px solid #ececec",
  },
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

function Proposal() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");

  const [state, setState] = useState({
    type: "Customer", // Default to 'customer'
    billCustomerID: null,
    Customer_Name:"",
    Lead:"",
    leadName: null,
    Proposal_Title: "",
    Proposal_Date: "",
    Valid_Until: "",
    proposalStatus:"",
    proposalNotes:EditorState.createEmpty(),
    proposalViewed:"", 
    isUpdate: false, 
  });
  const [errors, setErrors] = useState({
    Proposal_Title: "",
    Proposal_Date: "",
    Valid_Until: "",
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
  const [rowdata, setRowdata] = useState ([]);
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
  const navigate = useNavigate();
  const columnData = [
    {
      id: "slNo",
      numeric: true,
      disablePadding: false,
      label: "Sl No",
    },
    {
      id: "clientname",
      numeric: false,
      disablePadding: false,
      label: "Client Name",
    },
    {
      id: "proposalTitle",
      numeric: false,
      disablePadding: false,
      label: "Proposal Title",
    },
    {
      id: "proposalDate",
      numeric: false,
      disablePadding: false,
      label: "Proposal Date",
    },
    {
      id: "validUntill",
      numeric: false,
      disablePadding: false,
      label: "Valid Untill",
    },
    { id: "actions", label: "Action" },
  ];
  const [customerList, setCustomerList] = React.useState([]);
  const cust_all = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllCustomers`,
        requestOptions
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const actualData = await res.json();
      console.log(actualData, "ressss");
      // Check if actualData.data is an array
      setCustomerList(actualData.data);
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
    table4();
    
    cust_all();
  }, []);

  function fetchProposal(pg) {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllProposals`,
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
        console.log(response.data);
        if (response.data.data) {
          setRowdata(
            response.data.data.map((item) => ({
              slNo: response.data.data.indexOf(item) + 1,
              clientname : item.proposalClientName,
              proposalTitle: item.proposalTitle,
              proposalDate: item.proposalPublishDate.slice(0, 10),
              validUntill: item.proposalEndDate.slice(0, 10),        
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
                        Proposal_Title: item.proposalTitle,
                        Proposal_Date: item.proposalPublishDate.slice(0, 10),
                        Valid_Until: item.proposalEndDate.slice(0, 10),
                        proposalStatus:{title:item.proposalStatus},
                        proposalNotes:item.proposalNotes =="" ? EditorState.createEmpty():EditorState.createWithContent(
                          convertFromRaw(JSON.parse(item.proposalNotes))
                        ),
                        proposalViewed:{title:item.proposalViewed}, 
                        isUpdate: true,
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
                      navigate("/app/sales/proposal/proposal-view", {
                        state: { updateId: item._id },
                      });
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
  };
useEffect(() => {
  fetchProposal(page);
}, [page,rowsPerPage]);
  const handleCreateProposal = async () => {
    // if (!validate()) {
    //   setMessage("Please fill all required fields");
    //   setOpen(true);
    //   setSeverity("warning");
    //   return;
    // }
    try {
      const data = {
        proposalClientType: state.type,
        proposalClientID: state.type === "Lead" ? state.Lead.id:state.Customer_Name.id, // Use the id from the Lead object
        proposalClientName: state.type === "Lead"?state.Lead.title : state.Customer_Name.title , // Use the title if Customer_Name is empty
       
        proposalTitle: state.Proposal_Title,
        proposalPublishDate: state.Proposal_Date,
        proposalEndDate: state.Valid_Until
      };

     

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createProposal`,
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
        fetchProposal(page);
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
        setMessage("Created Sucessfully!");
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
  const handleUpdateProposal = async () => {
    // if (!validate()) {
    //   setMessage("Please fill all required fields");
    //   setOpen(true);
    //   setSeverity("warning");
    //   return;
    // }
    try {
      console.log("here");
      const data = {
        id: itemToDelete,
      
       
        proposalTitle: state.Proposal_Title,
        proposalPublishDate: state.Proposal_Date,
        proposalEndDate: state.Valid_Until,
    
  
    proposalNotes: JSON.stringify(
      convertToRaw(state.proposalNotes.getCurrentContent())
    ), //optional
    proposalViewed: state.proposalViewed.title,
    proposalStatus: state.proposalStatus.title  //dont add "Expired" in Dropdown  , valid options are 'Draft', 'New', 
      };

     

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updateProposal`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result.status === 200) {
        fetchProposal(page);
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
        setMessage("Created Sucessfully!");
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

  const handleProposalDelete = async () => {
    try {
      const data = { id: itemToDelete };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteProposal`,
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
        fetchProposal(page);
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
  console.log(state,"sttttaatttteee");
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
                <AddIcon /> Add Proposal
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
          open={openDialog}
          onClose={() => {
            setState({
              Status_Name: "",
              Description: "",
              id: "",
              searchText: "",
              isUpdate: false,
            });
            setOpenDialog(false);
          }}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            Proposal
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => {
                setState({
                  Status_Name: "",
                  Description: "",
                  id: "",
                  searchText: "",
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
                      {/* Add option to choose between Lead or Customer */}
                     {!state.isUpdate &&(<><Grid item xs={12}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Select Type</FormLabel>
                          <RadioGroup
                            row
                            value={state.type} // type will be 'lead' or 'customer'
                            onChange={(e) =>
                              setState({ ...state, type: e.target.value })
                            }
                          >
                            <FormControlLabel
                              value="Customer"
                              control={<Radio />}
                              label="Customer"
                            />
                            <FormControlLabel
                              value="Lead"
                              control={<Radio />}
                              label="Lead"
                            />
                          </RadioGroup>
                        </FormControl>
                        </Grid>
                        {state.type === "Customer" && (
                        <Grid item xs={6}>
                          <Autocomplete
                            sx={{ marginTop: "-16px" }}
                            id="customer-dropdown"
                            options={
                              customerList
                                ? customerList.map((item) => ({
                                    id: item._id,
                                    title: item.clientName,
                                  }))
                                : [] // Fallback to empty array if customerList is undefined
                            }
                            getOptionLabel={(option) => option.title || ""}
                            isOptionEqualToValue={(option, value) =>
                              value && value.id ? option.id === value.id : false
                            }
                            value={state.Customer_Name} // Ensure value is not undefined
                            onChange={(e, v, reason) => {
                              if (reason === "clear") {
                                setState({ ...state, Customer_Name: "" });
                              } else {
                                setState({ ...state, Customer_Name: v });
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Customer Name"
                                margin="normal"
                                variant="standard"
                                name="Customer"
                                // error={!!errors.billCustomerID}
                                // helperText={errors.billCustomerID}
                              />
                            )}
                          />
                        </Grid>
                      )}

                      {state.type === "Lead" && (
                        <Grid item xs={6}>
                          <Autocomplete
                            sx={{ marginTop: "-16px" }}
                            id="lead-dropdown"
                            options={leadList || []} // Fallback to empty array if leadList is undefined
                            getOptionLabel={(option) => option.title || ""}
                            value={state.Lead || null} // Ensure value is not undefined
                            onChange={(e, v) => {
                              setState({ ...state, Lead: v ? v : null });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Lead Name"
                                margin="normal"
                                variant="standard"
                                // error={!!errors.leadName}
                                // helperText={errors.leadName}
                              />
                            )}
                          />
                        </Grid>
                      )}
                      </>)} 

                      {/* Conditionally render dropdown based on selected type */}
                     

                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          variant="standard"
                          id="ProjectTitle"
                          name="ProjectTitle"
                          label="Project Title"
                          value={state.Proposal_Title}
                          onChange={(e) => {
                            const regex = /^[a-zA-Z\s]*$/;
                            if (regex.test(e.target.value)) {
                              setState({
                                ...state,
                                Proposal_Title: e.target.value,
                              });
                            }
                          }}
                          // error={!!errors.Status_Name}
                          // helperText={errors.Status_Name}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextField
                          id="date"
                          label="Proposal Date"
                          type="date"
                          variant="standard"
                          value={state.Proposal_Date}
                          onChange={(e) =>
                            setState({ ...state, Proposal_Date: e.target.value })
                          }
                          sx={{ width: 414 }}
                          InputLabelProps={{ shrink: true }}
                          // error={!!errors.Start_Date}
                          // helperText={errors.Start_Date}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextField
                          id="date"
                          label="Valid Until"
                          type="date"
                          variant="standard"
                          value={state.Valid_Until}
                          onChange={(e) =>
                            setState({ ...state, Valid_Until: e.target.value })
                          }
                          sx={{ width: 414 }}
                          InputLabelProps={{ shrink: true }}
                          // error={!!errors.End_Date}
                          // helperText={errors.End_Date}
                          inputProps={{
                            ...(state.Proposal_Date && {
                              min: new Date(
                                new Date(state.Proposal_Date).setDate(
                                  new Date(state.Proposal_Date).getDate() + 1
                                )
                              )
                                .toISOString()
                                .split("T")[0],
                            }),
                          }}
                        />
                      </Grid>
                      
                 {state.isUpdate &&(<> <Grid item xs={6}> 
                 <Autocomplete
                    sx={{
                      marginTop: "-16px",
                    }}
                    id="highlights-demo"
                    options={[
                      { title: "Accepted" },                     
                      { title: "Revised" },
                      { title: "Draft" },
                      { title: "Declined" },
                    ]}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    value={state.proposalStatus} // Ensure value is an object or null
                    onChange={(e, v) => {
                      setState({
                        ...state,
                        proposalStatus: v ? v : null, // Set campaignStatus to the selected object or null
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Proposal Status"
                        margin="normal"
                        variant="standard"
                        // error={!!errors.campaignStatus} // Show error if it exists
                        // helperText={errors.campaignStatus} // Display error message
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
                    options={[
                      { title: "Yes" },                     
                      { title: "No" },
                      
                    ]}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    value={state.proposalViewed} // Ensure value is an object or null
                    onChange={(e, v) => {
                      setState({
                        ...state,
                        proposalViewed: v ? v : null, // Set campaignStatus to the selected object or null
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Proposal View"
                        margin="normal"
                        variant="standard"
                        // error={!!errors.campaignStatus} // Show error if it exists
                        // helperText={errors.campaignStatus} // Display error message
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                <Editor
                    editorState={state.proposalNotes}
                    editorClassName={classes.textEditor}
                    toolbarClassName={classes.toolbarEditor}
                    onEditorStateChange={(editorStateParam) =>
                      setState((prevState) => ({
                        ...prevState,
                        proposalNotes: editorStateParam, // Directly setting the editorState into billNote
                      }))
                    }
                    placeholder="Proposal Notes"
                  />
                      </Grid>

                </>)}
                
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </div>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                setState({
                  Status_Name: "",
                  Description: "",
                  id: "",
                  searchText: "",
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
                  onClick={handleUpdateProposal}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateProposal}
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
        title="Proposal List"
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
        onDelete={handleProposalDelete}
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

export default Proposal;
