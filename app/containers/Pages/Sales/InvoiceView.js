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
  Divider,
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
import { convertFromRaw, EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { useLocation, useNavigate } from "react-router-dom";
import { stateToHTML } from "draft-js-export-html";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
      margin: "10px 24px",
      height: 1,
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
      // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #ececec",
      borderRadius: "8px",
    },
    gridContainer: {
      marginTop: 10,
      marginBottom: 20,
    },
    gridItem: {
      padding: 5,
    },
    container1: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "16px", // Space between grid items
      marginBottom: "16px", // Space below each row
    },
    item1: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };
function InvoiceView() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
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

  
  const location = useLocation();
  const { InvoiceID } = location.state || {};
 
  const [mainlist, setMainList] = useState({
    billNote: EditorState.createEmpty()
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
      console.log(actualData);
      if (actualData && actualData.data && actualData.data.contactDetail) {
        setMainList({
          bill_ID: actualData.data.bill_ID,
          billStatus: actualData.data.billStatus,
          billCreatorID: actualData.data.billCreatorID,
          billCreatorName: actualData.data.billCreatorName,
          companyAddress: actualData.data.companyAddress,
          contactDetail: {
            companyName: actualData.data.contactDetail.companyName,
            contactNumber: actualData.data.contactDetail.contactNumber,
            emailAddress: actualData.data.contactDetail.emailAddress,
            address: actualData.data.contactDetail.address,
          },
          billCustomerID: actualData.data.billCustomerID,
          billCustomerName: actualData.data.billCustomerName,
          customerEmail: actualData.data.customerEmail,
          billingAddress: actualData.data.billingAddress,
          shippingAddress: actualData.data.shippingAddress,
          billProjectID: actualData.data.billProjectID,
          billProjectTitle: actualData.data.billProjectTitle,
          invoiceDate: actualData.data.invoiceDate,
          billDueDate: actualData.data.billDueDate,
          billSentDate: actualData.data.billSentDate,
          newLine: actualData.data.newLine.map((line) => ({
            description: line.description,
            quantity: line.quantity,
            unit: line.unit,
            rate: line.rate,
          })),
          billSubTotal: actualData.data.billSubTotal,
          discountType: actualData.data.discountType,
          billDiscountPercentage: actualData.data.billDiscountPercentage,
          billDiscountAmount: actualData.data.billDiscountAmount,
          billFixedAmount: actualData.data.billFixedAmount,
          billTaxTypeID: actualData.data.billTaxTypeID,
          TaxRate: actualData.data.TaxRate,
          billTaxTypeName: actualData.data.billTaxTypeName,
          billTaxTotalAmount: actualData.data.billTaxTotalAmount,
          billAdjustmentAmount: actualData.data.billAdjustmentAmount,
          billAdjustmentDescription: actualData.data.billAdjustmentDescription,
          billTotalAmount: actualData.data.billTotalAmount,
          billPaidAmount: actualData.data.billPaidAmount,
          billDueAmount: actualData.data.billDueAmount,
          billNote: stateToHTML(
            convertFromRaw(JSON.parse(actualData.data.billNote))
          ),
          billTerms: actualData.data.billTerms,
        });
      }
      console.log(actualData);
    } catch (err) {
      console.log(err);
    }
  };
  console.log("mainlist", mainlist);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await table();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  console.log(InvoiceID);
  console.log("mainlisttview", mainlist);

  const generatePDF = () => {
    const input = document.getElementById("invoice-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`invoice_${mainlist.bill_ID}.pdf`);
    });
  };

  const getTextFromBillNote = (billNote) => {
    try {
      const parsedNote = JSON.parse(billNote);
      return EditorState.createWithContent(
        convertFromRaw(parsedNote)
      )
      // return parsedNote?.blocks || "";
    } catch (error) {
      console.error("Error parsing billNote:", error);
      return "";
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div className={classes.container}>
 
      <div className={classes.contentSection}>
        
        <div style={{display:"flex", justifyContent:"flex-end"}}>
            <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: "10px" }}
          onClick={generatePDF}
        >
          Download PDF
        </Button></div>
        
        <Paper  id="invoice-content">
          <div style={styles.row}>
            <div style={styles.section}>
              <Typography variant="h5" color="grey">
                INVOICE
              </Typography>
              <Typography>{mainlist.bill_ID}</Typography>
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
            <div style={styles.section}>
              <Typography
                style={{
                  color: "#239ED0",
                  fontSize: "25px",
                  fontWeight: "bold",
                }}
              >
                {mainlist.contactDetail?.companyName || "Loading..."}
              </Typography>
              <Typography style={{ fontSize: "17px" }}>
                {mainlist.contactDetail?.emailAddress || "Loading..."}
              </Typography>
              <Typography style={{ fontSize: "17px" }}>
                {mainlist.contactDetail?.contactNumber || "Loading..."}
              </Typography>
              <Typography style={{ fontSize: "17px" }}>
                {mainlist?.contactDetail?.address
                  .split(",")
                  .slice(0, 2)
                  .join(",") || "Loading..."}
              </Typography>
              <Typography style={{ fontSize: "17px" }}>
                {mainlist?.contactDetail?.address
                  .split(",")
                  .slice(2)
                  .join(",") || "Loading..."}
              </Typography>
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
                  {mainlist?.billingAddress?.split(",")?.slice(0, 2)?.join(",")}
                </Typography>
                <Typography style={{ fontSize: "15px" }}>
                  {mainlist?.billingAddress?.split(",")?.slice(2, 4)?.join(",")}
                </Typography>
                <Typography style={{ fontSize: "15px" }}>
                  {mainlist?.billingAddress?.split(",")?.slice(4)?.join(",")}
                </Typography>
              </div>
            </div>
          </div>

          <div style={styles.row}>
            <div style={{ gap: "40px" }}>
              <div style={styles.section}>
                <Typography style={{ fontWeight: "bold" }}>
                  Billing dates
                </Typography>
                <Typography style={{ color: "grey" }}>
                  Invoice date: {mainlist.invoiceDate?.slice(0, 10)}
                </Typography>
                <Typography style={{ color: "grey" }}>
                  Bill Due date: {mainlist.billDueDate?.slice(0, 10)}
                </Typography>
              </div>
            </div>
            <div >
            <div style={styles.section}>
            <Typography style={{marginBottom:"15px"}}>
                <span style={{ fontWeight: "bold" }}>Payment: </span>
                <span
                  style={{
                    background: "#63de76",
                    borderRadius: 9,
                    width: "fit-content",
                    fontWeight: "bold",
                    padding: 12,
                    fontSize: "18px",
                    // color: "#45af56",
                    color:"white"
                  }}
                >
                   {mainlist.billPaidAmount}
                </span>
                
              </Typography>

              <Typography>
                <span style={{ fontWeight: "bold" }}>Balance Due: </span>
                <span
                  style={{
                    // background: "#EBA487",
                    // borderRadius: 9,
                    width: "fit-content",
                    fontWeight: "bold",
                    padding: 12,
                    fontSize: "20px",
                    color: "#b9152c",
                  }}
                >
                  {mainlist.billDueAmount}
                </span>
              </Typography>
            </div>
            </div>
          </div>

          <div style={{ marginTop: 50 }}>
            <div style={styles.container1}>
              <div style={styles.item1}>
                <Typography variant="h6">Description</Typography>
              </div>
              <div style={styles.item1}>
                <Typography variant="h6">Qty</Typography>
              </div>
              <div style={styles.item1}>
                <Typography variant="h6">Unit</Typography>
              </div>
              <div style={styles.item1}>
                <Typography variant="h6">Rate</Typography>
              </div>
              <div style={styles.item1}>
                <Typography variant="h6">Total</Typography>
              </div>
            </div>
          </div>

          <div style={styles.line}></div>

          <div>
            {mainlist.newLine &&
              mainlist.newLine.map((line, index) => (
                <div key={index} style={styles.container1}>
                  <div style={styles.item1}>
                    <Typography>{line.description}</Typography>
                  </div>
                  <div style={styles.item1}>
                    <Typography>{line.quantity}</Typography>
                  </div>
                  <div style={styles.item1}>
                    <Typography>{line.unit}</Typography>
                  </div>
                  <div style={styles.item1}>
                    <Typography>{line.rate}</Typography>
                  </div>
                  <div style={styles.item1}>
                    <Typography>
                      {(line.quantity * line.rate).toFixed(2)}
                    </Typography>
                  </div>
                </div>
              ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                height: "2px",
                backgroundColor: "red",
                width: "203px",
                // marginBottom: "10px",
                // marginRight: "-5vw",
              }}
            ></div>
            <div style={{ marginRight: "5px", gap: "10px" }}>
              {/* Sub Total */}
              {mainlist.billSubTotal && (
                <p style={{ marginTop: "10px", marginLeft: "-187px" }}>
                  <span style={{ marginRight: "2px" }}>Sub Total:</span>
                  <span>{mainlist.billSubTotal}</span>
                </p>
              )}

              {/* Discount */}
              {(mainlist.billDiscountPercentage > 0 ||
                mainlist.billDiscountAmount > 0) && (
                <p style={{ marginTop: "10px", marginLeft: "-187px" }}>
                  <span>Discount:</span>
                  <span style={{ marginLeft: "10px" }}>
                    {mainlist.billDiscountPercentage > 0
                      ? mainlist.billDiscountPercentage + "%"
                      : mainlist.billDiscountAmount > 0
                      ? mainlist.billDiscountAmount
                      : ""}
                  </span>
                </p>
              )}

              {/* Adjustment */}
              {mainlist.billAdjustmentAmount > 0 && (
                <p style={{ marginTop: "10px", marginLeft: "-187px" }}>
                  <span>Adjustment:</span>
                  <span style={{ marginLeft: "10px" }}>
                    {mainlist.billAdjustmentAmount}
                  </span>
                </p>
              )}

              {/* Tax Rate */}
              {mainlist.TaxRate && mainlist.TaxRate !== "Not Found" && (
                <p style={{ marginTop: "10px", marginLeft: "-187px" }}>
                  <span>Tax Rate:</span>
                  <span style={{ marginLeft: "10px" }}>{mainlist.TaxRate}</span>
                </p>
              )}

              {/* All Total */}
              <p style={{ marginTop: "10px", marginLeft: "-187px" }}>
                <span style={{ fontWeight: "bold" }}>All Total:</span>
                <span
                  style={{
                    marginLeft: "10px",
                    color: "#b9152c",
                    fontWeight: "bold",
                  }}
                >
                  {mainlist.billTotalAmount}
                </span>
              </p>
            </div>
          </div>

          <div style={styles.section}>
            {/* <p
              style={{
                fontWeight: "bold",
                marginBottom: "10px",
                backgroundColor: "transparent",
                fontSize: "17px",
              }}
            >
              Invoice Terms
            </p>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  color: "grey",
                  backgroundColor: "transparent",
                  fontSize: "17px",
                }}
              >
                {getTextFromBillNote(mainlist.billNote)}
              </p>
            </div> */}
            <Grid item xs={12}>
           <p style={{fontWeight: "bold", marginBottom: "10px", backgroundColor: "transparent", fontSize: "17px"}}>Bill Note :</p> 
            <p dangerouslySetInnerHTML={{ __html: mainlist.billNote}} />

           {/* {mainlist.billNote} */}
            {/* <Editor
              label=""
              editorState={mainlist.billNote}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              // value={state.country_description}
              // onEditorStateChange={(e) =>
              //   setState({
              //     ...state,
              //     billNote: e,
              //   })
              // }
            /> */}
          </Grid>
          </div>
        </Paper>
      </div>
    </div>
    
      <Popup
        open={open}
        message={message}
        onClose={handleClose}
        severity={severity} // You can change this to "error", "warning", etc.
      />
    </>
  );
}

export default InvoiceView;
