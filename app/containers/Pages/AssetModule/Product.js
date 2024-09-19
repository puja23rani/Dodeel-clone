import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";
import {
  Autocomplete,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { Close as CloseIcon, Token } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import TablePlayground from "../../Tables/TablePlayground";
import AlertDialog from "../../UiElements/demos/DialogModal/AlertDialog";
import Popup from "../../../components/Popup/Popup";
import axios from "axios";

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

function Product() {
  const { classes } = useStyles();

  const [state, setState] = useState({
    id: "",
    productName: "",
    supplierName: "",
    supplierID: "",
    categoryName: "",
    categoryID: "",
    unitOfMeasurement: "",
    stockExpireDate: "",
    tax: "",
    barCode: "",
    photo: "",
    productDescription: "",
    isUpdate: false,
  });

  const [errors, setErrors] = useState({
    productName: "",
    supplierName: "",
    categoryName: "",
    unitOfMeasurement: "",
    stockExpireDate: "",
    tax: "",
    barCode: "",
    photo: "",
    productDescription: "",
  });

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!String(state.supplierName).trim()) {
      errors.supplierName = "Supplier Name is required";
      isValid = false;
    }

    // For categoryName
    if (!String(state.categoryName).trim()) {
      errors.categoryName = "Select the Category.";
      isValid = false;
    }
    if (!state.productName.trim()) {
      errors.productName = "Product Name is required.";
      isValid = false;
    }
    if (!state.unitOfMeasurement.trim()) {
      errors.unitOfMeasurement = "Unit of measurement is required.";
      isValid = false;
    }
    if (!state.stockExpireDate.trim()) {
      errors.stockExpireDate = "Stock expire date is required.";
      isValid = false;
    }

    if (!String(state.tax).trim()) {
        errors.tax = "Select the Tax rate.";
        isValid = false;
      }

    // if (!state.productDescription.trim()) {
    //   errors.productDescription = "Product description is required";
    //   isValid = false;
    // }
    if (!state.photo.trim()) {
      errors.photo = "Product Image is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const [rowdata, setRowdata] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
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
      id: "photo",
      numeric: false,
      disablePadding: false,
      label: "Product Image",
    },
    {
      id: "categoryName",
      numeric: false,
      disablePadding: false,
      label: "Category",
    },
    {
      id: "tax",
      numeric: false,
      disablePadding: false,
      label: "Tax",
    },
    { id: "actions", label: "Action" },
  ];

  const getProductList = async () => {
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

      if (actualData.status === 200) {
        setRowdata(
          actualData.productDetails.map((item) => ({
            slNo: actualData.productDetails.indexOf(item) + 1,
            id: item._id,
            productName: item.productName,
            photo: (
              <img
                src={item.photo}
                alt="Product"
                style={{
                  width: "50px", // Set width for the square shape
                  height: "50px", // Ensure height matches width
                  borderRadius: "8px", // Apply border-radius for rounded corners
                  border: "1px solid #ccc", // Optional border styling
                }}
              />
            ),
            categoryName: item.categoryName,
            tax: item.tax,
            actions: (
              <>
                <IconButton
                  aria-label="Edit"
                  onClick={(e) => {
                    // setIdToDelete(item._id);
                    // Set state with required format
                    setState({
                      id: item._id,
                      productName: item.productName,
                      categoryID: item.categoryID,
                      categoryName: item.categoryName,
                      supplierID: item.supplierID,
                      supplierName: item.supplierName,
                      tax: item.tax,
                      productDescription: item.productDescription,
                      photo: item.photo,
                      stockExpireDate: item.stockExpireDate,
                      barCode: item.barCode,
                      unitOfMeasurement: item.unitOfMeasurement,
                      isUpdate: true,
                    });
                    setOpenDialog(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="Delete"
                  onClick={(e) => {
                    setDeleteDialogOpen(true);
                    setIdToDelete(item._id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          }))
        );
      }
    } catch (err) {
      console.log(err);
      setMessage("Something went wrong!");
      setOpen(true);
      setSeverity("error");
    }
  };

  useEffect(() => {
    getProductList();
  }, []);
  const [categoryList, setCategoryList] = React.useState([]);
  function table2() {
    const authToken = localStorage.getItem("token");
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllProductCategories`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        // Handle the response
        if (response.data.categories) {
          setCategoryList(response.data.categories);
        }
        console.log(response.data.categories);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }
  const [SupplierList, setSupplierList] = React.useState([]);
  function table1() {
    const authToken = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/auth/getAllSuppliers`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        // Handle the response
        if (response.data.suppliers) {
          setSupplierList(response.data.suppliers);
        }
        console.log(response.data.suppliers);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }
  useEffect(() => {
    table1();
    table2();
  }, []);
  console.log(state,"stateeeeeeeeeeeeeee")
  const handleCreateProduct = async () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      } else {
        // Handle case where token is not available
        return;
      }
      const data = {
        productName: state.productName,
        categoryID: state.categoryName.id,
        categoryName: state.categoryName.title,
        supplierID: state.supplierName.id,
        supplierName: state.supplierName.title,
        tax: parseInt(state.tax),
        barCode: state.barCode,
        photo: state.photo,
        stockExpireDate: state.stockExpireDate,
        unitOfMeasurement: parseInt(state.unitOfMeasurement),
        productDescription: state.productDescription,
      };
      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createProduct`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setState({
          id: "",
          productName: "",
          supplierName: "",
          categoryName: "",
          unitOfMeasurement: "",
          stockExpireDate: "",
          tax: "",
          barCode: "",
          photo: "",
          productDescription: "",
          isUpdate: false,
        });
        setOpenDialog(false);
        setMessage("Saved successfully!");
        setOpen(true);
        setSeverity("success");
        getProductList();
        window.scrollTo({
          top: 400,
          behavior: "smooth",
        });
      }
    } catch (err) {
      console.log(err);
      setOpenDialog(false);
      setMessage("Something went wrong!");
      setOpen(true);
      setSeverity("error");
    }
  };

  const handleUpdateProduct = async () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }
      const data = {
        id: state.id,
        productName: state.productName,
        categoryID: state.categoryID,
        categoryName: state.categoryName,
        supplierID: state.supplierID,
        supplierName: state.supplierName,
        tax: parseInt(state.tax),
        barCode: state.barCode,
        photo: state.photo,
        stockExpireDate: state.stockExpireDate.slice(0,10),
        unitOfMeasurement: state.unitOfMeasurement,
      };
      const requestOptions = {
        method: "PUT",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updateProduct`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setState({
          id: "",
          productName: "",
          supplierName: "",
          categoryName: "",
          unitOfMeasurement: "",
          stockExpireDate: "",
          tax: "",
          barCode: "",
          photo: "",
          productDescription: "",
          isUpdate: false,
        });
        setOpenDialog(false);
        setMessage("Updated successfully!");
        setOpen(true);
        setSeverity("success");
        getProductList();
        window.scrollTo({
          top: 400,
          behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
        });
      }
    } catch (err) {
      console.log(err);
      setOpenDialog(false);
      setMessage("Something went wrong!");
      setOpen(true);
      setSeverity("error");
    }
  };

  const handleProductDelete = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }
      const data = { id: idToDelete };
      const requestOptions = {
        method: "DELETE",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteProduct`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status === 200) {
        setDeleteDialogOpen(false);
        setIdToDelete(null);
        getProductList();
        setMessage("Deleted successfully!");
        setOpen(true);
        setSeverity("success");
      }
    } catch (err) {
      console.log(err);
      setDeleteDialogOpen(false);
      setIdToDelete(null);
      setMessage("Something went wrong!");
      setOpen(true);
      setSeverity("error");
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setState({
      id: "",
      productName: "",
      supplierName: "",
      categoryName: "",
      unitOfMeasurement: "",
      stockExpireDate: "",
      tax: "",
      barCode: "",
      photo: "",
      productDescription: "",
      isUpdate: false,
    });
    setOpenDialog(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage); // Update the current page
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update the rows per page
    setPage(0); // Reset to first page
  };

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
                <AddIcon /> Add Supplier
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
          <DialogTitle>Product</DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent
            className={classes.dialogContent}
            sx={{
              width: "40vw",
            }}
          >
            <TextField
              fullWidth
              sx={{
                marginBottom: 2,
              }}
              variant="standard"
              id="productName"
              name="productName"
              label="Product Name"
              value={state.productName}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[a-zA-Z\s]*$/;
                const maxValue = 50;
                if (regex.test(value) && value.length <= maxValue) {
                  setState({ ...state, productName: e.target.value });
                }
              }}
              error={!!errors.productName} // Show error if it exists
              helperText={errors.productName} // Display error message
            />
            {/* image */}
            <Grid item xs={6} sx={{ marginBottom: 2 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="photo-upload"
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const fileType = file.type;
                    const validImageTypes = ["image/jpeg", "image/png"];
                    if (validImageTypes.includes(fileType)) {
                      setState({ ...state, photo: URL.createObjectURL(file) });
                      setErrors({ ...errors, photo: "" });
                    } else {
                      setErrors({
                        ...errors,
                        photo: "Please upload a valid image (JPG or PNG).",
                      });
                    }
                  }
                }}
              />
              <label htmlFor="photo-upload">
                <Button variant="outlined" component="span">
                  Upload Image
                </Button>
              </label>
              {state.photo && (
                <div>
                  <img
                    src={state.photo}
                    alt="Uploaded"
                    width="100"
                    style={{ marginTop: "10px" }}
                  />
                </div>
              )}
              {errors.photo && <p style={{ color: "red" }}>{errors.photo}</p>}
            </Grid>

            {/* category */}
            <Grid item xs={6}>
              <Autocomplete
                sx={{
                  marginTop: "-16px",
                }}
                id="highlights-demo"
                options={categoryList.map((item) => {
                  return { id: item._id, title: item.categoryName };
                })}
                getOptionLabel={(option) => option.title || ""} // Safely access title
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={state.categoryName}
                onChange={(e, v, reason) => {
                  if (reason === "clear") {
                    setState({
                      ...state,
                      categoryName: "",
                      categoryID: "",
                    });
                  } else {
                    const selectedcategory = categoryList.find(
                      (item) => item.categoryName === v
                    );
                    setState({
                      ...state,
                      categoryName: v,
                      categoryID: selectedcategory
                        ? selectedcategory._id
                        : null,
                    });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="category"
                    margin="normal"
                    variant="standard"
                    error={!!errors.categoryName} // Show error if it exists
                    helperText={errors.categoryName} // Display error message
                  />
                )}
              />
            </Grid>
            {/* Supplier */}
            <Grid item xs={6}>
              <Autocomplete
                sx={{
                  marginTop: "-16px",
                }}
                id="highlights-demo"
                options={categoryList.map((item) => {
                  return { id: item._id, title: item.categoryName };
                })}
                getOptionLabel={(option) => option.title || ""} // Safely access title
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={state.supplierName}
                onChange={(e, v, reason) => {
                  if (reason === "clear") {
                    setState({
                      ...state,
                      supplierName: "",
                      supplierID: "",
                    });
                  } else {
                    const selectedSupp = SupplierList.find(
                      (item) => item.supplierName === v
                    );
                    setState({
                      ...state,
                      supplierName: v,
                      supplierID: selectedSupp ? selectedSupp._id : null,
                    });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Supplier"
                    margin="normal"
                    variant="standard"
                    error={!!errors.supplierName} // Show error if it exists
                    helperText={errors.supplierName} // Display error message
                  />
                )}
              />
            </Grid>
            {/* unitofmeasurement */}
            <TextField
              fullWidth
              sx={{
                marginBottom: 2,
              }}
              variant="standard"
              id="unitOfMeasurement"
              name="unitOfMeasurement"
              label="unit Of Measurement"
              value={state.unitOfMeasurement}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[a-zA-Z0-9\s]*$/; // Allow letters, numbers, and spaces
                const maxValue = 50;
                if (regex.test(value) && value.length <= maxValue) {
                  setState({ ...state, unitOfMeasurement: value });
                }
              }}
              error={!!errors.unitOfMeasurement} // Show error if it exists
              helperText={errors.unitOfMeasurement} // Display error message
            />
            {/* stock Expire Date */}
            <Grid item xs={6} sx={{ width: "100%" }}>
              <TextField
                id="date"
                label="Stock Expire Date"
                type="date"
                variant="standard"
                defaultValue={state.stockExpireDate}
                sx={{ width: "100%" }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) =>
                  setState({ ...state, stockExpireDate: e.target.value })
                }
              />
            </Grid>
            {/* tax */}
            <FormControl 
  fullWidth
  variant="standard"
  sx={{ marginBottom: 2 }}
  error={!!errors.tax} // Show error if it exists
>
  <InputLabel id="tax-label">Tax No.</InputLabel>
  <Select
    labelId="tax-label"
    id="tax"
    name="tax"
    value={state.tax}
    onChange={(e) => {
      setState({ ...state, tax: e.target.value });
    }}
  >
    <MenuItem value={0}>0%</MenuItem>
    <MenuItem value={5}>5%</MenuItem>
    <MenuItem value={12}>12%</MenuItem>
    <MenuItem value={18}>18%</MenuItem>
    <MenuItem value={28}>28%</MenuItem>
  </Select>
  {errors.tax && <FormHelperText>{errors.tax}</FormHelperText>}
</FormControl>

            {/* barcode */}
            <TextField
              fullWidth
              sx={{
                marginBottom: 2,
              }}
              variant="standard"
              id="barCode"
              name="barCode"
              label="Barcode"
              value={state.barCode}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[a-zA-Z0-9\s]*$/; // Allow letters, numbers, and spaces
                const maxValue = 50;
                if (regex.test(value) && value.length <= maxValue) {
                  setState({ ...state, barCode: value });
                }
              }}
              error={!!errors.barCode} // Show error if it exists
              helperText={errors.barCode} // Display error message
            />
            {/* description */}
            <TextField
              fullWidth
              multiline
              rows={4} // Specifies the number of lines for the textarea
              sx={{
                marginBottom: 2,
              }}
              variant="standard"
              id="productDescription"
              name="productDescription"
              label="Description"
              value={state.productDescription}
              onChange={(e) => {
                const value = e.target.value;
                const maxValue = 200; // Set a limit for description length
                if (value.length <= maxValue) {
                  setState({ ...state, productDescription: value });
                }
              }}
              error={!!errors.productDescription} // Show error if it exists
              helperText={errors.productDescription || `Max 200 characters`} // Display error message or hint
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Close
            </Button>
            {state.isUpdate ? (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleUpdateProduct}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateProduct}
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
          title="Product List"
          columnData={columnData}
          rowData={rowdata}
          component="div"
          count={rowdata.length} // Total number of rows
          rowsPerPage={rowsPerPage} // Number of rows per page
          page={page} // Current page
          onPageChange={handlePageChange} // Handle page change
          onRowsPerPageChange={handleRowsPerPageChange} // Handle rows per page change
        />
      )}

      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleProductDelete}
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

export default Product;
