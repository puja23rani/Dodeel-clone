import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useFormik } from "formik";
import * as yup from "yup";

import AdvFilter from "../../containers/Tables/demos/AdvFilter";
import { Chip, LinearProgress } from "@mui/material";
import { PapperBlock } from "enl-components";
import TablePlayground from "../../containers/Tables/TablePlayground";
import { Description } from "@mui/icons-material";

const validationSchema = yup.object({
  Status: yup.string("Enter your Status").required("Status is required"),
  Description: yup
    .string("Enter your Description")
    .required("Description is required"),
});

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
  fieldBasic: {
    width: "100%",
    marginBottom: 20,
    marginTop: 10,
  },
  inlineWrap: {
    display: "flex",
    flexDirection: "row",
  },
  buttonInit: {
    margin: theme.spacing(4),
    textAlign: "center",
  },
}));
const [state, setState] = React.useState({
    CustomQuestion: "",
    Custom_Question: "",
    Required_or_Not: "",
    searchText: "",
    isUpdate: false,
  });
function Custom_Question() {
  const { classes } = useStyles();

  const sleep = (ms) =>
    new Promise((r) => {
      setTimeout(r, ms);
    });
  const defaultData = {
    Status: "",
    Description: "",
  };
//   const [sampleData, setSampleData] = useState(defaultData);

//   const initData = () => {
//     setSampleData({
//       name: "John Doe",
//       email: "john.doe@mail.com",
//       password: "12345678",
//       select: "option 2",
//       option: "option 3",
//       switch: true,
//       check: true,
//       group: ["option 1", "option 3"],
//       textarea:
//         "Just register to join with us. A platform with efficient integration of many features and so much more. Just register to join with us. A platform with efficient integration of many features and so much more. Just register to join with us. A platform with efficient integration of many features and so much more",
//     });
//   };
const [customQuestionList, setCustomQuestionList] = React.useState([]);
  function table() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/getRecruitments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle the response
        if (response.data.recruitments) {
          setCustomQuestionList(response.data.recruitments);
        }
        console.log(response.data.recruitments);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }
  React.useEffect(() => {
    table();
  }, []);

  const handleSaveCustomQuestion = () => {
    if (state.Custom_Question == "" ||
      state.Required_or_Not == ""
    ) {
      toast.error("Fill all the information", {
        position: "top-center",
      });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/auth/createRecruitment`,
          {

            customQuestion: state.Custom_Question,
            requirement: state.Required_or_Not,
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
            // Assuming `table()` refreshes or updates the UI
            table();
            setState({
              Custom_Question: "",
              Required_or_Not: "",
              isUpdate: false,
            });



            //   } else {
            //     toast.error("Failed to save. Please try again.", {
            //       position: "top-center",
            //     });
            //   }
            // })
            toast.success("Created successfully!", {
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
  const handleCustomQuestionDelete = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      // Assuming you have an authorization token stored in localStorage
      const Token = localStorage.getItem("token");
      if (Token) {
        loginHeaders.append("Authorization", `Bearer ${Token}`);
      }
      const data = { id: id };
      const requestOptions = {
        method: "DELETE",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/deleteRecruitment`,
        requestOptions
      );
      const actualData = await res.json();
      console.log(actualData);
      // setVisaList(actualData.Country);
      if (actualData.status === 200) {
        handleCloseDialog();
        table();
        toast.success("Deleted successfully!", {
          position: "top-center",
        });
      }
    }
    catch (err) {
      console.log(err);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
      });
    }
  };
  const handleUpdateCustomQuestion = (idx) => {
    const requestData = {
      id: idx,
      customQuestion: state.Custom_Question,
      requirement: state.Required_or_Not,

    }

    if (state.Custom_Question == "" ||
      state.Required_or_Not == "" ||
      idx == ""
    ) {
      toast.error("Fill all the information", {
        position: "top-center",
      });
    } else {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/auth/updateRecruitment`,
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
          if (response.status == 200) {
            // Assuming `table()` refreshes or updates the UI
            table();
            setState({
              Custom_Question: "",
              Required_or_Not: "",
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


        //   } else {
        //     toast.error("Failed to save. Please try again.", {
        //       position: "top-center",
        //     });
        //   }
        // })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error("An error occurred. Please try again.", {
            position: "top-center",
          });
        });
    }
  };

  console.log(state);
//   const centerStyle = {
//     textAlign: "center",
//   };

  const formik = useFormik({
    initialValues: sampleData,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      await sleep(500);
      alert(JSON.stringify(values, null, 2));
    },
  });

  
  return (
    <>
      <PapperBlock title="Lead Status" icon="library_books">
        <div>
          <Grid
            container
            spacing={3}
            alignItems="flex-start"
            direction="row"
            justifyContent="stretch"
          >
            <Grid item xs={12}>
              {/* <Button color="primary" onClick={initData}>
                Load Sample Data
              </Button>
              <Button onClick={clearData}>Clear Data</Button> */}
              <form className={classes.form} onSubmit={formik.handleSubmit}>
                
                  {/* Align Name and Email fields side by side */}
                  <Grid item xs={5} >
                <TextField
                  margin="dense"
                  label="Custom Question"
                  fullWidth
                  value={state.Custom_Question}
                  onChange={(e) => {
                    const value = e.target.value;

                    setState({
                      ...state,
                      Custom_Question: e.target.value,
                    })

                  }}
                />
              </Grid>
              <Grid item xs={5} >
                <Autocomplete
                  options={[
                    "Required",
                    "Not Required",

                  ]}
                  value={state.Required_or_Not}
                  onChange={(e, v, reason) => {
                    console.log(v)
                    if (reason === "clear") {
                      setState({
                        ...state,
                        Required_or_Not: "",
                      });
                    } else {
                      setState({
                        ...state,
                        Required_or_Not: v,
                      });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      fullWidth
                      label="Required Or Not"
                    />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <li
                      {...props}
                      style={{
                        backgroundColor: selected ? "#2f2f30" : "inherit",
                        color: selected ? "white" : "inherit",
                      }}
                    >
                      {option}
                    </li>
                  )}
                />
              </Grid>
              <Grid item xs={1} alignItems="end">
                {state.isUpdate ? (
                  <CustomButton
                    text={"Update"}
                    variant="contained"
                    color="warning"
                    fullWidth
                    onClick={() => {
                      window.scrollTo({
                        top: 800,
                        behavior: 'smooth' // Optional: Use 'auto' for instant scrolling without animation
                      });
                      handleUpdateCustomQuestion(state.id);
                    }}
                  />
                ) : (
                  <CustomButton
                    text={"create"}
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      window.scrollTo({
                        top: 800,
                        behavior: 'smooth' // Optional: Use 'auto' for instant scrolling without animation
                      });
                      handleSaveCustomQuestion();
                    }}
                  />
                )}
              </Grid>
              </form>
            </Grid>
          </Grid>
        </div>
      </PapperBlock>

      <TablePlayground
        size="small"
        styles={{
          bordered: true,
          stripped: true,
          hovered: true,
        }}
        toolbarOptions={{
          enabled: true,

          pagination: false,
        }}
      />
    </>
  );
}

export default Custom_Question;
