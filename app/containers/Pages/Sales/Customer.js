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

function Customer() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    Id: "",
    Company_Name: "",
    Customer_Name: "",
    Phone_Number: "",
    Email: "",
    Lead_Name: "",
    Lead_Id: "",
    Employee_Name: "",
    Employee_Id: "",
    Description:"",
    Billing_Address: "",
    Shipping_Address: "",
    Status: "",   
    isUpdate: false,
    toggle: false,    
  });
  const [errors, setErrors] = useState({
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
    toggle: false,
    
  });
  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.Customer_Name.trim()) {
      errors.Name = "Customer Name is required";
      isValid = false;
    }
    if (!state.Company_Name.trim()) {
        errors.Name = "Name is required";
        isValid = false;
    }

    if (!state.Phone_Number.toString().trim()) {
      errors.Phone_Number = "Phone Number is required";
      isValid = false;
    } else if (state.Phone_Number.toString().length !== 10) {
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

    if (!state.Lead_Name.id) {
      errors.Lead_Name = "Campaign is required";
      isValid = false;
    }

    if (!state.Employee_Name.id) {
      errors.Employee_Name = "Channel is required";
      isValid = false;
    }
    if (!state.Billing_Address.trim()) {
        errors.Billing_Address = "Billing Address is required";
        isValid = false;
    }
    if (!state.Shipping_Address.trim()) {
        errors.Shipping_Address = "Shipping Address is required";
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
      id: "name",
      numeric: false,
      disablePadding: false,
      label: "Customer Name",
    },
    {
      id: "companyname",
      numeric: true,
      disablePadding: false,
      label: "Company Name",
    },
    {
      id: "email",
      numeric: true,
      disablePadding: false,
      label: "Email",
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
  
  const [leadList, setleadList] = React.useState([]);
  const lead_all = async () => {
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
    lead_all();
    fetchCustomer();
  }, []);
 
  function fetchCustomer(pg) {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllCustomers`,
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
              name: item.clientName || "N/A",
              companyname: item.clientCompanyName || "N/A",
              contactNumber: item.clientPhoneNumber || "N/A",
              email: item.clientEmail || "N/A",              
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
                        Customer_Name: item.clientName,
                        Company_Name:item.clientCompanyName,
                        Phone_Number: item.clientPhoneNumber,
                        Email: item.clientEmail,
                        Lead_Name: {
                          id: item.clientFromLeadID?.id,
                          title: item.clientFromLeadID?.leadName,
                        },                      
                        Employee_Name: {
                          id: item.clientCreatorID?.id,
                          title: item.clientCreatorID?.employeeName,
                        },
                        Billing_Address:item.clientBillingAddress,
                        Shipping_Address:item.clientShippingAddress,
                        Description:item.clientDescription,
                        switch:item.clientBillingAddress===item.clientShippingAddress,
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
    fetchCustomer(page);
  }, [page, rowsPerPage]);
  const handleCreateCustomer = async () => {
    if (!validate()) {      
      return;
    }  
    try {
      // Prepare the data to match the required request body format
      const data = {
        clientCompanyName: state.Company_Name,
        clientName: state.Customer_Name,
        clientPhoneNumber: state.Phone_Number,
        clientEmail: state.Email,
        clientFromLeadID: state.Lead_Name.id,
        clientCreatorID: state.Employee_Name.id,

        clientDescription: state.Description,
        clientBillingAddress: state.Billing_Address,
        clientShippingAddress: state.Shipping_Address,
       
      };    
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createCustomer`,
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
        fetchCustomer(page);
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
  console.log(state,"sssssss");
  const handleUpdateLead = async () => { 
    console.log("update")  ;
    if (!validate()) {      
      return;
    }  
    try {
      console.log("update")  ;
      // Prepare the data to match the required request body format
      const data = {
        id:parseInt(itemToDelete),
        clientCompanyName: state.Company_Name,
        clientName: state.Customer_Name,
        clientPhoneNumber: state.Phone_Number,
        clientEmail: state.Email,
        clientFromLeadID: state.Lead_Name.id,
        clientCreatorID: state.Employee_Name.id,

        clientDescription: state.Description,
        clientBillingAddress: state.Billing_Address,
        clientShippingAddress: state.Shipping_Address,
       
      };    
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updateCustomer`,
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
        fetchCustomer(page);
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
        fetchCustomer(page);
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
 const handleClear=()=>{
    setState({
        Company_Name: "",
    Customer_Name: "",
    Phone_Number: "",
    Email: "",
    Lead_Name: "",
    Lead_Id: "",
    Employee_Name: "",
    Employee_Id: "",
   Description:"",
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
      })
      setOpenDialog(false);
 }

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
                <AddIcon /> Add Customer
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
          open={openDialog}
          onClose={handleClear}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Customer</DialogTitle>
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
                  <TextField
                    fullWidth
                    variant="standard"
                    id="Name"
                    name="Name"
                    label="Name"
                    value={state.Customer_Name}
                    onChange={(e) => {
                      const input = e.target.value;
                      const validInput = input.replace(/[^a-zA-Z\s]/g, "");
                      setState({
                        ...state,
                        Customer_Name: validInput,
                      });
                    }}
                    error={!!errors.Customer_Name} // Show error if it exists
                    helperText={errors.Customer_Name} // Display error message
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="CompanyName"
                    name="CompanyName"
                    label="Company Name"
                    value={state.Company_Name}
                    onChange={(e) => {
                      const input = e.target.value;
                      const validInput = input.replace(/[^a-zA-Z\s]/g, "");
                      setState({
                        ...state,
                        Company_Name: validInput,
                      });
                    }}
                    error={!!errors.Company_Name} // Show error if it exists
                    helperText={errors.Company_Name} // Display error message
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
                    options={leadList}
                    getOptionLabel={(option) => option.title || ""} // Safely access title
                    value={state.Lead_Name} // Ensure value is an object or null
                    onChange={(e, v) => {
                      setState({
                        ...state,
                        Lead_Name: v ? v : null, // Set leadName to the selected object or null
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Lead Name"
                        margin="normal"
                        variant="standard"
                        error={!!errors.Lead_Name} // Show error if it exists
                        helperText={errors.Lead_Name} // Display error message
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
                </Grid>
               
                <Grid item xs={6}>
                  <TextField
                    variant="standard"
                    id="BillingAddress"
                    name="BillingAddress"
                    label="Billing Address"
                    fullWidth
                    value={state.Billing_Address}
                    onChange={(e) =>
                      setState({
                        ...state,
                        Billing_Address: e.target.value,
                      })
                    }
                    error={!!errors.Billing_Address} // Show error if it exists
                    helperText={errors.Billing_Address} // Display error message
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="standard"
                    id="ShippingAddress"
                    name="ShippingAddress"
                    label="Shipping Address"
                    fullWidth
                    value={state.Shipping_Address}
                    onChange={(e) =>
                      setState({
                        ...state,
                        Shipping_Address: e.target.value,
                      })
                    }
                    error={!!errors.Shipping_Address} // Show error if it exists
                    helperText={errors.Shipping_Address} // Display error message
                  />
                </Grid>
                <Grid item xs={12}>
                  <Switch
                    id="switch"
                    name="If the Billing address is same as Shipping address"
                    checked={state.switch}
                    onChange={(e) =>{
                        if(!state.switch){
                            setState({ ...state, switch: !state.switch,Shipping_Address:state.Billing_Address })
                        }else{
                      setState({ ...state, switch: !state.switch,Shipping_Address:""});}}
                    }
                  />If the Billing address is same as Shipping address
                </Grid>
                <Grid item xs={12}>
                <TextField
            fullWidth
            multiline
            variant="standard"
            rows={4}
            id="textarea"
            name="textarea"
            label="Description"
            value={state.Description}
            onChange={(e)=>{
                setState({...state,Description:e.target.value});
            }}
          />
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
              <>
                <Button
                  color="primary"
                  variant="contained"
                 onClick={handleUpdateLead}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateCustomer}
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
          title="Customer List"
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

export default Customer;
