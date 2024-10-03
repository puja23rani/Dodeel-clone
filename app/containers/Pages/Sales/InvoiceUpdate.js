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
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import TablePlayground from "../../Tables/TablePlayground";
import Popup from "../../../components/Popup/Popup";
import AlertDialog from "../../UiElements/demos/DialogModal/AlertDialog";
import { DatePicker } from "@mui/x-date-pickers";
import { convertFromRaw, EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { useLocation, useNavigate } from "react-router-dom";
import InvoiceButtons from "./InvoiceButtons";
const useStyles = makeStyles()((theme) => ({
  textEditor: {
    // optional padding for better spacing
    padding: "5px",
    backgroundColor: "secondary.light",
    minHeight: "200px", // set a minimum height for the editor
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
const styles = {
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  line: {
    margin: "10px 0",
    height: 2,
    backgroundColor: "#000",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paper: {
    padding: 20,
    marginBottom: 20,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  newLine: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    alignItems: "center",
  },
};

function InvoiceUpdate() {
  const [errors, setErrors] = useState({
    taxType: "",
    taxRate: "",
    lineItems: [], // To track line item errors
  });

  const validate = () => {
    let isValid = true;
    let errors = {
      lineItems: [],
    };

    // Validate taxType

    // Validate each line item
    lineItems.forEach((item, index) => {
      const lineErrors = {};

      if (!item.description.trim()) {
        lineErrors.description = "Description is required";
        isValid = false;
      }

      if (!item.quantity) {
        lineErrors.quantity = "Quantity is required";
        isValid = false;
      }

      if (!item.unit.trim()) {
        lineErrors.unit = "Unit is required";
        isValid = false;
      }

      if (!item.rate) {
        lineErrors.rate = "Rate is required";
        isValid = false;
      }

      // Push errors for each line item
      if (Object.keys(lineErrors).length > 0) {
        errors.lineItems[index] = lineErrors;
      }
    });

    setErrors(errors);
    return isValid;
  };

  const [rowdata, setRowdata] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchBillTax();
  }, []);

  const fetchBillTax = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/auth/getAllBillTax`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.data) {
          setRowdata(
            response.data.data.map((item) => ({
              slNo: response.data.data.indexOf(item) + 1,
              id: item._id,
              billtax: item.taxType,
              billrate: item.taxRate,
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
                        taxType: item.taxType,
                        taxRate: item.taxRate,
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
  const location = useLocation();
  const { InvoiceID } = location.state || {};
  const { classes } = useStyles();
  const token = localStorage.getItem("token");
  const [list, setList] = useState([]);
  const [visalist, setVisalist] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [readOnly, setReadOnly] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [mainlist, setMainList] = useState({});
  const [Invoicelist, setInvoiceList] = useState({});
  const [lineItems, setLineItems] = useState([]); // New state for line items
  const [validationErrors, setValidationErrors] = useState({});
  const [state, setState] = useState({
    invoiceDate: new Date(),
    billDueDate: new Date(),
    newLine: {
      description: "",
      quantity: "",
      unit: "",
      rate: "",
    },
    contactDetail: {
      companyName: "",
      contactNumber: "",
      emailAddress: "",
      address: " ",
    },
    billSubTotal: "",
    discountType: "",
    billDiscountPercentage: "",
    billDiscountAmount: "",
    billCustomerID: "",
    billCustomerName: "",
    customerEmail: "",
    billingAddress: "",
    shippingAddress: "",
    billFixedAmount: "",
    billTaxPercentage: "",
    billTaxTotalAmount: "",
    taxType: "",
    taxRate: "",
    billAdjustmentAmount: null, // Initialize as number
    billAdjustmentDescription: null,
    billTotalAmount: "",
    billPaidAmount: "",
    billDueAmount: "",
    billNote: EditorState.createEmpty(), // Initialize as number
  });
  console.log("mainlist", mainlist);
  // State for popup form
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);
  const [opencalculate, setOpenCalculate] = useState(false);
  const [adjustment, setAdjustment] = useState({
    description: null,
    amount: null,
  });

  const table = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }
      const data = { id: InvoiceID };
      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getInvoiceById`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData && actualData.data && actualData.data.contactDetail) {
        setMainList({
          bill_ID: actualData.data.bill_ID,
          billStatus: actualData.data.billStatus,
          billCustomerID: actualData.data.billCustomerID,
          billCustomerName: actualData.data.billCustomerName,
          customerEmail: actualData.data.customerEmail,
          billingAddress: actualData.data.billingAddress,
          shippingAddress: actualData.data.shippingAddress,
          billPaidAmount: actualData.data.billPaidAmount,
          contactDetail: {
            _id: actualData.data.contactDetail._id,
            companyName: actualData.data.contactDetail.companyName,
            contactNumber: actualData.data.contactDetail.contactNumber,
            emailAddress: actualData.data.contactDetail.emailAddress,
            address: actualData.data.contactDetail.address,
          },
        });
      }

      var newLinesWithTotal = actualData.data.newLine.map((item) => {
        // Check for 0 values and set them as empty strings
        item.quantity = item.quantity === 0 ? "" : item.quantity;
        item.unit = item.unit === 0 ? "" : item.unit;
        item.rate = item.rate === 0 ? "" : item.rate;

        // Calculate the total and ensure toFixed(2) is used correctly for non-empty values
        const quantity = parseFloat(item.quantity) || 0;
        const rate = parseFloat(item.rate) || 0;
        item["total"] = (quantity * rate).toFixed(2);

        return item;
      });

      setLineItems(newLinesWithTotal);

      setAdjustment({
        description: actualData.data.billAdjustmentDescription,
        amount: actualData.data.billAdjustmentAmount,
      });
      setDiscount({
        type: actualData.data.discountType,
        amount: actualData.data.billDiscountAmount,
        percent: actualData.data.billDiscountPercentage,
      });

      var newStateData = {
        invoiceDate: actualData.data.invoiceDate.slice(0, 10),

        billDueDate: actualData.data.billDueDate.slice(0, 10),
        bill_ID: actualData.data.bill_ID,
        billSubTotal: "",
        discountType: "",
        billDiscountPercentage: "",
        billDiscountAmount: "",
        billFixedAmount: "",
        taxRate:
          actualData.data.taxRate === "Not Found"
            ? ""
            : actualData.data.taxRate,
        billTaxPercentage: actualData.data.billTaxPercentage,
        billTaxTotalAmount: actualData.data.billTaxTotalAmount,
        billTaxTypeID: actualData.data.billTaxTypeID,
        taxType: {
          id: actualData.data.billTaxTypeID,
          title:
            actualData.data.billTaxTypeName === "Not Found"
              ? ""
              : actualData.data.billTaxTypeName,
        },
        billTotalAmount: "",
        billPaidAmount: "",
        billDueAmount: "",
        billNote: EditorState.createWithContent(
          convertFromRaw(JSON.parse(actualData.data.billNote))
        ),
        Description: "", // Ensure it's a number
      };

      setState(newStateData);
      console.log(actualData);
      console.log("state", state);
      if (actualData.data.billPaidAmount > 0) {
        setReadOnly(true);
      }
      return newStateData;
    } catch (err) {
      console.log(err);
    }
  };

  const [taxList, setTaxList] = React.useState([]);
  const table2 = async (tableData) => {
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
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllBillTax`,
        requestOptions
      );
      const actualData = await res.json();

      console.log(actualData);
      setTaxList(actualData.data);
      // var taxtype = actualData.data.find(
      //   (type) => type._id == tableData.billTaxTypeID
      // )?.taxType;
      // setState({ ...tableData, taxType: taxtype });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await table().then(async (tableData) => await table2(tableData));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDateChange = (date) => {
    setInvoiceDate(date);
  };

  const formatDateForAPI = (date) => {
    return moment(date).format("MM-DD-YYYY");
  };

  const handleNewLine = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now(),
        description: "",
        quantity: "",
        unit: "",
        rate: "",
        total: "",
      },
    ]);
  };

  const handleLineItemChange = (index, field, value) => {
    const newLineItems = [...lineItems];
    newLineItems[index][field] = value;
    if (field === "quantity" || field === "rate") {
      const quantity = parseFloat(newLineItems[index].quantity) || 0;
      const rate = parseFloat(newLineItems[index].rate) || 0;
      newLineItems[index].total = (quantity * rate).toFixed(2);
    }
    setLineItems(newLineItems);
  };

  const handleDeleteLine = (id) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  // Utility function to format date as 'YYYY-MM-DD'
  const formatDate = (date) => {
    return date.toISOString().split("T")[0]; // Formats 'Date' object to 'YYYY-MM-DD'
  };

  const [totalAmaount, settotalAmaount] = useState("");

  // Here is your solution for calculating the subtotal
  const calculateSubtotal = () => {
    const total = lineItems
      .reduce((acc, item) => acc + parseFloat(item.total || 0), 0)
      .toFixed(2);

    return total;
  };
  const [discount, setDiscount] = useState({
    type: "Percentage",
    amount: 0,
    percent: 0,
  });
  const [openDiscountPopup, setOpenDiscountPopup] = useState(false);
  console.log(state, "state");
  // const calculateTotalAmount = () => {
  //   const subtotal = parseFloat(calculateSubtotal()) || 0;
  //   const adjustment = parseFloat(state.billAdjustmentAmount) || 0;
  //   const taxRate = parseFloat(state.billTaxPercentage) || 0;
  //   const taxAmount = (subtotal * (taxRate / 100)).toFixed(2);
  //   let discountAmount = 0;

  //   if (discount.type === "Percentage") {
  //     discountAmount = (subtotal * (discount.percent / 100)).toFixed(2);
  //   } else if (discount.type === "Fixed") {
  //     discountAmount = parseFloat(discount.amount) || 0;
  //   }

  //   return (
  //     subtotal +
  //     adjustment +
  //     parseFloat(taxAmount) -
  //     discountAmount
  //   ).toFixed(2);
  // };
  const calculateTotalAmount = () => {
    const subtotal = parseFloat(calculateSubtotal()) || 0;
    const adjustment = parseFloat(state.billAdjustmentAmount) || 0;
    const taxRate = parseFloat(state.taxRate) || 0; // Use state.taxRate instead of state.billTaxPercentage
    const taxAmount = (subtotal * (taxRate / 100)).toFixed(2);
    let discountAmount = 0;

    if (discount.type === "Percentage") {
      discountAmount = (subtotal * (discount.percent / 100)).toFixed(2);
    } else if (discount.type === "Fixed") {
      discountAmount = parseFloat(discount.amount) || 0;
    }

    return (
      subtotal +
      adjustment +
      parseFloat(taxAmount) -
      discountAmount
    ).toFixed(2);
  };

  const calculateBalanceDueAmount = () => {
    const totalAmount = parseFloat(calculateTotalAmount()) || 0;
    const paidAmount = parseFloat(mainlist.billPaidAmount) || 0;
    return (totalAmount - paidAmount).toFixed(2);
  };

  const handlePopupOpen = () => {
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    setOpenPopup(false);
  };

  const handleAdjustmentChange = (e) => {
    const { name, value } = e.target;
    setAdjustment({
      ...adjustment,
      [name]: name == "amount" ? (value != "" ? parseFloat(value) : 0) : value,
    });
  };

  const handleAdjustmentSubmit = () => {
    setState({
      ...state,
      billAdjustmentDescription: adjustment.billAdjustmentDescription,
      billAdjustmentAmount: parseFloat(adjustment.amount) || null, // Ensure it's a number
    });
    handlePopupClose();
  };
  const handleClearAdjustment = () => {
    setState({
      ...state,
      billAdjustmentDescription: null,
      billAdjustmentAmount: null,
    });
  };

  const handleDiscountPopupOpen = () => setOpenDiscountPopup(true);
  const handleDiscountPopupClose = () => setOpenDiscountPopup(false);

  const handleDiscountChange = (e) => {
    setDiscount({ ...discount, [e.target.name]: e.target.value });
  };

  const handleDiscountTypeChange = (e) => {
    setDiscount({ ...discount, type: e.target.value });
  };

  const handleUpdateInvoice = async (id) => {
    if (!validate()) return;
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }

      // Helper function to format the current date to yyyy-mm-dd
      const getFormattedDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
        const dd = String(today.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };

      const data = {
        id: InvoiceID,
        invoiceDate: state.invoiceDate,
        billDueDate: state.billDueDate,
        billSentDate: getFormattedDate(), // Set the billSentDate to the current date in yyyy-mm-dd format
        newLine: lineItems,
        discountType: discount.type,
        billTaxTypeID: state.billTaxTypeID,
        billTaxPercentage: state.billTaxPercentage,
        billNote: JSON.stringify(
          convertToRaw(state.billNote.getCurrentContent())
        ),
        billTerms: "30 days net",
        billOverDueReminder: "Yes",
      };

      if (discount.type == "Fixed") {
        data["billDiscountAmount"] = parseInt(discount.amount);
      } else if (discount.type == "Percentage") {
        data["billDiscountPercentage"] = parseInt(discount.percent);
      }
      if (adjustment.amount !== 0) {
        data.billAdjustmentAmount = adjustment.amount;
        data.billAdjustmentDescription = adjustment.description;
      }

      const requestOptions = {
        method: "PUT",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };

      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/updateInvoice`,
        requestOptions
      );
      const actualData = await res.json();

      if (actualData.status === 200) {
        setMessage("Invoice updated successfully");
        setOpen(true);
        setSeverity("success");
        navigate("/app/sales/invoice/invoice-view", {
          state: { InvoiceID: InvoiceID },
        });
        //fetchInvoice(page);
      } else {
        setMessage(actualData.message);
        setOpen(true);
        setSeverity("error");
      }
    } catch (err) {
      setMessage(err.message);
      setOpen(true);
      setSeverity("error");
      console.log("Error:", err);
    }
  };

  console.log(lineItems, "lineitems");
  return (
    <>
      <div>
        <Toolbar className={classes.toolbar}>
          <div className={classes.spacer} style={{ flexGrow: 1 }} />
          <div className={classes.actions}></div>
        </Toolbar>
        <div className={classes.contentSection}>
          <InvoiceButtons mainlist={mainlist} table={table} />

          <Paper style={styles.paper}>
            <div style={styles.row}>
              <div style={{ padding: "5px", marginLeft: "5px" }}>
                <div style={styles.section}>
                  <Typography
                    variant="h4"
                    color="grey"
                    style={{ fontWeight: "bold" }}
                  >
                    INVOICE
                  </Typography>
                  <Typography>{mainlist.bill_ID}</Typography>
                </div>
              </div>

              <div style={styles.section}>
                {/* <Typography>Bill Status</Typography> */}
                <Typography
                  style={{
                    color:
                      mainlist.billStatus === "Draft"
                        ? "#cb1e36"
                        : mainlist.billStatus === "Paid"
                        ? "#71b921"
                        : mainlist.billStatus === "Part-paid"
                        ? "#e9cd41"
                        : mainlist.billStatus === "Due"
                        ? "grey"
                        : mainlist.billStatus === "OverDue"
                        ? "#bb673f"
                        : "black", // Default color if no match
                    fontSize: "30px",
                    fontWeight: "bold",
                  }}
                >
                  {mainlist.billStatus}
                </Typography>
              </div>
            </div>

            <div style={styles.line}></div>

            <div style={styles.row}>
              <div style={styles.row}>
                <div style={{ padding: "14px" }}>
                  <div style={styles.section}>
                    <Typography
                      style={{
                        color: "#239ED0",
                        fontSize: "25px",
                        fontWeight: "bold",
                      }}
                    >
                      {mainlist?.contactDetail?.companyName || "Loading..."}
                    </Typography>
                    <Typography style={{ fontSize: "15px" }}>
                      {mainlist?.contactDetail?.emailAddress || "Loading..."}
                    </Typography>
                    <Typography style={{ fontSize: "15px" }}>
                      {mainlist?.contactDetail?.contactNumber || "Loading..."}
                    </Typography>
                    <Typography style={{ fontSize: "15px" }}>
                      {mainlist?.contactDetail?.address
                        .split(",")
                        .slice(0, 2)
                        .join(",") || "Loading..."}
                    </Typography>
                    <Typography style={{ fontSize: "15px" }}>
                      {mainlist?.contactDetail?.address
                        .split(",")
                        .slice(2)
                        .join(",") || "Loading..."}
                    </Typography>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={styles.section}>
                  <Typography style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Invoice To
                  </Typography>
                  <Typography style={{ color: "#8d7d7f" }}>
                    {mainlist.billCustomerName}
                  </Typography>
                  <Typography style={{ fontSize: "15px" }}>
                    {mainlist.customerEmail}
                  </Typography>
                  <Typography style={{ fontSize: "15px" }}>
                    {mainlist?.shippingAddress
                      ?.split(",")
                      ?.slice(0, 2)
                      ?.join(",")}
                  </Typography>
                  <Typography style={{ fontSize: "15px" }}>
                    {mainlist?.shippingAddress
                      ?.split(",")
                      ?.slice(2, 4)
                      ?.join(",")}
                  </Typography>
                  <Typography style={{ fontSize: "15px" }}>
                    {mainlist?.shippingAddress?.split(",")?.slice(4)?.join(",")}
                  </Typography>

                  <Typography style={{ fontSize: "15px" }}>
                    {mainlist?.billingAddress
                      ?.split(",")
                      ?.slice(0, 2)
                      ?.join(",")}
                  </Typography>
                  <Typography style={{ fontSize: "15px" }}>
                    {mainlist?.billingAddress
                      ?.split(",")
                      ?.slice(2, 4)
                      ?.join(",")}
                  </Typography>
                  <Typography style={{ fontSize: "15px" }}>
                    {mainlist?.billingAddress?.split(",")?.slice(4)?.join(",")}
                  </Typography>
                </div>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.section}>
                <div
                  style={{
                    marginLeft: "20px ",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <label style={{ marginRight: "10px" }}>Invoice Date: </label>
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
                    sx={{ width: 220 }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ readOnly: readOnly }}
                    // error={!!errors.invoiceDate} // Show error if it exists
                    // helperText={errors.invoiceDate} // Display error message
                  />
                  {/* <DatePicker
                  selected={state.invoiceDate}
                  onChange={(date) => {
                    setState({
                      ...state,
                      invoiceDate: date,
                    });
                    const dateINvoice = date.toISOString().split("T")[0];
                    console.log(dateINvoice);
                    setInvoiceList({
                      ...mainlist,
                      invoiceDate: dateINvoice,
                    });
                  }}
                  dateFormat="yyyy-MM-dd"
                  customInput={<CustomInput />}
                /> */}
                </div>

                <div
                  style={{
                    marginLeft: "20px ",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "15px",
                  }}
                >
                  <label style={{ marginRight: "10px" }}>Due Date: </label>
                  <div style={{ marginLeft: "26px" }}>
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
                      sx={{ width: 220 }}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        min: new Date(
                          new Date(state.invoiceDate).setDate(
                            new Date(state.invoiceDate).getDate() + 1
                          )
                        )
                          .toISOString()
                          .split("T")[0], // Adding one day to invoiceDate
                      }}
                      InputProps={{ readOnly: readOnly }}
                      // error={!!errors.billDueDate} // Show error if it exists
                      // helperText={errors.billDueDate} // Display error message
                    />

                    {/* <DatePicker
                    selected={state.billDueDate}
                    onChange={(date) => {
                      setState({
                        ...state,
                        billDueDate: date,
                      });
                      const dateINvoice = date.toISOString().split("T")[0];
                      console.log(dateINvoice);
                      setInvoiceList({
                        ...mainlist,
                        billDueDate: dateINvoice,
                      });
                    }}
                    dateFormat="yyyy-MM-dd"
                    customInput={<CustomInput />}
                  /> */}
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <Typography>Payments: ₹ {mainlist.billPaidAmount}</Typography>
                <Typography style={{ marginTop: "20px" }}>
                  Balance Due:
                  <span
                    style={{
                      background: "#bc3649",
                      borderRadius: 9,
                      width: "fit-content",
                      padding: 5,
                      fontSize: "13px",
                      color: "white",
                    }}
                  >
                    {calculateBalanceDueAmount()}
                    {/* {mainlist.billDueAmount} */}
                  </span>
                </Typography>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between", // Use space-between to distribute space evenly
                marginLeft: "15px",
                marginRight: "15px", // Add margin right for symmetry
              }}
            >
              <p style={{ flex: "1", margin: "0" }}>Description</p>
              <p style={{ flex: "1", textAlign: "center", margin: "0" }}>Qty</p>
              <p style={{ flex: "1", textAlign: "center", margin: "0" }}>
                Unit
              </p>
              <p style={{ flex: "1", textAlign: "center", margin: "0" }}>
                Rate
              </p>
              <p style={{ flex: "1", textAlign: "center", margin: "0" }}>
                Total
              </p>
            </div>

            <div style={styles.line}></div>

            {lineItems.map((item, index) => (
              <div key={item.id} style={styles.newLine}>
                <TextField
                  label="Description"
                  value={item.description}
                  onChange={(e) =>
                    handleLineItemChange(index, "description", e.target.value)
                  }
                  error={!!errors.lineItems[index]?.description}
                  helperText={errors.lineItems[index]?.description}
                  InputProps={{ readOnly: readOnly }}
                />
                <TextField
                  label="Qty"
                  value={item.quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      // Allow only digits
                      handleLineItemChange(index, "quantity", value);
                    }
                  }}
                  error={!!errors.lineItems[index]?.quantity}
                  helperText={errors.lineItems[index]?.quantity}
                  InputProps={{ readOnly: readOnly }}
                />
                <TextField
                  label="Unit"
                  value={item.unit}
                  onChange={(e) =>
                    handleLineItemChange(index, "unit", e.target.value)
                  }
                  error={!!errors.lineItems[index]?.unit}
                  helperText={errors.lineItems[index]?.unit}
                  InputProps={{ readOnly: readOnly }}
                />
                <TextField
                  label="Rate"
                  value={item.rate}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      // Allow only digits
                      handleLineItemChange(index, "rate", value);
                    }
                  }}
                  error={!!errors.lineItems[index]?.rate}
                  helperText={errors.lineItems[index]?.rate}
                  InputProps={{ readOnly: readOnly }}
                />
                <TextField
                  label="Total"
                  value={item.total}
                  InputProps={{ readOnly: true }}
                />
                <IconButton onClick={() => handleDeleteLine(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}

            {!readOnly && (
              <>
                <Button
                  style={{
                    background: "#939393",
                    borderRadius: 9,
                    width: "fit-content",
                    padding: 5,
                    fontSize: "10px",
                    color: "white",
                    marginLeft: "20px",
                    marginBottom: "20px",
                  }}
                  onClick={handleNewLine}
                >
                  NewLine
                </Button>
              </>
            )}

            <div style={styles.paper}>
              <Typography variant="h6" color="primary" gutterBottom>
                Summary
              </Typography>
              <div style={styles.row}>
                <Typography>Subtotal</Typography>
                <Typography>{calculateSubtotal()}</Typography>
              </div>
              <div style={styles.row}>
                <Typography>Adjustment</Typography>
                <Typography>{adjustment.amount?.toFixed(2) ?? 0.0}</Typography>
                <div>
                  {!readOnly && (
                    <>
                      {" "}
                      <Button
                        variant="contained"
                        style={{
                          background: "#939393",
                          borderRadius: 9,
                          width: "fit-content",
                          padding: 5,
                          fontSize: "12px",
                          color: "white",
                          marginLeft: "20px",
                          marginBottom: "20px",
                          border: "1px solid black",
                        }}
                        onClick={handlePopupOpen}
                      >
                        Adjust
                      </Button>
                      <Button
                        variant="contained"
                        // color="secondary"
                        onClick={handleClearAdjustment}
                        style={{
                          marginLeft: "10px",
                          borderRadius: 9,
                          background: "#FA8072",
                          width: "fit-content",
                          padding: 5,
                          fontSize: "12px",
                          color: "white",
                          marginLeft: "20px",
                          marginBottom: "20px",
                          border: "1px solid black",
                        }}
                      >
                        Clear
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {/* <div style={styles.row}>
              <Typography>Tax Rate (%)</Typography>
              <TextField
                type="number"
                value={state.billTaxPercentage}
                onChange={(e) => {
                  const taxPercentage = parseFloat(e.target.value) || 0;
                  setState({
                    ...state,
                    billTaxPercentage: taxPercentage,
                  });
                }}
                style={{ width: "80px" }} // Adjust width
                InputProps={{
                  style: {
                    padding: "-22px 10px", // Adjust padding to reduce height
                    fontSize: "14px", // Adjust font size
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px", // Adjust label font size if needed
                  },
                }}
              />
            </div> */}
              <div style={styles.row}>
                <Typography>Discount</Typography>
                <Typography
                  style={{
                    marginLeft: "10px",
                    borderRadius: 9,
                    padding: 5,
                    fontSize: "14px",

                    display: "inline-block", // Ensure the discount is displayed inline
                    marginTop: "10px",
                  }}
                >
                  {discount.type === "Percentage"
                    ? `${discount.percent}%`
                    : `₹ ${discount.amount}`}
                </Typography>
                {!readOnly && (
                  <>
                    {" "}
                    <Button
                      variant="contained"
                      onClick={handleDiscountPopupOpen}
                      style={{
                        marginLeft: "10px",
                        borderRadius: 9,
                        border: "",
                        background: "#939393",
                        width: "fit-content",
                        padding: 5,
                        fontSize: "12px",
                        color: "white",
                        marginBottom: "20px",
                        marginTop: "10px",
                        border: "1px solid black",
                      }}
                    >
                      Apply Discount
                    </Button>
                  </>
                )}
              </div>

              {/* discount form */}
              <Dialog
                open={openDiscountPopup}
                onClose={handleDiscountPopupClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Apply Discount</DialogTitle>
                <DialogContent>
                  <Select
                    value={discount.type}
                    onChange={handleDiscountTypeChange}
                    fullWidth
                  >
                    <MenuItem value="Percentage">Percentage</MenuItem>
                    <MenuItem value="Fixed">Fixed</MenuItem>
                  </Select>
                  {discount.type === "Percentage" ? (
                    <TextField
                      margin="dense"
                      label="Discount Percentage"
                      name="percent"
                      value={discount.percent}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only digits between 0 and 100
                        if (/^\d{0,3}$/.test(value) && Number(value) <= 100) {
                          handleDiscountChange(e);
                        }
                      }}
                      fullWidth
                      inputProps={{ maxLength: 3 }}
                    />
                  ) : (
                    <TextField
                      margin="dense"
                      label="Discount Amount"
                      name="amount"
                      value={discount.amount}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow typing digits first, validation happens later
                        if (/^\d*$/.test(value)) {
                          // Calculate the total from the lineItem array and ensure totals are numbers
                          const totalLineItemAmount = lineItems.reduce(
                            (acc, item) => acc + parseFloat(item.total || 0), // Convert total to number
                            0
                          );
                          // Only apply the change if the discount amount is valid
                          if (Number(value) <= totalLineItemAmount) {
                            handleDiscountChange(e);
                          }
                        }
                      }}
                      fullWidth
                    />
                  )}
                </DialogContent>

                <DialogActions>
                  <Button onClick={handleDiscountPopupClose} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setOpenDiscountPopup(false);
                      calculateTotalAmount();
                    }}
                    color="primary"
                  >
                    Apply
                  </Button>
                </DialogActions>
              </Dialog>

              <div style={styles.row}>
                <Typography>Tax Type</Typography>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                    marginTop: "5px",
                  }}
                >
                  <Typography
                    style={{
                      marginRight: "29vw",
                      padding: 5,
                      fontSize: "15px",
                    }}
                  >
                    {state.taxRate}
                  </Typography>
                  <Grid item xs={6}>
                    <Autocomplete
                      sx={{
                        marginTop: "-16px",
                        width: 160,
                      }}
                      id="highlights-demo"
                      options={
                        taxList.map((item) => {
                          return {
                            id: item._id,
                            title: item.taxType,
                          };
                        }) || []
                      }
                      getOptionLabel={(option) => option.title || ""} // Safely access title
                      isOptionEqualToValue={(option, value) =>
                        value && value.id ? option.id === value.id : false
                      }
                      value={state.taxType}
                      onChange={(e, v) => {
                        const selectedDept = taxList.find(
                          (item) => item.taxType === v?.title
                        );
                        setState({
                          ...state,
                          taxType: v,
                          billTaxTypeID: selectedDept?._id || null,
                          taxRate: selectedDept?.taxRate || "",
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tax Type"
                          margin="normal"
                          variant="standard"
                          name="Tax type"
                          // error={!!errors.billProjectID} // Show error if it exists
                          // helperText={errors.billProjectID} // Display error message
                        />
                      )}
                    />

                    {/* <CustomInputAndSelectField
                    options={taxList?.map((item) => item.taxType)}
                    value={state.taxType}
                    changeCallBack={handleTaxTypeChange}
                    style={{ width: "100%" }}
                  /> */}
                  </Grid>
                </div>
              </div>
              <div style={styles.row}>
                <Typography>Total</Typography>
                <Typography
                  style={{
                    marginLeft: "10px",
                    borderRadius: 9,
                    background: "#bc3649",
                    // width: "75px",
                    padding: 5,
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "white",
                    marginLeft: "30px",
                    marginBottom: "20px",
                    marginTop: "10px",
                  }}
                >
                  ₹ {calculateTotalAmount()}
                </Typography>
              </div>
            </div>

            {/* Popup Form */}
            <Dialog open={openPopup} onClose={handlePopupClose}>
              <DialogTitle>Adjustment</DialogTitle>
              <DialogContent>
                <TextField
                  label="Description"
                  name="description"
                  value={adjustment.description}
                  onChange={handleAdjustmentChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Amount"
                  name="amount"
                  type="number"
                  value={adjustment.amount}
                  onChange={handleAdjustmentChange}
                  fullWidth
                  margin="normal"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handlePopupClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleAdjustmentSubmit} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>

            <Grid item xs={12}>
              Bill Note
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
              {/* <Editor
              label=""
              editorState={state.billNote}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              // value={state.country_description}
              onEditorStateChange={(e) =>
                setState({
                  ...state,
                  billNote: e,
                })
              }
            /> */}
            </Grid>
          </Paper>

          {!readOnly && (
            <>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
                onClick={handleUpdateInvoice}
              >
                Submit
              </Button>
            </>
          )}
        </div>
      </div>

      <Popup
        open={open}
        message={message}
        onClose={() => setOpen(false)}
        severity={severity} // You can change this to "error", "warning", etc.
      />
    </>
  );
}

export default InvoiceUpdate;
