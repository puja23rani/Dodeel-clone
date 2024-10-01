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
    // margin: 10,
    padding: 50,
  },
  line: {
    // margin: "10px 0",
    height: 2,
    backgroundColor: "#000",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  paper: {
    // padding: 20,
    marginBottom: 20,
    border: "1px solid #ececec",
    borderRadius: "8px",
    border: "1px solid #ececec",
  },
  newLine: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    alignItems: "center",
  },
};
function ProposaView() {
  const { classes } = useStyles();
  const location = useLocation();
  const { updateId } = location.state || {};

  const token = localStorage.getItem("token");
  const [list, setList] = useState([]);
  const [visalist, setVisalist] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [proposalList, setProposalList] = React.useState([]);
  const [proposalTempList, setProposalTempList] = React.useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [Invoicelist, setInvoiceList] = useState({});
  const [lineItems, setLineItems] = useState([]); // New state for line items
  const [validationErrors, setValidationErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [newProposal, setNewProposal] = useState({});
  const [state, setState] = useState({
    Id: "",
    proposalClientType: "Lead",
    Customer_Name_And_Lead_Name: "",
    Customer_Id_And_Lead_Id: "",
    contactList: {},
    Employee_Id: "",
    Employee_Name: "",
    Template_Name: "",
    Template_Id: "",
    Proposal_Title: "",
    Proposal_Date: "",
    Valid_Untill: "",
    Notes: EditorState.createEmpty(),
    searchText: "",
    isUpdate: false,
  });
  console.log(updateId);
  const table1 = () => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getProposalById`,
        {
          id: updateId,
        },
        {
          headers: {
            /* Your headers here */
            "Content-Type": "application/json", // Example header
            Authorization: `Bearer ${token}`, // Example authorization header
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setState({
            Id: response.data.data._id,
            proposalClientType: response.data.data.proposalClientType,
            contactList: {
              companyName: response.data.data.contactDetail.companyName,
              contactNumber: response.data.data.contactDetail.contactNumber,
              emailAddress: response.data.data.contactDetail.emailAddress,
              address: response.data.data.contactDetail.address,
            },
            Customer_Id_And_Lead_Id: response.data.data.proposalClientID,
            Customer_Name_And_Lead_Name: response.data.data.proposalClientName,
            // Employee_Id: response.data.data.proposalCreatorID,
            Employee_Name: response.data.data.proposalCreatorName,
            Template_Id: response.data.data.templateID,
            Proposal_Title: response.data.data.proposalTitle,
            Proposal_Date: response.data.data.proposalPublishDate.slice(0, 10),
            Valid_Untill: response.data.data.proposalEndDate.slice(0, 10),
            Status: response.data.data.proposalStatus,
            Notes: EditorState.createWithContent(
              convertFromRaw(JSON.parse(response.data.data.proposalNotes))
            ),
          });
          console.log(response);
          console.log(state);
        } else {
          toast.error("Failed to save. Please try again.", {
            position: "top-center",
          });
        }
      })

      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("An error occurred. Please try again.", {
          position: "top-center",
        });
      });
  };

  // const table1 = () => {
  //       axios
  //           .get(`${process.env.REACT_APP_BACKEND_URL}api/auth/getAllProposals`, {
  //               headers: {
  //                   Authorization: `Bearer ${token}`,
  //               },
  //           })
  //           .then((response) => {
  //               // Handle the response
  //               if (response.data.data) {
  //                   setProposalList(response.data.data);
  //               }
  //               console.log(response.data.data);
  //           })
  //           .catch((error) => {
  //               // Handle errors
  //               console.error("Error fetching data:", error);
  //           });
  //   }
  const [employeeList, setEmployeeList] = React.useState([]);
  function table() {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/getEmployeeDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle the response
        setEmployeeList(response.data.employees);
        console.log(response.data.employees);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }
  React.useEffect(() => {
    table();
    table1();
    // table2();
  }, []);

  console.log(state);

  const generatePDF = () => {
    const input = document.getElementById("Proposal-content");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210; // PDF width in mm
      const pageHeight = 295; // PDF page height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height proportional to width
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("Proposal.pdf");
    });
  };

  //   const generatePDF = () => {
  //     const input = document.getElementById("Proposal-content");

  //     // Ensure all images are loaded before capturing the content
  //     const images = input.querySelectorAll("img");
  //     let imagesLoaded = 0;

  //     images.forEach((img) => {
  //         if (img.complete) {
  //             imagesLoaded++;
  //         } else {
  //             img.addEventListener("load", () => {
  //                 imagesLoaded++;
  //                 if (imagesLoaded === images.length) {
  //                     captureAndGeneratePDF(input);
  //                 }
  //             });
  //         }
  //     });

  //     if (imagesLoaded === images.length) {
  //         captureAndGeneratePDF(input);
  //     }
  // };

  // const captureAndGeneratePDF = (input) => {
  //     html2canvas(input, {
  //         allowTaint: true,
  //         useCORS: true
  //     }).then((canvas) => {
  //         const imgData = canvas.toDataURL("image/png");
  //         const pdf = new jsPDF('p', 'mm', 'a4');
  //         const imgWidth = 210; // A4 width in mm
  //         const pageHeight = 295; // A4 height in mm
  //         const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //         let heightLeft = imgHeight;

  //         let position = 0;

  //         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //         heightLeft -= pageHeight;

  //         while (heightLeft >= 0) {
  //             position = heightLeft - imgHeight;
  //             pdf.addPage();
  //             pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //             heightLeft -= pageHeight;
  //         }
  //         pdf.save("Proposal.pdf");
  //     });
  // };

  // const handleDateChange = (date) => {
  //   setInvoiceDate(date);
  // };

  // const formatDateForAPI = (date) => {
  //   return date.toISOString().split("T")[0];
  // };

  const handleSubmit = async () => {
    // try {
    //   const formattedDate = formatDateForAPI(invoiceDate);
    //   const data = {
    //     ...proposalList,
    //     invoiceDate: formattedDate,
    //     billDueDate: formattedDate,
    //     lineItems, // Add line items to the data
    //     Description: state.Description,
    //   };
    //   // Send data to the API
    // console.log(data);
    // } catch (err) {
    //   console.log(err);
    // }
  };
  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };
  const handleUpdate = () => {
    setState({
      ...state,
      updateId: selectedEmployee,
    });

    console.log(state);
    handleDialogOpen();
  };

  const handleUpdateProposal = () => {
    const requestData = {
      id: state.Id,
      // proposalClientType: state.proposalClientType,
      // proposalClientID: state.Customer_Id_And_Lead_Id,
      proposalClientName: state.Customer_Name_And_Lead_Name,
      contactDetail: state.contactList,
      templateID: state.Template_Id,
      proposalTitle: state.Proposal_Title,
      proposalPublishDate: state.Proposal_Date.slice(0, 10),
      proposalEndDate: state.Valid_Untill.slice(0, 10),
      proposalViewed: state.Proposal_Viewed,
      proposalStatus: state.Status,
      proposalNotes: JSON.stringify(
        convertToRaw(state.Notes.getCurrentContent())
      ),
    };
    console.log(requestData);

    if (state.Photos == "") {
      toast.error("Give atleast a single photo", {
        position: "top-center",
      });
    } else {
      axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/updateProposal`,
          requestData,

          {
            headers: {
              /* Your headers here */
              "Content-Type": "application/json", // Example header
              Authorization: `Bearer ${token}`, // Example authorization header
            },
          }
        )
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            // Assuming table() refreshes or updates the UI
            table1();
            setState({
              proposalClientType: "",
              Employee_Name: "",
              Employee_Id: "",
              Proposal_Title: "",
              Proposal_Date: "",
              Valid_Untill: "",
              Proposal_Viewed: "",
              Status: "",
              Notes: EditorState.createEmpty(),
              searchText: "",
              isUpdate: false,
            });
            toast.success("Updated successfully!", {
              position: "top-center",
            });
          } else {
            toast.error("Failed to save. Please try again.", {
              position: "top-center",
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error("An error occurred. Please try again.", {
            position: "top-center",
          });
        });
    }
  };

  const handleFormUpdate = (e) => {
    e.preventDefault();
    // Implement form submission logic here
    console.log("Form Updated", newProposal);
    handleDialogClose();
    handleUpdateProposal();
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic here
    console.log("Form Updated", newProposal);
    handleDialogClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDeleteLine = (id) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  // const formattedDate = Proposal_Date
  //   ? proposalPublishDate.toISOString().split("T")[0]
  //   : "";
  // const formattedDate = Valid_Untill
  //   ? proposalEndDate.toISOString().split("T")[0]
  //   : "";

  // Here is your solution for calculating the subtotal
  // const calculateSubtotal = () => {
  //   return lineItems
  //     .reduce((acc, item) => acc + parseFloat(item.total || 0), 0)
  //     .toFixed(2);
  // };

  console.log(state);

  return (
    <>
      <div className={classes.container}>
        <div className={classes.contentSection}>
         
          <Button
            variant="contained"
            color="primary"
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
            onClick={generatePDF}
          >
            Download PDF
          </Button>
          <Divider className={classes.divider} />

          <Paper style={styles.paper} id="Proposal-content">
            <div
              style={{
                backgroundColor: "#9898b6",
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              <div style={styles.section}>
                <Typography variant="h4" color="white" style={{ fontSize: 30 }}>
                  Proposal
                </Typography>
                <Typography
                  variant="h4"
                  color="white"
                  style={{ fontSize: 20, justifyContent: "center" }}
                >
                  {state.Proposal_Title}
                </Typography>
              </div>
            </div>

            {/* <div style={styles.line}></div> */}

            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingLeft: 30,
                  paddingRight: 46,
                  paddingTop: 30,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    style={{
                      fontWeight: "bold",
                      color: "#239ED0",
                      fontSize: "25px",
                    }}
                  >
                    {state.contactList?.companyName || "Loading..."}
                  </Typography>
                  <Typography style={{ fontSize: "15px" }}>
                    {state.contactList?.emailAddress || "Loading..."}
                  </Typography>
                  <Typography style={{ fontSize: "15px" }}>
                    {state.contactList?.contactNumber || "Loading..."}
                  </Typography>
                  <Typography style={{ fontSize: "15px" }}>
                    {state?.contactList?.address
                      ?.split(",")
                      .slice(0, 2)
                      .join(",") || "Loading..."}
                  </Typography>
                  <Typography style={{ fontSize: "15px" }}>
                    {state?.contactList?.address
                      ?.split(",")
                      .slice(2)
                      .join(",") || "Loading..."}
                  </Typography>
                </div>
                <div>
                  <Typography style={{ fontWeight: "bold", fontSize: "20px" }}>
                    Customer
                  </Typography>
                  <Typography style={{ fontSize: "20px" }}>
                    {state.Customer_Name_And_Lead_Name}
                  </Typography>
                </div>
              </div>
              <Divider className={classes.divider} style={{ marginTop: 100 }} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingLeft: 30,
                  paddingRight: 46,
                  paddingTop: 30,
                }}
              >
                <div>
                  <Typography style={{ marginTop: 15 }}>
                    Proposal Date: {state.Proposal_Date.slice(0, 10)}
                  </Typography>
                  <Typography style={{ marginTop: 15 }}>
                    Valid Untill: {state.Valid_Untill.slice(0, 10)}
                  </Typography>
                </div>

                <div>
                  <Typography>Prepaired By: {state.Employee_Name}</Typography>
                  <Typography
                    style={{
                      color: "#239ED0",
                      fontWeight: "bold",
                      marginTop: 15,
                      fontSize: "25px",
                    }}
                  >
                    {state.Status}
                  </Typography>
                </div>
              </div>
            </div>

            <Divider className={classes.divider} />

            {/* <Grid
            item
            xs={12}
            style={{
              marginLeft: 30,
              marginRight: 30,
              marginTop: 10,
              paddingBottom: 30,
            }}
          >
            <Typography variant="subtitle1" style={{ marginBottom: 5 }}>
              Notes
            </Typography>
            <Typography variant="body1" style={{ marginTop: 10 }}>
              {state.Notes.getCurrentContent().getPlainText()}
            </Typography>
          </Grid> */}
            <Grid
              item
              xs={12}
              style={{
                marginLeft: 30,
                marginRight: 30,
                marginTop: 10,
                paddingBottom: 30,
              }}
            >
              Notes
              <Editor label="" editorState={state.Notes} toolbarHidden />
            </Grid>
          </Paper>

          {/* <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
          onClick={() => navigate("/Proposal_Details")}
        >
          Cancel
        </Button>
        {/* <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "10px", marginLeft: 10 }}
          onClick={() => navigate("/Proposal_Details")}
          type="Submit"
        >
          Submit
        </Button> */}
          {/* <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "10px", marginLeft: 10 }}
          onClick={handleUpdate}
        >
          Update
        </Button> */}
        </div>
      </div>

      {/* <Popup
        open={open}
        message={message}
        onClose={handleClose}
        severity={severity} // You can change this to "error", "warning", etc.
      /> */}
    </>
  );
}

export default ProposaView;
