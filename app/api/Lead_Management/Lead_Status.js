import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";
import AlertDialog from "../../containers/UiElements/demos/DialogModal/AlertDialog";
import axios from "axios";
import { PapperBlock } from "enl-components";
import TablePlayground from "../../containers/Tables/TablePlayground";
import { toast } from "react-toastify";
import Popup from "../../components/Popup/Popup";
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
import MenuListComposition from "../../containers/UiElements/demos/DrawerMenu/BasicMenu";
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

function Lead_Status() {
  const { classes } = useStyles();

  const token = localStorage.getItem("token");

  const [state, setState] = useState({
    Status_Name: "",
    Description: "",
    searchText: "",
    isUpdate: false,
  });
  const [errors, setErrors] = useState({
    Status_Name: "",
    Description: "",
  });

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!state.Status_Name.trim()) {
      errors.Status_Name = "Status Name is required";
      isValid = false;
    }

    if (!state.Description.trim()) {
      errors.Description = "Description is required";
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
      id: "statusName",
      numeric: false,
      disablePadding: false,
      label: "Status Name",
    },
    {
      id: "description",
      numeric: false,
      disablePadding: false,
      label: "Description",
    },
    { id: "actions", label: "Action" },
  ];

  useEffect(() => {
    fetchLeadStatus();
  }, []);

  const fetchLeadStatus = () => {
    // axios
    //   .get(`${process.env.REACT_APP_BASE_URL}/api/auth/getAllLeadStatus`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   })
    //   .then((response) => {
    //     if (response.data.data) {
    //       setRowdata(
    //         response.data.data.map((item) => ({
    //           slNo: response.data.data.indexOf(item) + 1,
    //           id: item._id,
    //           statusName: item.statusName,
    //           description: item.description,
    //           actions: (
    //             <>
    //               <IconButton
    //                 aria-label="Edit"
    //                 onClick={(e) => {
    //                   window.scrollTo({
    //                     top: 0,
    //                     behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
    //                   });
    //                   setItemToDelete(item._id);
    //                   setState({
    //                     Status_Name: item.statusName,
    //                     Description: item.description,
    //                     isUpdate: true,
    //                   });
    //                   setOpenDialog(true);
    //                 }}
    //               >
    //                 <EditIcon color={"primary"} />
    //               </IconButton>
    //               <IconButton
    //                 aria-label="Delete"
    //                 onClick={() => {
    //                   setItemToDelete(item._id);
    //                   setDeleteDialogOpen(true);
    //                 }}
    //               >
    //                 <DeleteIcon color={"primary"} />
    //               </IconButton>
    //             </>
    //           ),
    //         }))
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //   });
    const response = {
      data: {
        data: [
          {
            _id: "1",
            statusName: "Open",
            description: "Open",
          },
          {
            _id: "2",
            statusName: "In Progress",
            description: "In Progress",
          },
          {
            _id: "3",
            statusName: "Closed",
            description: "Closed",
          },
        ],
      },
    }
    setRowdata(
      response.data.data.map((item) => ({
        slNo: response.data.data.indexOf(item) + 1,
        id: item._id,
        statusName: item.statusName,
        description: item.description,
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
                  Status_Name: item.statusName,
                  Description: item.description,
                  isUpdate: true,
                });
                setOpenDialog(true);
              }}
            >
              <EditIcon color={"primary"} />
            </IconButton>
            <IconButton
              aria-label="Delete"
              onClick={() => {
                setItemToDelete(item._id);
                setDeleteDialogOpen(true);
              }}
            >
              <DeleteIcon color={"primary"} />
            </IconButton>
            <IconButton
              aria-label="More"
            >
              <MenuListComposition />
            </IconButton>
          </>
        ),
      }))
    );
  };

  const handleCreateLeadStatus = async () => {
    if (!validate()) {
      setMessage("Please fill all required fields");
      setOpen(true);
      setSeverity("warning");
      return;
    }
    try {
      const data = {
        statusName: state.Status_Name,
        description: state.Description,
      };

      if (!state.Status_Name || !state.Description) {
        toast.error("Fill all the information", { position: "top-center" });
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/createLeadStatus`,
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
        fetchLeadStatus();
        window.scrollTo({
          top: 400,
          behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
        });
        setState({
          Status_Name: "",
          Description: "",
          id: "",
          searchText: "",
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

  const handleLeadStatusDelete = async () => {
    try {
      const data = { id: itemToDelete };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/deleteLeadStatus`,
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
        fetchLeadStatus();
        setMessage("Deleted successfully!");
        setOpen(true);
        setSeverity("success");
      } else {
        setMessage(actualData.message);
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
  const handleUpdateLeadStatus = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const token = localStorage.getItem("token");
      if (token) {
        loginHeaders.append("Authorization", `Bearer ${token}`);
      }
      const data = {
        id: itemToDelete,
        statusName: state.Status_Name,
        description: state.Description,
      };

      if (state.Status_Name == "" || state.Description == "") {
        setMessage("Please fill all required fields");
        setOpen(true);
        setSeverity("warning");
        return;
      } else {
        const requestOptions = {
          method: "PUT",
          headers: loginHeaders,
          body: JSON.stringify(data),
        };
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/auth/updateLeadStatus`,
          requestOptions
        );

        const actualData = await res.json();
        //console.log(actualData.holidays);
        // setVisaList(actualData.Country);
        if (actualData.status == 200) {
          fetchLeadStatus();
          window.scrollTo({
            top: 400,
            behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
          });
          setState({
            Status_Name: "",
            Description: "",
            id: "",
            searchText: "",
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
                <AddIcon /> Add Lead Status
              </Button>
            </Tooltip>
          </div>
        </Toolbar>
        <Dialog
          open={openDialog}
          onClose={() => {
            setState({
              Status_Name: "",
              Description: "",
              id: "",
              searchText: "",
              isUpdate: false,
            })
            setOpenDialog(false)
          }}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            Lead Status
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => {
                setState({
                  Status_Name: "",
                  Description: "",
                  id: "",
                  searchText: "",
                  isUpdate: false,
                })
                setOpenDialog(false)
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
                          id="Status"
                          name="Status"
                          label="Status"
                          value={state.Status_Name}
                          onChange={(e) => {
                            const regex = /^[a-zA-Z\s]*$/; // Regular expression to allow only letters and spaces
                            if (regex.test(e.target.value)) {
                              setState({
                                ...state,
                                Status_Name: e.target.value,
                              });
                            }
                          }}
                          error={!!errors.Status_Name}
                          helperText={errors.Status_Name}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          variant="standard"
                          id="Description"
                          name="Description"
                          label="Description"
                          value={state.Description}
                          onChange={(e) =>
                            setState({ ...state, Description: e.target.value })
                          }
                          error={!!errors.Description}
                          helperText={errors.Description}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick=
              {() => {
                setState({
                  Status_Name: "",
                  Description: "",
                  id: "",
                  searchText: "",
                  isUpdate: false,
                })
                setOpenDialog(false)
              }} color="secondary">
              Close
            </Button>
            {state.isUpdate ? (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleUpdateLeadStatus}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleCreateLeadStatus}
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
        onDelete={handleLeadStatusDelete}
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

export default Lead_Status;
