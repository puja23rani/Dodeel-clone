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

import { useLocation, useNavigate } from "react-router-dom";
import { set } from "draft-js/lib/DefaultDraftBlockRenderMap";

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
    paper: {
      marginBottom: 20,
      border: "1px solid #ececec",
      borderRadius: "8px",
    },
    section: {
      padding: 50,
    },
  };
function CustomerView() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");
 // const navigate = useNavigate();
  
  

  
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");

 

  const location = useLocation();
  console.log(location)
  const { customerId } = location.state || {};

  
  const [state, setState] = useState({
    Id: "",
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

  useEffect(() => {
    table1();
  }, []);

  const table1 = () => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getCustomerById`,
        { id: customerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
       setState({
  Id: response.data.data._id,
  Company_Name: response.data.data.clientCompanyName,
  Customer_Name: response.data.data.clientName,
  Phone_Number: response.data.data.clientPhoneNumber,
  Email: response.data.data.clientEmail,
  ClientFromLead: response.data.data.clientFromLeadID?.value,
  ClientFromLead_Id: response.data.data.clientFromLeadID?.leadName,
  Employee_Id: response.data.data.clientCreatorID?.value,
  Employee_Name: response.data.data.clientCreatorID?.employeeName,
  Billing_Address: response.data.data.clientBillingAddress,
  Shipping_Address: response.data.data.clientShippingAddress,
  Status: response.data.data.clientStatus,
  Description: (() => {
    const description = response.data.data.clientDescription;

    try {
      // Try to parse the description if it's a stringified JSON
      const parsedDescription = JSON.parse(description);

      // Check if it's in the expected format with "blocks"
      if (parsedDescription.blocks && Array.isArray(parsedDescription.blocks)) {
        return parsedDescription.blocks
          .map(block => block.text.trim())  // Extract text and trim spaces
          .filter(text => text.length > 0) // Remove empty text entries
          .join(' ');                      // Join non-empty texts
      }
    } catch (err) {
      
      // If parsing fails, assume it's a normal string and return it as is
      return description;
    }

    return description; // Return the description as is if not in expected format
  })(),
});



        } else {
          setMessage(response.data.message);
          setSeverity("error");
          setOpen(true);
        }
      })
      .catch((error) => {
       setMessage("Something went wrong"); 
       setSeverity("error");
       setOpen(true);
      });
  };

  // Function to split the address into two parts
  const splitAddress = (address) => {
    const segments = address?.split(", ");
    const firstPart = segments?.slice(0, 2)?.join(", ");
    const secondPart = segments?.slice(2)?.join(", ");
    return [firstPart, secondPart];
  };

  const [billingFirstPart, billingSecondPart] = splitAddress(state.Billing_Address);
  const [shippingFirstPart, shippingSecondPart] = splitAddress(state.Shipping_Address);

  const handleClose = () => {
    setOpen(false);
  };
  // Delete a section by index
  console.log(state,"state")
  return (
    <>
      <div className={classes.container}>
      
      <div className={classes.contentSection}>
        <div
          className={classes.contentHead}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          
          
        </div>
        <Divider className={classes.divider} />
        <Paper style={styles.paper} id="Cuatomer-content">
          <div style={styles.section}>
            <div style={{textAlign:"center"}}>
              <Typography style={{ fontWeight: "bold", fontSize: "15px" ,color: "#30ccde" }}>
                Customer Name: 
              </Typography>
              <Typography style={{ fontSize: "20px" , fontWeight:"bold" }}>
                {state.Customer_Name}
              </Typography>
            </div>
          </div>
          <div style={styles.section}>
            <div>
              <Typography style={{ fontWeight: "bold", fontSize: "20px", color:"#30ccde" }}>
                {state.Company_Name}
              </Typography>
            </div>
            <div>
              <Typography style={{ marginTop: 15 }}>
                 PhoneNumber: {state.Phone_Number}
              </Typography>
              <Typography style={{ marginTop: 15 }}>
                 Email: {state.Email}
              </Typography>
            </div>
            <Divider className={classes.divider} />
            <div 
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 30,
              }}
            >
              <div>
                <div>
                  <Typography style={{fontWeight: "bold", fontSize: "17px"}}>Billing Address: </Typography>
                </div>
                <div>
                  <Typography>{billingFirstPart}</Typography>
                  <Typography>{billingSecondPart}</Typography>
                </div>
              </div>
              <div>
                <div>
                  <Typography style={{fontWeight: "bold", fontSize: "17px"}}>Shipping Address: </Typography>
                </div>
                <div>
                  <Typography>{shippingFirstPart}</Typography>
                  <Typography>{shippingSecondPart}</Typography>
                </div>
              </div>
            </div>
          </div>
          <Divider className={classes.divider} />
          <div style={styles.section}>
            <Grid
              item
              xs={12}
              style={{
                paddingBottom: 30,
              }}
            >
              <Typography variant="subtitle1" style={{ marginBottom: 5,fontSize: "20px" ,fontWeight: "bold",}}>
                Notes
              </Typography>
              <Typography variant="body1" style={{ marginTop: 10 }}>
                {state.Description}
              </Typography>
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

export default CustomerView;
