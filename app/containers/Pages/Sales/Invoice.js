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
  FormControlLabel,
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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useNavigate } from "react-router-dom";
import { DesktopDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { convertFromRaw, EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { format } from "date-fns";
import { set } from "lodash";
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
  

  const [rowdata, setRowdata] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [length, setLength] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [invoiceID, setinvoiceID] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [pagination, setPagination] = useState(false);
  const [openPaymentPopup, setOpenPaymentPopup] = useState(false);
  const [showPaymentNote, setShowPaymentNote] = useState(false);
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
  const [payerrors, setPayErrors] = useState({
    paymentDate: "",
    paymentAmount: "",
    paymentTransactionID: "",
    paymentInvoiceID: "",
    paymentMode: "",
    value: "",
    paymentNotes: "",
  });
  const payvalidate = () => {
    let isValid = true;
    let errors = {};

    if (!paystate.paymentDate) {
      errors.paymentDate = "Payment Date is required";
      isValid = false;
    }

    if (!paystate.paymentAmount) {
      errors.paymentAmount = "Payment Amount is required";
      isValid = false;
    } else if (
      isNaN(paystate.paymentAmount) ||
      Number(paystate.paymentAmount) <= 0
    ) {
      errors.paymentAmount = "Payment Amount must be a valid positive number";
      isValid = false;
    }

    if (!paystate.paymentTransactionID.trim()) {
      errors.paymentTransactionID = "Transaction ID is required";
      isValid = false;
    }

    if (!paystate.paymentMode || !paystate.paymentMode.title) {
      errors.paymentMode = "Payment Mode is required";
      isValid = false;
    }

    // Payment Notes is optional, no validation needed for it

    setPayErrors(errors);
    return isValid;
  };
 
  const [paystate, paysetState] = useState({
    invoiceID: "",
    paymentCreatorName: "",
    clientName: "",
    projectTitle: "",
    paymentDate: "",
    paymentAmount: "",
    paymentTransactionID: "",
    paymentInvoiceID: "",
    paymentMode: "",
    value: "",
    paymentNotes: EditorState.createEmpty(),
    id: null,
    isUpdate: false,
  });
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
 

  const handlePaymentPopupClose = () => {
    handleClearPayPop();
    setState({
      paymentDate: "",
      paymentAmount: "",
      paymentTransactionID: "",
      paymentInvoiceID: "",
      paymentMode: "",
      value: "",
      paymentNotes: EditorState.createEmpty(),
      id: null,
      isUpdate: false,
    });
    setOpenPaymentPopup(false);
  };

  useEffect(() => {
    
    cust_all();
    project_all();
    
  }, []);
useEffect(() => {
  fetchInvoice(page);
},[page,rowsPerPage])
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
                      // setItemToDelete(item._id);
                      navigate("/app/sales/invoice/invoice-update", {
                        state: { InvoiceID: item._id },
                      });
                      // setOpenDialog(true);
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
                      navigate("/app/sales/invoice/invoice-view", {
                        state: { InvoiceID: item._id },
                      });
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                
                    <IconButton
                      aria-label="Payment"
                      // onClick={() => {
                      //   setItemToDelete(item._id);
                      //   setDeleteDialogOpen(true);
                      // }}
                      onClick={(e) => {
                        // navigate("/app/sales/invoice/invoice-view", {
                        //   state: { InvoiceID: item._id },
                        // });
                        setinvoiceID(item.bill_ID);
                        setOpenPaymentPopup(true);
                      }}
                    >
                      <AttachMoneyIcon />
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
        // setMessage("Created Sucessfully!");
        // setOpen(true);
        // setSeverity("success");
        navigate("/app/sales/invoice/invoice-update", {
          state: { InvoiceID: result._id },
        });
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

  const handleDelete = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }
      const data = { id: parseInt(itemToDelete) };
      const requestOptions = {
        method: "DELETE",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteInvoice`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status == 200) {
       setMessage("Deleted successfully!");
       setOpen(true);
       setSeverity("success");
        fetchInvoice(page);
      } else {
        setMessage(actualData.message);
        setOpen(true);
        setSeverity("error");
      }
    } catch (err) {
      setMessage(err.message);
      setOpen(true);
      setSeverity("error");
      console.log(err);
      
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
    setErrors({
      bill_ID: "",
      billCreatorID: "",
      billCustomerID: "",
      billProjectID: "",
      invoiceDate: "",
      billDueDate: "",
      billNote: "",
      paymentNotes: "",
    });
    setOpenDialog(false);
  };
  const handleClearPayPop = () => {
paysetState({
      invoiceID: "",
      paymentCreatorName: "",
      clientName: "",
      projectTitle: "",
      paymentDate: "",
      paymentAmount: "",
      paymentTransactionID: "",
      paymentInvoiceID: "",
      paymentMode: "",
      value: "",
      paymentNotes: EditorState.createEmpty(),
      id: null,
      isUpdate: false,
    });
    setPayErrors({
      paymentDate: "",
      paymentAmount: "",
      paymentTransactionID: "",
      paymentInvoiceID: "",
      paymentMode: "",
      value: "",
      paymentNotes: "",
    })
    setOpenDialog(false);
  };
  console.log(state, "ssstate");
  const handleCreatePay = async (id) => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }

      // Function to format date to mm-dd-yyyy
      const formatDate = (date) => {
        if (!date) return ""; // Handle empty or undefined date
        return format(new Date(date), "MM-dd-yyyy");
      };

      const data = {
        paymentDate: formatDate(paystate.paymentDate),
        paymentInvoiceID: invoiceID,
        paymentAmount: parseInt(paystate.paymentAmount),
        paymentTransactionID: paystate.paymentTransactionID,
        paymentMode: paystate.paymentMode.title,
        paymentNotes: JSON.stringify(
          convertToRaw(paystate.paymentNotes.getCurrentContent())
        ),
      };

      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };

      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createPayment`,
        requestOptions
      );
      const actualData = await res.json();

      if (actualData.status === 200) {
        setMessage("Payment created successfully");
        setSeverity("success");
        setOpen(true);
        paysetState((prevState) => ({
          ...prevState,
          paymentDate: "",
          paymentAmount: "",
          paymentInvoiceID: "",
          paymentTransactionID: "",
          paymentMode: "",
          paymentNotes: EditorState.createEmpty(),
          isUpdate: false,
        }));
        handlePaymentPopupClose();
        fetchInvoice(page);
      }else{
        handlePaymentPopupClose();
        setMessage(actualData.message);
        setSeverity("error");
        setOpen(true);
      }
    } catch (err) {
      handlePaymentPopupClose();
      setMessage(err.message);
      setSeverity("error");
      setOpen(true);
      console.log(err);
    }
  };
  const formatDate = (date) => {
    if (!date) return ""; // Handle empty or undefined date
    return format(new Date(date), "MM-dd-yyyy");
  };
  console.log(formatDate(paystate.paymentDate), "pay");
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
                {/* <Grid item xs={6}>
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
                </Grid> */}
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
                    inputProps={{
                      ...(state.invoiceDate && {
                        min: new Date(
                          new Date(state.invoiceDate).setDate(
                            new Date(state.invoiceDate).getDate() + 1
                          )
                        )
                          .toISOString()
                          .split("T")[0], // Adding one day to invoiceDate if it's not empty
                      }),
                    }}
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
        {/* payment dialog */}
        <Dialog open={openPaymentPopup} onClose={handlePaymentPopupClose}>
          <DialogTitle>Add Payment</DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handlePaymentPopupClose}
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
                    id="date"
                    label="Payment Date"
                    type="date"
                    variant="standard"
                    value={paystate.paymentDate}
                    onChange={(e) =>
                      paysetState({
                        ...paystate,
                        paymentDate: e.target.value,
                      })
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!payerrors.paymentDate}
                    helperText={payerrors.paymentDate}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="PaymentAmount"
                    name="PaymentAmount"
                    label="Payment Amount"
                    value={paystate.paymentAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numericValue = value.replace(/[^0-9]/g, "");
                      paysetState({ ...paystate, paymentAmount: numericValue });
                    }}
                    error={!!payerrors.paymentAmount}
                    helperText={payerrors.paymentAmount}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    variant="standard"
                    id="Transaction"
                    name="Transaction"
                    label="Transaction ID"
                    value={paystate.paymentTransactionID}
                    onChange={(e) =>
                      paysetState({
                        ...paystate,
                        paymentTransactionID: e.target.value,
                      })
                    }
                    fullWidth
                    error={!!payerrors.paymentTransactionID}
                    helperText={payerrors.paymentTransactionID}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Autocomplete
                    sx={{
                      marginTop: "-16px",
                    }}
                    id="highlights-demo"
                    options={[
                      { title: "Online" },
                      { title: "Cash" },
                      { title: "Bank Transfer" },
                    ]}
                    getOptionLabel={(option) => option.title || ""}
                    value={paystate.paymentMode}
                    onChange={(e, v) => {
                      paysetState({
                        ...paystate,
                        paymentMode: v ? v : null,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Payment Mode"
                        margin="normal"
                        variant="standard"
                        error={!!payerrors.paymentMode}
                        helperText={payerrors.paymentMode}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showPaymentNote}
                        onChange={() => setShowPaymentNote((prev) => !prev)}
                      />
                    }
                    label="Add Payment Note"
                  />
                </Grid>

                {showPaymentNote && (
                  <Grid item xs={12}>
                    <div
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "4px",
                        minHeight: "100px",
                      }}
                    >
                      <Editor
                        editorState={paystate.paymentNotes}
                        editorClassName={classes.textEditor}
                        toolbarClassName={classes.toolbarEditor}
                        onEditorStateChange={(editorStateParam) =>
                          paysetState((prevState) => ({
                            ...prevState,
                            paymentNotes: editorStateParam,
                          }))
                        }
                        placeholder="Enter payment notes..."
                      />
                    </div>
                  </Grid>
                )}
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePaymentPopupClose} color="primary">
              Close
            </Button>
           
            <Button
              onClick={() => {
                if (payvalidate()) {
                  handleCreatePay();
                }
              }}
              color="primary"
                  variant="contained"
            >
              Save
            </Button>
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
        onDelete={handleDelete}
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
