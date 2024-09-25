import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";

import axios from "axios";
import { PapperBlock } from "enl-components";

import { toast } from "react-toastify";
import TablePlayground from "../../Tables/TablePlayground";
import Popup from "../../../components/Popup/Popup";
import AlertDialog from "../../UiElements/demos/DialogModal/AlertDialog";
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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { convertFromRaw, EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { format } from "date-fns";
import { set } from "lodash";
import { tr } from "date-fns/locale";
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

function Payments() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");

  const [state, setState] = useState({
    Status_Name: "",
    Description: "",
    searchText: "",
    isUpdate: false,
  });
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
  const [rowdata, setRowdata] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openPaymentPopup, setOpenPaymentPopup] = useState(false);
  const [showPaymentNote, setShowPaymentNote] = useState(false);
  const [pagination, setPagination] = useState(false);
  const [length, setLength] = useState(0);
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
      id: "paymentTransactionId",
      numeric: false,
      disablePadding: false,
      label: "Payment Transaction ID",
    },
    {
      id: "creatorName",
      numeric: false,
      disablePadding: false,
      label: "Creator Name",
    },
    {
      id: "clientName",
      numeric: false,
      disablePadding: false,
      label: "Client Name",
    },
    {
      id: "paymentAmount",
      numeric: false,
      disablePadding: false,
      label: "Payment Amount",
    },
    {
      id: "paymentDate",
      numeric: false,
      disablePadding: false,
      label: "Payment Date",
    },
    {
      id: "projectTitle",
      numeric: false,
      disablePadding: false,
      label: "Project Title",
    },
    {
      id: "paymentMode",
      numeric: false,
      disablePadding: false,
      label: "Payment Mode",
    },

    { id: "actions", label: "Action" },
  ];
  const [AllINVList, setAllINVList] = React.useState([]);
  const table1 = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }

      const requestOptions = {
        method: "GET",
        headers: loginHeaders,
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllInvoices`,
        requestOptions
      );
      const actualData = await res.json();
      setAllINVList(actualData.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    table1();
    fetchLeadStatus();
  }, []);
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/deletePayment`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status == 200) {
       setMessage("Deleted successfully");
       setOpen(true);
       setSeverity("success");
        fetchPayment(page);
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
      toast.error("An error occurred. Please try again.");
    }
  };
  function fetchPayment(pg) {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllPayments`,
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
        console.log(response.data.payments,"payyyyy");
        if (response.data.payments) {
          setRowdata(
            response.data.payments.map((item, index) => ({
              slNo: response.data.payments.indexOf(item) + 1,
              id: item._id,
              invoiceID: item.paymentInvoiceID?.bill_ID || "N/A",
              paymentTransactionId: item.paymentTransactionID || "N/A",
              creatorName:item.paymentCreatorID?.employeeName || "N/A",
              clientName:item?.paymentClientID?.customerName || "N/A",
              paymentAmount: item.paymentAmount || "N/A",
              paymentDate: item.paymentDate.slice(0,10) || "",
              projectTitle: item.paymentProjectID?.projectTitle || "N/A",
              paymentMode: item.paymentMode || "N/A",
             
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
                     paysetState({
                      invoiceID:{title:item.paymentInvoiceID?.bill_ID,id:item._id} ,
                      paymentCreatorName: item.paymentCreatorID?.employeeName,
                      clientName: item.paymentClientID?.customerName,
                      projectTitle: item.paymentProjectID?.projectTitle,
                      paymentDate: item.paymentDate.slice(0,10),
                      paymentAmount: item.paymentAmount,
                      paymentTransactionID: item.paymentTransactionID,
                     
                      paymentMode: {title:item.paymentMode},
                      
                      paymentNotes: EditorState.createWithContent(
                        convertFromRaw(JSON.parse(item.paymentNotes))
                      ),
                      id: item._id,
                      isUpdate: true,
                    });
                      //   Customer_Name: item.clientName,
                      //   Company_Name: item.clientCompanyName,
                      //   Phone_Number: item.clientPhoneNumber,
                      //   Email: item.clientEmail,
                      //   Lead_Name: {
                      //     id: item.clientFromLeadID?.id,
                      //     title: item.clientFromLeadID?.leadName,
                      //   },
                      //   Employee_Name: {
                      //     id: item.clientCreatorID?.id,
                      //     title: item.clientCreatorID?.employeeName,
                      //   },
                      //   Billing_Address: item.clientBillingAddress,
                      //   Shipping_Address: item.clientShippingAddress,
                      //   Description: item.clientDescription,
                      //   switch:
                      //     item.clientBillingAddress ===
                      //     item.clientShippingAddress,
                      //   isUpdate: true,
                      // });
                      setOpenPaymentPopup(true);
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
    fetchPayment(page);
  }, [page, rowsPerPage]);
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

  const handleUpdate = async () => {
    // if (!validateFields()) return;
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }
      const formatDate = (date) => {
        if (!date) return ""; // Handle empty or undefined date
        return format(new Date(date), "MM-dd-yyyy");
      };
      const data = {
        id: parseInt(itemToDelete),
        paymentDate: formatDate(paystate.paymentDate),
        paymentInvoiceID: paystate.invoiceID.title,
        paymentAmount: parseInt(paystate.paymentAmount),
        paymentTransactionID: paystate.paymentTransactionID,
        paymentMode: paystate.paymentMode.title,
        paymentNotes: JSON.stringify(
          convertToRaw(paystate.paymentNotes.getCurrentContent())
        ),
      };

      const requestOptions = {
        method: "PUT",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updatePayment`,
        requestOptions
      );
      const actualData = await res.json();
      console.log(actualData);

      if (actualData.status === 200) {
        setMessage("Updated successfully");
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
        fetchPayment(page);
      }else{
        setMessage(actualData.message);
        setSeverity("warning");
        setOpen(true);
      }
    } catch (err) {
      setMessage(err.message);
      setSeverity("error");
      setOpen(true);
      console.log(err);
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
  const handleCreatePay = async (id) => {
    console.log(paystate,"paaaaaaaayy");
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
        paymentInvoiceID: paystate.invoiceID.title,
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
        fetchPayment(page);
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
  const handlePaymentPopupClose = () => {
    paysetState({
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
  console.log("state", paystate);
  return (
    <>
      <div>
        <Toolbar className={classes.toolbar}>
          <div className={classes.spacer} style={{ flexGrow: 1 }} />
          <div className={classes.actions}>
            <Tooltip title="Add Item">
              <Button
                variant="contained"
                onClick={() => setOpenPaymentPopup(true)}
                color="primary"
                className={classes.button}
              >
                <AddIcon /> Add Payment
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
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
                  <Autocomplete
                    sx={{
                      marginTop: "-16px",
                    }}
                    id="highlights-demo"
                    options={AllINVList.map((item) => {
                      return {
                        id: item._id,
                        title: item.bill_ID,
                        paymentCreatorName: item.billCreatorName,
                        clientName: item.billCustomerName,
                        projectTitle: item.billProjectTitle,
                      };
                    })}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    value={paystate.invoiceID} // Ensure value is an object or null
                    onChange={(e, v) => {
                      paysetState({
                        ...paystate,
                        invoiceID: v ? v : null, // Set campaignStatus to the selected object or null
                        paymentCreatorName: v?.paymentCreatorName || "",
                        clientName: v?.clientName || "",
                        projectTitle: v?.projectTitle || "",
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Invoice Id"
                        margin="normal"
                        variant="standard"
                        // error={!!errors.campaignStatus} // Show error if it exists
                        // helperText={errors.campaignStatus} // Display error message
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="PaymentCreatorName"
                    name="PaymentCreatorName"
                    label="Payment Creator Name"
                    value={paystate.paymentCreatorName}
                    InputProps={{ readOnly: true }}
                    // error={!!errors.ApproxBudget}
                    // helperText={errors.ApproxBudget}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="ClientName"
                    name="ClientName"
                    label="Client Name"
                    value={paystate.clientName}
                    InputProps={{ readOnly: true }}
                    // error={!!errors.ApproxBudget}
                    // helperText={errors.ApproxBudget}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="ProjectTitle"
                    name="ProjectTitle"
                    label="Project Title"
                    value={paystate.projectTitle}
                    InputProps={{ readOnly: true }}
                    // error={!!errors.ApproxBudget}
                    // helperText={errors.ApproxBudget}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="date"
                    label="Payment Date"
                    type="date"
                    variant="standard"
                    value={paystate.paymentDate}
                    onChange={(e) =>
                      paysetState({ ...paystate, paymentDate: e.target.value })
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    // error={!!errors.billDueDate} // Show error if it exists
                    // helperText={errors.billDueDate} // Display error message
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
                      // Remove any non-digit characters
                      const numericValue = value.replace(/[^0-9]/g, "");
                      paysetState({ ...paystate, paymentAmount: numericValue });
                    }}
                    // error={!!errors.ApproxBudget}
                    // helperText={errors.ApproxBudget}
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
                      paysetState((prevState) => ({
                        ...prevState,
                        paymentTransactionID: e.target.value,
                      }))
                    }
                    fullWidth
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
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    value={paystate.paymentMode} // Ensure value is an object or null
                    onChange={(e, v) => {
                      paysetState({
                        ...paystate,
                        paymentMode: v ? v : null, // Set campaignStatus to the selected object or null
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Payment Mode"
                        margin="normal"
                        variant="standard"
                        // error={!!errors.campaignStatus} // Show error if it exists
                        // helperText={errors.campaignStatus} // Display error message
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
                          paysetState({
                            ...paystate,
                            paymentNotes: editorStateParam, // Directly setting the editorState into billNote
                          })
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
              Cancel
            </Button>
           {paystate.isUpdate?(<><Button
              onClick={handleUpdate}
              color="primary"
            >
              Update
            </Button></>):(<><Button
              onClick={handleCreatePay}
              color="primary"
            >
              Save
            </Button></>)} 
          </DialogActions>
        </Dialog>
      </div>

      {rowdata && (
        <TablePlayground
        title="Payment List"
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

export default Payments;
