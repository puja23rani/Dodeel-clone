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
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import DeleteIcons from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useNavigate } from "react-router-dom";
import Popup from "../../../../components/Popup/Popup";
import AlertDialog from "../../../UiElements/demos/DialogModal/AlertDialog";
import TablePlayground from "../../../Tables/TablePlayground";

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

function WarehouseStock() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    wareHouseID: "",
    warehouseName: "",
    supplierName: "",
    categoryName: "",
    productName: "",
    supplierID: "",
    categoryID: "",
    productID: "",
    pricePerUnit: "",
    quantity: "",
    isUpdate: false,
  });
  const [errors, setErrors] = useState({
    warehouseName: "",
    supplierName: "",
    categoryName: "",
    productName: "",
    pricePerUnit: "",
    quantity: "",
  });
  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.warehouseName.trim()) {
      errors.warehouseName = "Warehouse Name is required";
      isValid = false;
    }
    if (!state.supplierName.trim()) {
      errors.supplierName = "Supplier Name is required";
      isValid = false;
    }
    if (!String(state.categoryName).trim()) {
      errors.categoryName = "Category Name is required.";
      isValid = false;
    }
    if (!String(state.productName).trim()) {
      errors.productName = "Product Name is required";
      isValid = false;
    }
    if (!String(state.pricePerUnit).trim()) {
      errors.pricePerUnit = "longitude is required";
      isValid = false;
    }
    if (!String(state.quantity).trim()) {
      errors.quantity = "Quantity is required";
      isValid = false;
    }
    

    // if (!state.Campaign.id) {
    //   errors.Campaign = "Campaign is required";
    //   isValid = false;
    // }

    // if (!state.Channel.id) {
    //   errors.Channel = "Channel is required";
    //   isValid = false;
    // }

    // if (!state.Lead_Status.id) {
    //   errors.Lead_Status = "Lead Status is required";
    //   isValid = false;
    // }

    // if (!state.Description.trim()) {
    //   errors.Description = "Description is required";
    //   isValid = false;
    // }
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
  const location = useLocation();
  const [isUpdate, setisUpdate] = useState(true);
  const [isPrice, setisPrice] = useState(false);
  const [isQty, setisQty] = useState(false);
  const { warehouseID } = location.state || {};

  const columnData = [
    {
      id: "slNo",
      numeric: true,
      disablePadding: false,
      label: "Sl No",
    },
    {
      id: "productName",
      numeric: false,
      disablePadding: false,
      label: "Product Name",
    },
    {
      id: "quantity",
      numeric: true,
      disablePadding: false,
      label: "Quantity",
    },
    {
      id: "pricePerUnit",
      numeric: true,
      disablePadding: false,
      label: "Price",
    },
   
    { id: "actions", label: "Action" },
  ];
  const [CategoryList, setCategoryList] = React.useState([]);
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllProductCategories`,
        requestOptions
      );
      const actualData = await res.json();
      if (Array.isArray(actualData.categories)) {
        const newobj = actualData.employees.map((item) => ({
          title: item.personalDetails.employeeName, // Set the title from channelName
          id: item._id, // Set the id from _id
        }));
        setCategoryList(actualData.categories);
      }
    } catch (err) {
      //console.log(err);
    }
  };
  const [SupplierList, setSupplierList] = React.useState([]);
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllSuppliers`,
        requestOptions
      );
      const actualData = await res.json();
      if (Array.isArray(actualData.suppliers)) {
        const newobj = actualData.employees.map((item) => ({
          title: item.personalDetails.employeeName, // Set the title from channelName
          id: item._id, // Set the id from _id
        }));
        setSupplierList(actualData.suppliers);
      }
    } catch (err) {
      //console.log(err);
    }
  };
  const [ProductList, setProductList] = React.useState([]);
  const table5 = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllProducts`,
        requestOptions
      );
      const actualData = await res.json();
      if (Array.isArray(actualData.productDetails)) {
        const newobj = actualData.employees.map((item) => ({
          title: item.personalDetails.employeeName, // Set the title from channelName
          id: item._id, // Set the id from _id
        }));
        setSupplierList(actualData.productDetails);
      }
    } catch (err) {
      //console.log(err);
    }
  };

  useEffect(() => {
    table3();
    table4();
    table5();
  }, []);
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [selectedEmployee, setSelectedEmployee] = React.useState(null);

//   const handleMenuClick = (event, employee) => {
//     setAnchorEl(event.currentTarget); // Set the clicked button as the anchor
//     setSelectedEmployee(employee); // Set the selected employee
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null); // Reset anchorEl to null to close the menu
//     setSelectedEmployee(null); // Reset selected employee
//   };
  console.log(state, "stateware");
  function fetchWHstock(pg) {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllStockByWarehouse`,
        {
            warehouseID: warehouseID._id
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
              productName: item.productID.productName || "N/A",
              quantity: item.quantity || "N/A",
              pricePerUnit: item.pricePerUnit || "N/A",
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
                        wareHouseID: warehouseID._id,
                        // wareHouseID: item.wareHouseID,
                        warehouseName: item.warehouseName,
                        supplierName: item.supplierName,
                        categoryName: item.categoryName,
                        productName: item.productName,
                        pricePerUnit: item.pricePerUnit,
                        quantity: item.quantity,
                        productName: {
                          id: item.productID?.id,
                          title: item.productName,
                        },
                        categoryName: {
                          id: item.categoryID?.id,
                          title: item.categoryName,
                        },
                        supplierName: {
                          id: item.supplierID?.id,
                          title: item.supplierID?.supplierName,
                        },
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
        //   setLength(response.data.totalWarehouses);
          setPagination(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  useEffect(() => {
    fetchWHstock(page);
  }, [page, rowsPerPage]);
  const handleCreateWHstocks = async () => {
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
        wareHouseID: warehouseID._id,
        warehouseName: warehouseID.warehouseName,
        pricePerUnit:parseInt( state.pricePerUnit),
        quantity:parseInt( state.quantity),
        productID: state.productName.id,
        productName: state.productName.title,
        categoryID: state.categoryName.id,
        categoryName: state.categoryName.title,
        supplierID: state.supplierID.id,
        supplierName: state.supplierName.title,
      };
      console.log("p2");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createWarehouseStock`,
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
        fetchWHstock();
        window.scrollTo({
          top: 400,
          behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
        });
        // Reset the state after successful creation
        setState({
            wareHouseID: "",
            warehouseName: "",
            supplierName: "",
            categoryName: "",
            productName: "",
            supplierID: "",
            categoryID: "",
            productID: "",
            pricePerUnit: "",
            quantity: "",
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
  const handleUpdateWHstocks = async () => {
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
        id: parseInt(itemToDelete),
        wareHouseID: warehouseID._id,
        warehouseName: warehouseID.warehouseName,
        pricePerUnit:parseInt( state.pricePerUnit),
        quantity:parseInt( state.quantity),
        productID: state.productName.id,
        productName: state.productName.title,
        categoryID: state.categoryName.id,
        categoryName: state.categoryName.title,
        supplierID: state.supplierID.id,
        supplierName: state.supplierName.title,
      };
      console.log("p2");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updateWarehouse`,
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
        fetchWHstock();
        window.scrollTo({
          top: 400,
          behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
        });
        // Reset the state after successful creation
        setState({
            wareHouseID: "",
            warehouseName: "",
            supplierName: "",
            categoryName: "",
            productName: "",
            supplierID: "",
            categoryID: "",
            productID: "",
            pricePerUnit: "",
            quantity: "",
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
  const handleWHstockDelete = async () => {
    try {
      const data = { id: parseInt(itemToDelete) };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteWarehouseStock`,
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
        fetchWHstock();
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
                <AddIcon /> Add Warehouse
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
          open={openDialog}
          onClose={() => {
            setState({
              warehouseName: "",
              warehouseCode: "",
              address: "",
              latitude: "",
              longitude: "",
              accountSupervisorName: "",
              accountSupervisor: "",
              dispatchSupervisorName: "",
              dispatchSupervisor: "",
              inductionDate: "",
              isUpdate: false,
            });
            setOpenDialog(false);
          }}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Warehouse</DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {
              setState({
                warehouseName: "",
                warehouseCode: "",
                address: "",
                latitude: "",
                longitude: "",
                accountSupervisorName: "",
                accountSupervisor: "",
                dispatchSupervisorName: "",
                dispatchSupervisor: "",
                inductionDate: "",
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
          <DialogContent className={classes.dialogContent}>
            <div className={classes.form}>
              <Grid container spacing={2}>
                <Grid item xs={6} sx={{ marginTop: "12px" }}>
                  <TextField
                    label="Warehouse Name"
                    fullWidth
                    value={warehouseID.warehouseName}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                {/* Supplier */}
                <Grid item xs={5} sx={{ marginTop: "12px" }}>
                  {isPrice || isQty ? (
                    // When readOnly, render a disabled input or static text with validation
                    <TextField
                      label="Supplier Name"
                      value={state.supplierName}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      error={!!errors.supplierName} // Show error if it exists
                      helperText={errors.supplierName} // Display error message
                    />
                  ) : (
                    <Autocomplete
                      id="supplier-autocomplete"
                      options={SupplierList.map((item) => {
                        return {
                          id: item._id,
                          title: item.supplierName,
                        };
                      })}
                      getOptionLabel={(option) => option.title || ""} // Safely access title
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      value={{
                        id: state.supplierID,
                        title: state.supplierName,
                      }}
                      onChange={(e, v, reason) => {
                        if (reason === "clear") {
                          setState({
                            ...state,
                            supplierName: "",
                            supplierID: "",
                          });
                        } else {
                          const selectedSupp = SupplierList.find(
                            (item) => item.supplierName === v?.title
                          );
                          setState({
                            ...state,
                            supplierName: v?.title || "",
                            supplierID: selectedSupp ? selectedSupp._id : null,
                          });
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          fullWidth
                          label="Supplier Name"
                          error={!!errors.supplierName} // Show error if it exists
                          helperText={errors.supplierName} // Display error message
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li
                          {...props}
                          style={{
                            backgroundColor: selected ? "#2f2f30" : "inherit",
                            color: selected ? "white" : "inherit",
                          }}
                        >
                          {option.title}
                        </li>
                      )}
                    />
                  )}
                </Grid>

                {/* category */}
                <Grid item xs={5} sx={{ marginTop: "12px" }}>
                  {isPrice || isQty ? (
                    // When readOnly, render a disabled input or static text with validation
                    <TextField
                      label="Category Name"
                      value={state.categoryName}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      error={!!errors.categoryName} // Show error if it exists
                      helperText={errors.categoryName} // Display error message
                    />
                  ) : (
                    <Autocomplete
                      id="category-autocomplete"
                      options={CategoryList.map((item) => {
                        return {
                          id: item._id,
                          title: item.categoryName,
                        };
                      })}
                      getOptionLabel={(option) => option.title || ""} // Safely access title
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      value={{
                        id: state.categoryID,
                        title: state.categoryName,
                      }}
                      onChange={(e, v, reason) => {
                        if (reason === "clear") {
                          setState({
                            ...state,
                            categoryName: "",
                            categoryID: "",
                          });
                        } else {
                          const selectedCat = CategoryList.find(
                            (item) => item.categoryName === v?.title
                          );
                          setState({
                            ...state,
                            categoryName: v?.title || "",
                            categoryID: selectedCat ? selectedCat._id : null,
                          });
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          fullWidth
                          label="Category Name"
                          error={!!errors.categoryName} // Show error if it exists
                          helperText={errors.categoryName} // Display error message
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li
                          {...props}
                          style={{
                            backgroundColor: selected ? "#2f2f30" : "inherit",
                            color: selected ? "white" : "inherit",
                          }}
                        >
                          {option.title}
                        </li>
                      )}
                    />
                  )}
                </Grid>

                {/* product */}
                <Grid item xs={5} sx={{ marginTop: "12px" }}>
                  {isPrice || isQty ? (
                    // When readOnly, render a disabled input or static text with validation
                    <TextField
                      label="Product Name"
                      value={state.productName}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      error={!!errors.productName} // Show error if it exists
                      helperText={errors.productName} // Display error message
                    />
                  ) : (
                    <Autocomplete
                      id="product-autocomplete"
                      options={ProductList?.filter(
                        (item) =>
                          item.supplierID === state.supplierID &&
                          item.categoryID === state.categoryID
                      ).map((item) => {
                        return {
                          id: item._id,
                          title: item.productName,
                        };
                      })}
                      getOptionLabel={(option) => option.title || ""} // Safely access title
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      value={{
                        id: state.productID,
                        title: state.productName,
                      }}
                      onChange={(e, v) => {
                        const selectedPrdcts = ProductList.find(
                          (item) =>
                            item.productName === v?.title &&
                            item.supplierID === state.supplierID &&
                            item.categoryID === state.categoryID
                        );
                        setState({
                          ...state,
                          productName: v?.title || "",
                          productID: selectedPrdcts?._id || null,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          fullWidth
                          label="Product Name"
                          error={!!errors.productName} // Show error if it exists
                          helperText={errors.productName} // Display error message
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li
                          {...props}
                          style={{
                            backgroundColor: selected ? "#2f2f30" : "inherit",
                            color: selected ? "white" : "inherit",
                          }}
                        >
                          {option.title}
                        </li>
                      )}
                    />
                  )}
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    sx={{
                      marginBottom: 2,
                    }}
                    variant="standard"
                    id="quantity"
                    name="quantity"
                    label="Quantity"
                    value={state.quantity}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Allow only numbers and one decimal point
                      const regex = /^[0-9]*\.?[0-9]*$/;
                      const maxLength = 15; // Limit to 15 characters, including the decimal point

                      if (regex.test(value) && value.length <= maxLength) {
                        setState({ ...state, quantity: value });
                      }
                    }}
                    error={!!errors.quantity} // Show error if it exists
                    helperText={errors.quantity} // Display error message
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    sx={{
                      marginBottom: 2,
                    }}
                    variant="standard"
                    id="pricePerUnit"
                    name="pricePerUnit"
                    label="Price"
                    value={state.pricePerUnit}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Allow only numbers and one decimal point
                      const regex = /^[0-9]*\.?[0-9]*$/;
                      const maxLength = 15; // Limit to 15 characters, including the decimal point

                      if (regex.test(value) && value.length <= maxLength) {
                        setState({ ...state, pricePerUnit: value });
                      }
                    }}
                    error={!!errors.pricePerUnit} // Show error if it exists
                    helperText={errors.pricePerUnit} // Display error message
                  />
                </Grid>

                <Grid item xs={6} sx={{ width: "100%" }}>
                  <TextField
                    id="date"
                    label="Induction Date"
                    type="date"
                    variant="standard"
                    defaultValue={state.inductionDate}
                    sx={{ width: "100%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) =>
                      setState({ ...state, inductionDate: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setState({
                  wareHouseID: "",
                  warehouseName: "",
                  supplierName: "",
                  categoryName: "",
                  productName: "",
                  supplierID: "",
                  categoryID: "",
                  productID: "",
                  pricePerUnit: "",
                  quantity: "",
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
                  onClick={handleUpdateWHstocks}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateWHstocks}
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
          title="Warehouse Stocks"
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
        onDelete={handleWHstockDelete}
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

export default WarehouseStock;
