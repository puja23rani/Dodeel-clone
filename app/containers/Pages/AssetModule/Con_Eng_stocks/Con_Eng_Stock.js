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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
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

function Con_Eng_Stock() {
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
  console.log(state, "stateee");
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

    // if (!state.warehouseName.trim()) {
    //   errors.warehouseName = "Warehouse Name is required";
    //   isValid = false;
    // }
    if (!String(state.supplierName).trim()) {
      errors.supplierName = "Supplier Name is required.";
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
      errors.pricePerUnit = "Price is required";
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
  const { ConID } = location.state || {};

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
  console.log(ConID, "ConID");

 
  console.log(state, "stateware");
  function fetchWHstock() {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getcontractorstockdetails`,
        {
          warehouseID: ConID._id,
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
                  <Tooltip title="Quantity Update">
                    <IconButton
                      aria-label="Quantity Update"
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
                          // supplierName: item.supplierName,
                          // categoryName: item.categoryName,
                          // productName: item.productName,
                          pricePerUnit: item.pricePerUnit,
                          quantity: item.quantity,
                          productName: {
                            id: item.productID?._id,
                            title: item.productID.productName,
                          },
                          categoryName: {
                            id: item.categoryID?._id,
                            title: item.categoryID.categoryName,
                          },
                          supplierName: {
                            id: item.supplierID?._id,
                            title: item.supplierID.supplierName,
                          },
                          isUpdate: true,
                        });
                        setOpenDialog(true);
                        setisQty(true);
                        setisPrice(false);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Price Update">
                    <IconButton
                      aria-label="Price Update"
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
                          // supplierName: item.supplierName,
                          // categoryName: item.categoryName,
                          // productName: item.productName,
                          pricePerUnit: item.pricePerUnit,
                          quantity: item.quantity,
                          productName: {
                            id: item.productID?._id,
                            title: item.productID.productName,
                          },
                          categoryName: {
                            id: item.categoryID?._id,
                            title: item.categoryID.categoryName,
                          },
                          supplierName: {
                            id: item.supplierID?._id,
                            title: item.supplierID.supplierName,
                          },
                          isUpdate: true,
                        });
                        setOpenDialog(true);
                        setisPrice(true);
                        setisQty(false);
                      }}
                    >
                      <AttachMoneyIcon />
                    </IconButton>
                  </Tooltip>
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
  console.log(isPrice, "is price");
  console.log(isQty, "is qty");
  // console.log(SupplierList, "listtttttttttttttsupp");
  // console.log(CategoryList, "categorylst");
  useEffect(() => {
    fetchWHstock();
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
        pricePerUnit: parseInt(state.pricePerUnit),
        quantity: parseInt(state.quantity),
        productID: state.productName.id,
        productName: state.productName.title,
        categoryID: state.categoryName.id,
        categoryName: state.categoryName.title,
        supplierID: state.supplierName.id,
        supplierName: state.supplierName.title,
      };
      console.log(state, "statecreate");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/adjustStockQuantity`,
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
  const handleUpdatePricestocks = async () => {
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
        pricePerUnit: parseInt(state.pricePerUnit),
        quantity: parseInt(state.quantity),
        productID: state.productName.id,
        productName: state.productName.title,
        categoryID: state.categoryName.id,
        categoryName: state.categoryName.title,
        supplierID: state.supplierName.id,
        supplierName: state.supplierName.title,
      };
      console.log("p2");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updateWarehouseStock`,
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
  const handleUpdateQtystocks = async () => {
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
        pricePerUnit: parseInt(state.pricePerUnit),
        quantity: parseInt(state.quantity),
        productID: state.productName.id,
        productName: state.productName.title,
        categoryID: state.categoryName.id,
        categoryName: state.categoryName.title,
        supplierID: state.supplierName.id,
        supplierName: state.supplierName.title,
      };
      console.log("p2");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/adjustStockQuantity`,
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

  console.log(state);
  console.log(isPrice);
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
                <AddIcon /> Add Warehouse Stocks
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
          open={openDialog}
          onClose={() => {
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
            setisPrice(false);
            setisQty(false);
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
              setisPrice(false);
              setisQty(false);
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
                <Grid item xs={6}>
                  <TextField
                    label="Warehouse Name"
                    variant="standard"
                    fullWidth
                    value={warehouseID.warehouseName}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                {/* Supplier */}
                <Grid item xs={6}>
                  {isPrice || isQty ? (
                    // Render a read-only TextField when the condition is true
                    <TextField
                      fullWidth // Make sure the width is consistent with other fields
                      label="Supplier Name"
                      value={state.supplierName?.title || ""} // Safely handle the supplierName object
                      InputProps={{ readOnly: true }}
                      variant="standard"
                      margin="normal"
                    />
                  ) : (
                    // Render Autocomplete when the condition is false
                    <Autocomplete
                      fullWidth // Ensure full width to match other fields
                      sx={{
                        marginTop: "-16px",
                      }}
                      id="tags-standard"
                      options={SupplierList}
                      getOptionLabel={(option) => option.title || ""} // Safely access title
                      value={state.supplierName} // Ensure value is an object or null
                      onChange={(e, v) => {
                        setState({
                          ...state,
                          supplierName: v ? v : null, // Set supplierName to the selected object or null
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Supplier Name"
                          margin="normal"
                          variant="standard"
                          error={!!errors.supplierName} // Show error if it exists
                          helperText={errors.supplierName} // Display error message
                        />
                      )}
                    />
                  )}
                </Grid>

                {/* Category */}
                <Grid item xs={6}>
                  {isPrice || isQty ? (
                    // Render a read-only TextField when the condition is true
                    <TextField
                      label="Category Name"
                      value={state.categoryName?.title || ""} // Safely handle categoryName object
                      InputProps={{ readOnly: true }}
                      fullWidth
                      variant="standard"
                      margin="normal"
                    />
                  ) : (
                    // Render Autocomplete when the condition is false
                    <Autocomplete
                      sx={{
                        marginTop: "-16px",
                      }}
                      id="tags-standard"
                      options={CategoryList}
                      getOptionLabel={(option) => option.title || ""} // Safely access title
                      value={state.categoryName} // Ensure value is an object or null
                      onChange={(e, v) => {
                        setState({
                          ...state,
                          categoryName: v ? v : null, // Set categoryName to the selected object or null
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Category Name"
                          margin="normal"
                          variant="standard"
                          error={!!errors.categoryName} // Show error if it exists
                          helperText={errors.categoryName} // Display error message
                          fullWidth
                        />
                      )}
                    />
                  )}
                </Grid>

                {/* Product */}
                <Grid item xs={6}>
                  {isPrice || isQty ? (
                    // Render a read-only TextField when the condition is true
                    <TextField
                      label="Product Name"
                      value={state.productName?.title || ""} // Safely handle productName object
                      InputProps={{ readOnly: true }}
                      fullWidth
                      variant="standard"
                      margin="normal"
                    />
                  ) : (
                    // Render Autocomplete when the condition is false
                    <Autocomplete
                      sx={{
                        marginTop: "-16px",
                      }}
                      id="tags-standard"
                      options={filteredProducts} // Use the filtered product list
                      getOptionLabel={(option) => option.title || ""} // Safely access title
                      value={state.productName} // Ensure value is an object or null
                      onChange={(e, v) => {
                        setState({
                          ...state,
                          productName: v ? v : null, // Set the selected product
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Product Name"
                          margin="normal"
                          variant="standard"
                          error={!!errors.productName} // Show error if it exists
                          helperText={errors.productName} // Display error message
                          fullWidth
                        />
                      )}
                    />
                  )}
                </Grid>

                {/* quantity */}
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
                    InputProps={{
                      readOnly: isUpdate ? isPrice || !isQty : false,
                    }} // Conditionally set readOnly
                    error={!!errors.quantity} // Show error if it exists
                    helperText={errors.quantity} // Display error message
                  />
                </Grid>

                {/* pricePerUnit */}
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
                    InputProps={{
                      readOnly: isUpdate ? isQty || !isPrice : false,
                    }} // Conditionally set readOnly
                    error={!!errors.pricePerUnit} // Show error if it exists
                    helperText={errors.pricePerUnit} // Display error message
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
                setisPrice(false);
                setisQty(false);
              }}
              color="secondary"
            >
              Close
            </Button>
            {state.isUpdate ? (
              <>
                <Button
                  onClick={(e) => {
                    if (isPrice) {
                      handleUpdatePricestocks(state.id);
                    } else if (isQty) {
                      handleUpdateQtystocks(state.id);
                    }
                  }}
                  color="primary"
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

export default Con_Eng_Stock;
