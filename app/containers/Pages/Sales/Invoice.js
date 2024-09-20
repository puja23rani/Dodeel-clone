import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
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
import { DesktopDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { convertFromRaw, EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
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
const content = {
  blocks: [
    {
      key: "637gr",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {},
};
function Invoice() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [state, setState] = useState({
    bill_ID: "",
    billCreatorID: "",
    billCustomerID: "",
    billProjectID: "",
    invoiceDate: "",
    billDueDate: "",
    billNote: EditorState.createEmpty(),
    paymentNotes: "",
    _id: "",
    isUpdate: false,
  });
  const [errors, setErrors] = useState({
    bill_ID: "",
    billCreatorID: "",
    billCustomerID: "",
    billProjectID: "",
    invoiceDate: "",
    billDueDate: "",
    billNote: "",
    paymentNotes: "",
  });

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.billCreatorID.id) {
      errors.billCreatorID = "Creator is required";
      isValid = false;
    }

    if (!state.billCustomerID.id) {
      errors.billCustomerID = "Customer is required";
      isValid = false;
    }
    if (!state.billProjectID.id) {
      errors.billProjectID = "Project is required";
      isValid = false;
    }
    if (!state.invoiceDate?.trim()) {
      errors.invoiceDate = "Invoice Date is required";
      isValid = false;
    }
    if (!state.billDueDate?.trim()) {
      errors.billDueDate = "Due Date is required";
      isValid = false;
    }
    if (!state.billNote) {
      errors.billNote = "Note is required";
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };
  const contentBlock = convertFromRaw(content);
  const tempEditorState = EditorState.createWithContent(contentBlock);
  const [dataEditorState, setEditorState] = useState(tempEditorState);

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
      id: "invoiceID",
      numeric: false,
      disablePadding: false,
      label: "Invoice ID",
    },
    {
      id: "creatorName",
      numeric: false,
      disablePadding: false,
      label: "Creator Name",
    },
    {
      id: "customerName",
      numeric: false,
      disablePadding: false,
      label: "Customer Name",
    },
    {
      id: "paymentAmount",
      numeric: false,
      disablePadding: false,
      label: "Payment Amount",
    },
    {
      id: "dueAmount",
      numeric: false,
      disablePadding: false,
      label: "Due Amount",
    },
    {
      id: "projectName",
      numeric: false,
      disablePadding: false,
      label: "Project",
    },
    {
      id: "invoiceDate",
      numeric: false,
      disablePadding: false,
      label: "Invoice Date",
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
      //console.log(actualData, "ressss");
      // Check if actualData.data is an array
      setCustomerList(actualData.data);
    } catch (err) {
      //console.log(err);
    }
  };

  const [projectList, setProjectList] = React.useState([]);
  const project_all = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllProjects`,
        requestOptions
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const actualData = await res.json();
      //console.log(actualData, "ressss");
      // Check if actualData.data is an array
      setProjectList(actualData.data);
    } catch (err) {
      //console.log(err);
    }
  };

  useEffect(() => {
    table3();
    cust_all();
    project_all();
    fetchInvoice(page);
  }, []);

  function fetchInvoice(pg) {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllInvoices`,
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
              invoiceID: item.bill_ID,
              creatorName: item.billCreatorName || "N/A",
              customerName: item.billCustomerName || "N/A",
              paymentAmount: `₹ ${item.billPaidAmount}`,
              dueAmount: `₹ ${item.billDueAmount}`,
              projectName: item.billProjectTitle || "N/A",
              invoiceDate: item.invoiceDate?.slice(0, 10) || "N/A",

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
                        bill_ID: item.bill_ID,
                        billCreatorID: {
                          id: item.billCreatorID,
                          title: item.billCreatorName,
                        },
                        billCustomerID: {
                          id: item.billCustomerID,
                          title: item.billCustomerName,
                        },
                       
                        billProjectID: {
                          id: item.billProjectID,
                          title: item.billProjectTitle,
                        },
                        invoiceDate: item.invoiceDate?.slice(0, 10),
                        billDueDate: item.billDueDate?.slice(0, 10),
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
          setLength(response.data.totalItems);
          setPagination(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  useEffect(() => {
    fetchInvoice(page);
  }, [page, rowsPerPage]);
  const handleCreateInvoice = async () => {
    if (!validate()) {
      return;
    }
    try {
      // Prepare the data to match the required request body format
      const data = {
        billCreatorID: state.billCreatorID.id,
       
        billCustomerID: state.billCustomerID.id,
        
        billProjectID: state.billProjectID.id,
       
        invoiceDate: state.invoiceDate,
        billDueDate: state.billDueDate,

        billNote: JSON.stringify(
          convertToRaw(state.billNote.getCurrentContent())
        ),
      };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createInvoice`,
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
        fetchInvoice(page);
        window.scrollTo({
          top: 400,
          behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
        });
        // Reset the state after successful creation
        setState({
          Id: "",
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
        // setOpenDialog(false);
        // setMessage("Saved successfully!");
        // setOpen(true);
        // setSeverity("success");
        navigate("/app/sales/invoice/invoice-view",{state:{ InvoiceID: result._id },})
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
  //   const handleUpdateLead = async () => {
  //     if (!validate()) {
  //       setMessage("Please fill all required fields");
  //       setOpen(true);
  //       setSeverity("warning");
  //       return;
  //     }
  //     console.log("p1");
  //     try {
  //       // Prepare the data to match the required request body format
  //       const data = {
  //         id: parseInt(itemToDelete),
  //         leadName: state.Name,
  //         email: state.Email,
  //         campaignID: state.Campaign.id, // campaignName from state
  //         channelID: state.Channel.id,
  //         leadStatusID: state.Lead_Status.id,

  //         contactNumber: parseInt(state.Phone_Number),
  //         notes: state.Description,
  //       };
  //       console.log("p2");
  //       const response = await fetch(
  //         `${process.env.REACT_APP_BASE_URL}/api/auth/updateLeadDetail`,
  //         {
  //           method: "PUT",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify(data),
  //         }
  //       );
  //       console.log("p3");
  //       const result = await response.json();
  //       if (result.status === 200) {
  //         fetchLead();
  //         window.scrollTo({
  //           top: 400,
  //           behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
  //         });
  //         // Reset the state after successful creation
  //         setState({
  //           Name: "",
  //           Phone_Number: "",
  //           Email: "",
  //           Campaign: "",
  //           Campaign_Id: "",
  //           Channel: "",
  //           Channel_Id: "",
  //           Lead_Status: "",
  //           Lead_Status_Id: "",
  //           Description: "",

  //           isUpdate: false,
  //         });
  //         setOpenDialog(false);
  //         setMessage("Saved successfully!");
  //         setOpen(true);
  //         setSeverity("success");
  //       } else {
  //         setMessage(result.message);
  //         setOpen(true);
  //         setSeverity("error");
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       setMessage(err.message);
  //       setOpen(true);
  //       setSeverity("error");
  //     }
  //   };
  const handleCustomerDelete = async () => {
    try {
      const data = { id: parseInt(itemToDelete) };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteCustomer`,
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
        fetchInvoice(page);
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
  console.log(state,"ssstate")

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
                <AddIcon /> Add Invoice
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog open={openDialog} onClose={handleClear} fullWidth maxWidth="md">
          <DialogTitle>Invoice</DialogTitle>
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
               
                <Grid item xs={6}>
                  <Autocomplete
                    sx={{
                      marginTop: "-16px",
                    }}
                    id="highlights-demo"
                    options={empList || []}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    isOptionEqualToValue={(option, value) =>
                      value && value.id ? option.id === value.id : false
                    }
                    value={state.billCreatorID}
                    onChange={(e, v, reason) => {
                      if (reason === "clear") {
                        setState({
                          ...state,
                          billCreatorID: "",
                        });
                      } else {
                        // const selectedLeadStatus = MemberList.find(
                        //   (item) => item.personalDetails.employeeName === v
                        // );
                        setState({
                          ...state,
                          billCreatorID: v,
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Creator Name"
                        margin="normal"
                        variant="standard"
                        name="employeeName"
                        error={!!errors.billCreatorID} // Show error if it exists
                        helperText={errors.billCreatorID} // Display error message
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
                    options={
                      customerList.map((item) => {
                        return {
                          id: item._id,
                          title: item.clientName,
                        };
                      }) || []
                    }
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    isOptionEqualToValue={(option, value) =>
                      value && value.id ? option.id === value.id : false
                    }
                    value={state.billCustomerID}
                    onChange={(e, v, reason) => {
                      if (reason === "clear") {
                        setState({
                          ...state,
                          billCustomerID: "",
                        });
                      } else {
                        // const selectedLeadStatus = MemberList.find(
                        //   (item) => item.personalDetails.employeeName === v
                        // );
                        setState({
                          ...state,
                          billCustomerID: v,
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer Name"
                        margin="normal"
                        variant="standard"
                        name="Customer"
                        error={!!errors.billCustomerID} // Show error if it exists
                        helperText={errors.billCustomerID} // Display error message
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
                    options={
                      projectList.map((item) => {
                        return {
                          id: item._id,
                          title: item.projectTitle,
                        };
                      }) || []
                    }
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    isOptionEqualToValue={(option, value) =>
                      value && value.id ? option.id === value.id : false
                    }
                    value={state.billProjectID}
                    onChange={(e, v, reason) => {
                      if (reason === "clear") {
                        setState({
                          ...state,
                          billProjectID: "",
                        });
                      } else {
                        // const selectedLeadStatus = MemberList.find(
                        //   (item) => item.personalDetails.employeeName === v
                        // );
                        setState({
                          ...state,
                          billProjectID: v,
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Project"
                        margin="normal"
                        variant="standard"
                        name="Project"
                        error={!!errors.billProjectID} // Show error if it exists
                        helperText={errors.billProjectID} // Display error message
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="date"
                    label="Invoice Date"
                    type="date"
                    variant="standard"
                    value={state.invoiceDate}
                    onChange={(e) =>
                      setState({
                        ...state,
                        invoiceDate: e.target.value,
                      })
                    }
                    sx={{ width: 414 }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.invoiceDate} // Show error if it exists
                    helperText={errors.invoiceDate} // Display error message
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="date"
                    label="Due Date"
                    type="date"
                    variant="standard"
                    value={state.billDueDate}
                    onChange={(e) =>
                      setState({
                        ...state,
                        billDueDate: e.target.value,
                      })
                    }
                    sx={{ width: 414 }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.billDueDate} // Show error if it exists
                    helperText={errors.billDueDate} // Display error message
                  />
                </Grid>
                <Grid item xs={12}>
                  <Editor
                    editorState={state.billNote}
                    editorClassName={classes.textEditor}
                    toolbarClassName={classes.toolbarEditor}
                    onEditorStateChange={(editorStateParam) =>
                      setState((prevState) => ({
                        ...prevState,
                        billNote: editorStateParam, // Directly setting the editorState into billNote
                      }))
                    }
                    placeholder="Bill Notes"
                  />
                </Grid>
               
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
                  onClick={handleCreateInvoice}
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
          title="Invoice List"
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
        onDelete={handleCustomerDelete}
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

export default Invoice;
