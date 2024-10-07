import React, { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, CircularProgress } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { convertFromRaw, EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { storage } from "../../../../firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Popup from "../../../components/Popup/Popup";
import AlertDialog from "../../UiElements/demos/DialogModal/AlertDialog";
import { useLocation } from "react-router-dom";
import { set } from "lodash";

const useStyles = makeStyles()((theme) => ({
  textEditor: {
    padding: "5px",
    backgroundColor: "#ececec",
    minHeight: "200px",
    border: "1px solid #ccc",
  },
  toolbarEditor: {
    borderRadius: "4px",
    border: "1px solid #ececec",
  },
  root: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  field: {
    width: "100%",
    marginBottom: 20,
  },
  buttonAddMore: {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    marginTop: "20px",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  deleteButton: {
    backgroundColor: "red",
    color: "white",
    marginTop: "10px",
    "&:hover": {
      backgroundColor: "#b71c1c",
    },
  },
  inputFileLabel: {
    cursor: "pointer",
    color: theme.palette.primary.main,
    display: "inline-flex",
    alignItems: "center",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  filePreview: {
    width: "100px",
    height: "100px",
    margin: "5px",
    borderRadius: "10px",
    objectFit: "cover",
  },
  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(2px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  submitButton: {
    marginTop: 20,
    padding: '10px 20px',
    backgroundColor: theme.palette.success.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
    },
  },
}));

function ProjectMetaData() {
  const { classes } = useStyles();
  const location = useLocation();
  const { id } = location.state || {};
 console.log(id)
  const [fields, setFields] = useState([{ FieldTitle: "", fieldImage: "", fieldMetaData: EditorState.createEmpty() }]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setIsUpdateId] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage submission
const token=localStorage.getItem("token");
  const handleAddMore = () => {
    setFields([...fields, { FieldTitle: "", fieldImage: "", fieldMetaData: EditorState.createEmpty() }]);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = fields.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFields(updatedFields);
  };

  const handleFilesChange = (e, idx) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const imageRef = ref(storage, `/photo/${file.name}`);
      uploadBytes(imageRef, file).then(() => {
        getDownloadURL(imageRef).then((url) => {
          handleFieldChange(idx, "fieldImage", url);
          setIsLoading(false);
        });
      });
    }
  };
  const table = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }
      const data = { projectID: id };
      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getAllMetaDataByProjectID`,
        requestOptions
      );
      const actualData = await res.json();
      console.log(actualData);
      setIsUpdate(false);
     
      if(actualData.status==200){
        setIsUpdateId(actualData.data.metaData._id);
        setIsUpdate(true);
        const updatedFields = actualData.data.metaData.projectFieldDetails.map(item => ({
            FieldTitle: item.FieldTitle,
            fieldImage: item.fieldImage,
            fieldMetaData: EditorState.createWithContent(
                convertFromRaw(JSON.parse(item.fieldMetaData))
              ),
        }));
        
        setFields(updatedFields);
      }
     
      console.log(actualData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    table();
  },[])
  const handleDeleteProjectMeta = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };
const handleUpdateProjectMeta = async () => {
    const updatedFields = fields.map(field => ({
        ...field,
        fieldMetaData:  JSON.stringify(
            convertToRaw(field.fieldMetaData.getCurrentContent())
          )
    }));
    console.log(updatedFields,"updatedFields");
   
    try {
        // Prepare the data to match the required request body format
        const data = {
            id: parseInt(updateId),
            projectID: id,
            projectFieldDetails: updatedFields,
        };
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/auth/updatemetadataofproject`,
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
          
          window.scrollTo({
            top: 400,
            behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
          });
          // Reset the state after successful creation
        //   setState({
        //     Id: "",
        //     Company_Name: "",
        //     Customer_Name: "",
        //     Phone_Number: "",
        //     Email: "",
        //     Lead_Name: "",
        //     Lead_Id: "",
        //     Employee_Name: "",
        //     Employee_Id: "",
  
        //     Billing_Address: "",
        //     Shipping_Address: "",
        //     Status: "",
  
        //     isUpdate: false,
  
        //     toggle: false,
        //   });
          // setOpenDialog(false);
          table();
          setPopupMessage("Updated successfully!");
          setOpenPopup(true);
          setPopupSeverity("success");
        //   navigate("/app/sales/project", {
        //     state: { InvoiceID: result._id },
        //   });
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
}
  const handleCreateProjectMeta = async (e) => {
    const updatedFields = fields.map(field => ({
        ...field,
        fieldMetaData:  JSON.stringify(
            convertToRaw(field.fieldMetaData.getCurrentContent())
          )
    }));
    console.log(updatedFields,"updatedFields");
   
    try {
        // Prepare the data to match the required request body format
        const data = {
            projectID: id,
            projectFieldDetails: updatedFields,
        };
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/auth/createprojectmetadata`,
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
          
          window.scrollTo({
            top: 400,
            behavior: "smooth", // Optional: Use 'auto' for instant scrolling without animation
          });
          // Reset the state after successful creation
        //   setState({
        //     Id: "",
        //     Company_Name: "",
        //     Customer_Name: "",
        //     Phone_Number: "",
        //     Email: "",
        //     Lead_Name: "",
        //     Lead_Id: "",
        //     Employee_Name: "",
        //     Employee_Id: "",
  
        //     Billing_Address: "",
        //     Shipping_Address: "",
        //     Status: "",
  
        //     isUpdate: false,
  
        //     toggle: false,
        //   });
          // setOpenDialog(false);
          setPopupMessage("Created Sucessfully!");
          setOpenPopup(true);
          setPopupSeverity("success");
        //   navigate("/app/sales/project", {
        //     state: { InvoiceID: result._id },
        //   });
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
  console.log(fields,"sttttaattteee");

  return (
    <>
      <Box className={classes.root}>
        <Typography variant="h5" gutterBottom>
          Meta Data Form
        </Typography>

        {fields.map((field, index) => (
          <Box key={index} mb={3} p={2} border={1} borderColor="grey.300" borderRadius={4}>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Title"
                  value={field.FieldTitle}
                  onChange={(e) => {
                   
                      handleFieldChange(index, "FieldTitle", e.target.value);
                    
                  }}
                  error={!!errors[`taxType${index}`]}
                  helperText={errors[`taxType${index}`]}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography className={classes.inputFileLabel}>
                  <label style={{ cursor: 'pointer', position: 'relative' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFilesChange(e, index)}
                      style={{ display: "none" }}
                    />
                    <AddIcon /> Click to upload file
                  </label>
                </Typography>

                {isLoading && (
                  <Box className={classes.loadingOverlay}>
                    <CircularProgress size={24} />
                  </Box>
                )}

                {field.fieldImage && (
                  <Grid container spacing={2} style={{ marginTop: "10px" }}>
                    <img src={field.fieldImage} alt="Tax Rate" className={classes.filePreview} />
                  </Grid>
                )}
              </Grid>

              <Grid item xs={12}>
                <Editor
                  editorState={field.fieldMetaData}
                  editorClassName={classes.textEditor}
                  toolbarClassName={classes.toolbarEditor}
                  onEditorStateChange={(editorStateParam) =>
                    handleFieldChange(index, "fieldMetaData", editorStateParam)
                  }
                  placeholder="Bill Notes"
                />
              </Grid>

              <Grid item xs={12} style={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  className={classes.deleteButton}
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteProjectMeta(index)}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Grid container justifyContent="flex-end">
          <Button
            variant="contained"
            className={classes.buttonAddMore}
            onClick={handleAddMore}
            startIcon={<AddIcon />}
          >
            Add More
          </Button>
        </Grid>

        {isUpdate?(<>
            <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
           
           
           onClick={handleUpdateProjectMeta}
           
          >
             Update
          </Button>
        </Box></>):(<> <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            
            type="submit"
            onClick={handleCreateProjectMeta}
           
          >
             Submit
          </Button>
        </Box></>)}
       

        <AlertDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={() => {}}
        />

        <Popup open={openPopup} message={popupMessage} onClose={handleClosePopup} severity={popupSeverity} />
      </Box>
    </>
  );
}

export default ProjectMetaData;
