import React, { useState, useEffect } from "react";
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
import TablePlayground from "../../Tables/TablePlayground";
import AlertDialog from "../../UiElements/demos/DialogModal/AlertDialog";
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import Popup from "../../../components/Popup/Popup";
import { Chip, Dialog, DialogActions, DialogTitle, Paper, Toolbar, Tooltip, Typography } from "@mui/material";
import { DialogContent } from "@mui/material";
import { Close as CloseIcon, Visibility } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { convertFromRaw, EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import InfoIcon from '@mui/icons-material/Info';
import { Navigate, useNavigate } from "react-router-dom";




const useStyles = makeStyles()((theme) => ({
  textEditor: {
    // optional padding for better spacing
    padding: "5px",
    backgroundColor: "#ececec",
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

function Requirement() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");
  // const defaultData = {
  //   Status: "",
  //   Description: "",
  // };

  const [errors, setErrors] = useState({
    End_Date: "",
    fieldSets: [
      {
        productType: "",
        quantity: "",
       
      }, ],
    remark: "",
    
  });
  console.log(errors)

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.End_Date) {
      errors.End_Date = "End Date is required";
      isValid = false;
    }
    if (!state.remark) {
      errors.remark = "Remark is required";
      isValid = false;
    }
    // if (!state.productName) {
    //   errors.productName = "Product Name is required";
    //   isValid = false;
    // }
    // if (!state.Quantity) {
    //   errors.Quantity = "Quantity is required";
    //   isValid = false;
    // }
    state.fieldSets.forEach((item, index) => {
      if (!item.productType) {
        errors[`fieldsetsproductType${index}`] = "Field name is required";
        isValid = false;
      }
      if (!item.quantity) {
        errors[`fieldsetsquantity${index}`] = "Field value is required";
        isValid = false;
      }
    });
    

    setErrors(errors);
    console.log(isValid)
    
    return isValid;
  };
 


  const [state, setState] = useState({
   
    remark:  EditorState.createEmpty(), 
    End_Date: "",
    searchText: "",
    isUpdate: false,
    fieldSets: [
      {
        productType: "",
        quantity: "",
       
      }, // Initial set
    ],
    remark: "",
  });
  const [rowdata, setRowdata] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [pagination, setPagination] = useState(false);
  const [length, setLength] = useState(0);
  const navigate = useNavigate();
  
    
   
    const [dataEditorState, setEditorState] = useState();
  
    const onEditorStateChange = editorStateParam => {
      setEditorState(editorStateParam);
    };
  
  

  const columnData = [
    {
      id: "slNo",
      numeric: true,
      disablePadding: false,
      label: "Sl No",
    },
    {
      id: "requireID",
      numeric: false,
      disablePadding: false,
      label: "Requirement ID",
    },
    {
      id: "startDate",
      numeric: false,
      disablePadding: false,
      label: "Start Date",
    },
    {
      id: "endDate",
      numeric: false,
      disablePadding: false,
      label: "Closing Date",
    },
    {
      id: "requireStatus",
      numeric: false,
      disablePadding: false,
      label: "Status",
    },
    

    { id: "actions", label: "Action" },
  ];

  // useEffect(() => {
    
  //   table1();
  // }, []);

  const [productList, setProductList] = React.useState([]);
  function prod_table() {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/auth/getAllProducts`, {
        headers: {
          Authorization: ` Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle the response
        if (response.data.productDetails) {
          setProductList(response.data.productDetails);
        }
        console.log(response.data.productDetails);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }
  const transformData = (obj) => {
    console.log(obj)
    if (state.isUpdate) {
      return {
        id: itemToDelete,
        closeDate: obj.End_Date,
        productDetails: obj.fieldSets.map((item) => ({
          productType: item.productType,
          quantity: parseInt(item.quantity, 10),
        })),
        
        description: obj.remark && JSON.stringify(
          convertToRaw(obj.remark.getCurrentContent())
        ),
        // description: obj.remark || "new request",
      };
    } else {
      return {
        closeDate: obj.End_Date,
        productDetails: obj.fieldSets.map((item) => ({
          productType: item.productType,
          quantity: parseInt(item.quantity, 10),
        })),
        description: obj.remark && JSON.stringify(
            convertToRaw(obj.remark.getCurrentContent())
          ),
        // description: JSON.stringify(
        //   convertToRaw(obj.remark.getCurrentContent())
        // ),
      };
    }
  };

  const handleFieldChange = (index, field, value) => {
    const newFieldSets = [...state.fieldSets];
    newFieldSets[index][field] = value;
    setState({ ...state, fieldSets: newFieldSets });
  };

  useEffect(() => {
    prod_table();
  }, []);

  
    function fetchRequirement() {
      axios
        .get(
   
      `${process.env.REACT_APP_BASE_URL}/api/auth/getallrequirements`,
      {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.requirements) {

          setRowdata(
            response.data.requirements.map((item) => ({
              slNo: response.data.requirements.indexOf(item) + 1,
              id: item._id,
              requireID: item.requireID,
              startDate: item.startDate.slice(0, 10),
              endDate: item.closeDate.slice(0, 10),
              requireStatus: item.requireStatus ,
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
                        id: item._id,
                        End_Date: item.closeDate.slice(0, 10),
                        remark: item.description,
                        fieldSets: item.productDetails.map((product) => ({
                          quantity: product.quantity,
                          productName: product.productName,
                          productType: product.productType, // Assuming productType is the product ID
                        })),

                       
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
                  {/* <IconButton
                    aria-label="Delete"
                    onClick={(e) => {
                      navigate("/app/quotation", {
                        state: { jobID: item._id },
                      });
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    onClick={(e) => {
                      navigate("/app/jobview", {
                        state: {
                          jobID: item,

                         
                        },
                      });
                    }}
                  >
                    <Visibility />
                  </IconButton> */}
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

  useEffect(() => {
    fetchRequirement();
  }, []);

  const handleSaveRequirement = () => {
  //   if (!validate()) {
  //     setMessage("Please fill all required fields");
  //     setOpen(true);
  //     setSeverity("warning");
  //     console.log("handleSaveRequirement")

  //     return;
  //   }
  //  else {
    console.log("handleSaveRequirement")

    const data = transformData(state);
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/auth/createnewrequirement`,{
            data
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
          if (response.status == 200) {
            // Assuming table() refreshes or updates the UI
            fetchRequirement();
            window.scrollTo({
              top: 400,
              behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
            });
            setState({
              ...state,
              End_Date: "",
              remark: "",
              
                fieldSets: [
                  {
                    productType: "",
                    quantity: "",
                   
                  }, // Initial set
              ],
              
              isUpdate: false, // Set isUpdate to false
            });
            setMessage("Created Sucessfully!");
            setOpen(true);
            setSeverity("success");
            setOpenDialog(false);

          } else {
            setMessage(result.message);
            setOpen(true);
            setSeverity("error");
          }
        })
        .catch((error) => {
          setMessage(err.message);
          setOpen(true);
          setSeverity("error");
        });
    // }
  };


  const handleRequirementDelete = async () => {
    try {
      const data = { id: itemToDelete };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleterequirement`,
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
        fetchRequirement();
        setMessage("Deleted successfully!");
        setOpen(true);
        setSeverity("success");
      } else {
        setMessage(actualData.message);
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
  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const handleUpdateRequirement = () => {
    const requestData = 
     transformData(state);
   
    console.log(requestData);

    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    } else {
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL}/api/auth/updaterequirement`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            // Refresh the list of interviewers
            fetchRequirement();

            // Scroll smoothly to the top
            window.scrollTo({
              top: 400,
              behavior: "smooth",
            });

            // Clear the form fields and reset isUpdate to false
            setState({
              ...state,
              End_Date: "",
              remark: "",
              
                fieldSets: [
                  {
                    productType: "",
                    quantity: "",
                   
                  }, // Initial set
              ],
              id: "", // Reset the id
              isUpdate: false, // Set isUpdate to false
            });

            // Set success message and show notification
            setMessage("Updated successfully!");
            setOpen(true);
            setSeverity("success");
            setOpenDialog(false);
          } else {
            setMessage(response.data.message);
            setOpen(true);
            setSeverity("error");
          }
        })
        .catch((error) => {
          setMessage(error.message);
          setOpen(true);
          setSeverity("error");
        });
    }
  };




  console.log(state)

const handleAddMoreFields = () => {
  // setState({
  //   ...state,
  //   fieldSets: [...state.fieldSets, { name: "", value: "" }],
  // });
  setState((prevState) => ({
    ...prevState,
    fieldSets: [
      ...prevState.fieldSets,
      {
        Quantity: "",
        productName: "",
        productType: "",
        
      },
    ],
  }));
};

const handleDeleteFieldSet = (index) => {
  setState((prevState) => ({
    ...prevState,
    fieldSets: prevState.fieldSets.filter((_, i) => i !== index),
  }));
  // setState({
  //   ...state,
  //   fieldSets: state.fieldSets.filter((_, index) => index !== idx),
  // });
};


const handlePageChange = (event, newPage) => {
  setPage(newPage); // Update the current page
};

// Handle rows per page change
const handleRowsPerPageChange = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10)); // Update the rows per page
  setPage(0); // Reset to first page
};

const handleClear=()=>{
 
    setState({
      End_Date: "",
      fieldSets: [
        {
          productType: "",
          quantity: "",
         
        }, ],
    remark: "",
    
      isUpdate: false,
    });
    setErrors({
      End_Date: "",
      fieldSets: [
        {
          productType: "",
          quantity: "",
         
        }, ],
    remark: "",
    
    })
    setOpenDialog(false);
  
}

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
                <AddIcon /> Create Requirement
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
      open={openDialog}
      onClose={handleClear}
      maxWidth="md"
      fullWidth
    >
      {/* Dialog Title with Close Button */}
      <DialogTitle>
        Create Requirement
        <IconButton
          aria-label="close"
          onClick={handleClear}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent>
  <Grid container spacing={2}>
    {/* Closing Date Field */}
    
    <Grid item xs={12}>
      <TextField
        id="date"
        label="Closing Date"
        type="date"
        variant="standard"
        fullWidth
        value={state.End_Date}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => setState({ ...state, End_Date: e.target.value })}
        error={!!errors.End_Date} // Show error if it exists
        helperText={errors.End_Date} 
      />
    </Grid>

    {/* Product Fields */}
    {state.fieldSets?.map((fieldSet, index) => (
      <Grid container spacing={2} key={index} style={{paddingLeft: 15}}>
        {/* Product Name and Quantity on the Same Row */}
        <Grid item xs={6}>
          <Autocomplete
            options={productList
              .filter(
                (item) =>
                  !state.fieldSets.some(
                    (fs) =>
                      fs.productType === item.productName &&
                      fs.productID === item._id
                  )
              )
              .map((item) => item.productType)}
            value={fieldSet.productType}
            onChange={(e, v, reason) => {
              if (reason === 'clear') {
                handleFieldChange(index, 'productName', '');
                handleFieldChange(index, 'productID', '');
              } else {
                const selectedProduct = productList.find(
                  (item) => item.productType === v
                );
                handleFieldChange(index, 'productName', v);
                handleFieldChange(
                  index,
                  'productID',
                  selectedProduct ? selectedProduct._id : null
                );
              }
            }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" label="Product Name" fullWidth />
            )}
            error={!!errors[`fieldsetsproductType${index}`]} // Show error if it exists
            helperText={errors[`fieldsetsproductType${index}`]}
          />
        </Grid>

        <Grid item xs={6} style={{marginTop: "-10px"}}>
          <TextField
            label="Quantity"
            variant="standard"
            fullWidth
            value={fieldSet.quantity}
            onChange={(e) => {
              const newValue = e.target.value;

              // Validate that the input is a number
              if (newValue === '' || Number(newValue) > 0) {
                handleFieldChange(index, 'quantity', newValue);
              }
            }}
            margin="dense"
            error={!!errors[`fieldsetsquantity${index}`]} // Show error if it exists
            helperText={errors[`fieldsetsquantity${index}`]}
          />
        </Grid>

        {/* Buttons Row: Delete and Add More side by side */}
        <Grid container item xs={12} justifyContent="flex-start" style={{gap: 12}} spacing={2}>
          <Grid item xs={1} >
            <Button
              onClick={() => handleDeleteFieldSet(index)}
              color="error"
              variant="outlined"
              fullWidth
            >
              Delete
            </Button>
          </Grid>
          
          {index === state.fieldSets.length - 1 && (
            <Grid item xs={2}>
              <Button
                onClick={handleAddMoreFields}
                color="primary"
                variant="outlined"
                fullWidth
              >
                Add More
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
                  <Editor
                    editorState={state.remark || ""}
                    editorClassName={classes.textEditor}
                    toolbarClassName={classes.toolbarEditor}
                    onEditorStateChange={(editorStateParam) =>
                      setState((prevState) => ({
                        ...prevState,
                        remark: editorStateParam, // Directly setting the editorState into billNote
                      }))
                    }
                    placeholder="Remark"
                    error={!!errors.remark} // Show error if it exists
            helperText={errors.remark}
                  />
                </Grid>
      </Grid>
    ))}
  </Grid>
</DialogContent>

      
      <DialogActions>
        <Button onClick={handleClear} color="secondary" variant="outlined">
          Close
        </Button>
        {state.isUpdate ? (
          <Button color="primary" variant="contained" onClick={handleUpdateRequirement}>
            Update
          </Button>
        ) : (
          <Button color="primary" variant="contained" onClick={handleSaveRequirement}>
            Create
          </Button>
        )}
      </DialogActions>
    </Dialog>
      </div>


      {rowdata && (
        <TablePlayground
          title="Requirement List"
          columnData={columnData}
          rowData={rowdata}
          pagination={pagination}
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
        onClose={handleCloseDialog}
        onDelete={handleRequirementDelete}
      />
      <Popup
        open={open}
        message={message}
        onClose={handleClose}
        severity={severity} // You can change this to "error", "warning", etc.
      />
    </>
  );
};

export default Requirement;
