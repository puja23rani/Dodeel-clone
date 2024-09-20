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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import TablePlayground from "../../Tables/TablePlayground";
import Popup from "../../../components/Popup/Popup";
import AlertDialog from "../../UiElements/demos/DialogModal/AlertDialog";
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

function Bill_Tax() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");

  const [state, setState] = useState({
    taxType: "",
    taxRate: "",
    id: "",
    isUpdate: false,
  });
  const [errors, setErrors] = useState({
    taxType: "",
    taxRate: "",
  });

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.taxType.trim()) {
      errors.taxType = "Bill Tax is required";
      isValid = false;
    }

    if (!state.taxRate.trim()) {
      errors.taxType = "Bill rate is required";
      isValid = false;
    }

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

  const columnData = [
    {
      id: "slNo",
      numeric: true,
      disablePadding: false,
      label: "Sl No",
    },
    {
      id: "billtax",
      numeric: false,
      disablePadding: false,
      label: "Bill tax",
    },
    {
      id: "billrate",
      numeric: false,
      disablePadding: false,
      label: "Bill Rate",
    },
    { id: "actions", label: "Action" },
  ];

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

  const handleCreateBillTax = async () => {
    if (!validate()) {
      
      return;
    }
    try {
      const data = {
        taxType: state.taxType,
        taxRate: state.taxRate
      };

      

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createBillTax`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result.status === 200) {
        fetchBillTax();
        window.scrollTo({
          top: 400,
          behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
        });
        setState({
            taxType: "",
            taxRate:"",
            id: "",
         
            isUpdate: false,
          });
        setMessage("Saved successfully!");
        setOpen(true);
        setSeverity("success");
        setOpenDialog(false);
      } else {
        setMessage(result.message);
        setOpen(true);
        setSeverity("error");
      }
    } catch (err) {
      //console.log(err);
      setMessage(err.message);
      setOpen(true);
      setSeverity("error");
    }
  };

  const handleBillTaxDelete = async () => {
    try {
      const data = { id: parseInt(itemToDelete) };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteBillTax`,
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
        fetchBillTax();
        setMessage("Deleted successfully!");
        setOpen(true);
        setSeverity("success");
      } else {
        setMessage(result.message);
        setOpen(true);
        setSeverity("error");
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
  const handleUpdateBillTax = async () => {
    if(!validate()){return;}
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const token = localStorage.getItem("token");
      if (token) {
        loginHeaders.append("Authorization", `Bearer ${token}`);
      }
      const data = {
        id: parseInt(itemToDelete),
        taxType: state.taxType,
        taxRate: state.taxRate
      };

      
        const requestOptions = {
          method: "PUT",
          headers: loginHeaders,
          body: JSON.stringify(data),
        };
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/auth/updateBillTax`,
          requestOptions
        );
        const actualData = await res.json();
        //console.log(actualData.holidays);
        // setVisaList(actualData.Country);
        if (actualData.status == 200) {
          fetchBillTax();
          window.scrollTo({
            top: 400,
            behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
          });
          setState({
            taxType: "",
            id: "",
            taxRate: "",
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
                <AddIcon /> Add Bill Tax
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
          open={openDialog}
          onClose={() => {
            setState({
              taxRate: "",
              taxType: "",
              id: "",

              isUpdate: false,
            });
            setOpenDialog(false);
          }}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            Bill Tax
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => {
                setState({
                  taxRate: "",
                  taxType: "",
                  id: "",

                  isUpdate: false,
                });
                setOpenDialog(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <div className={classes.form}>
              <Grid
                container
                spacing={3}
                alignItems="flex-start"
                direction="row"
                justifyContent="stretch"
              >
                <Grid item xs={12}>
                  <div className={classes.form}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          variant="standard"
                          id="Tax Type"
                          name="Tax Type"
                          label="Tax Type"
                          value={state.taxType}
                          onChange={(e) => {
                            const regex = /^[a-zA-Z\s]*$/; // Regular expression to allow only letters and spaces
                            if (regex.test(e.target.value)) {
                              setState({
                                ...state,
                                taxType: e.target.value,
                              });
                            }
                          }}
                          error={!!errors.taxType}
                          helperText={errors.taxType}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          variant="standard"
                          id="TaxRate"
                          name="TaxRate"
                          label="Tax Rate"
                          value={state.taxRate}
                          onChange={(e) => {
                            const input = e.target.value;
                            setState({ ...state, taxRate: input }); // Allow typing any input initially
                          }}
                          onBlur={() => {
                            const input = state.taxRate.trim();

                            // Regular expression to match percentage values (e.g., "4%", "10%", etc.)
                            const percentageRegex = /^([1-9][0-9]?|100)%$/;

                            // Validate that the input matches the required format and is not more than 100%
                            if (!percentageRegex.test(input)) {
                              setErrors({
                                ...errors,
                                taxRate:
                                  "Tax rate must be between 1% and 100% and end with %.", // Set error message if invalid
                              });
                            } else {
                              setErrors({ ...errors, taxRate: "" }); // Clear error if valid
                            }
                          }}
                          error={!!errors.taxRate}
                          helperText={errors.taxRate}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setState({
                  taxRate: "",
                  taxType: "",
                  id: "",

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
                  onClick={handleUpdateBillTax}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateBillTax}
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
          title="Lead Status List"
          columnData={columnData}
          rowData={rowdata}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      )}

      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        onDelete={handleBillTaxDelete}
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

export default Bill_Tax;
