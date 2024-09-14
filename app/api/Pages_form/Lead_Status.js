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

function Lead_Status() {
  const { classes } = useStyles();

  const sleep = (ms) =>
    new Promise((r) => {
      setTimeout(r, ms);
    });
  const defaultData = {
    Status: "",
    Description: "",
  };
  const [sampleData, setSampleData] = useState(defaultData);

  const initData = () => {
    setSampleData({
      name: "John Doe",
      email: "john.doe@mail.com",
      password: "12345678",
      select: "option 2",
      option: "option 3",
      switch: true,
      check: true,
      group: ["option 1", "option 3"],
      textarea:
        "Just register to join with us. A platform with efficient integration of many features and so much more. Just register to join with us. A platform with efficient integration of many features and so much more. Just register to join with us. A platform with efficient integration of many features and so much more",
    });
  };

  const formik = useFormik({
    initialValues: sampleData,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      await sleep(500);
      alert(JSON.stringify(values, null, 2));
    },
  });

  const clearData = () => {
    formik.resetForm({
      values: defaultData,
    });
  };
  const columnData = [
    {
      id: "name",
      numeric: false,
      disablePadding: false,
      label: "Dessert (100g serving)",
    },
    { id: "calories", numeric: true, disablePadding: false, label: "Calories" },
    { id: "fat", numeric: true, disablePadding: false, label: "Fat (g)" },
    { id: "carbs", numeric: true, disablePadding: false, label: "Carbs (g)" },
    {
      id: "protein",
      numeric: true,
      disablePadding: false,
      label: "Protein (g)",
    },
  ];

  const data = [
    {
      id: 1,
      name: "Cupcake",
      calories: 305,
      fat: 3.7,
      carbs: 67,
      protein: 4.3,
    },
    { id: 2, name: "Donut", calories: 452, fat: 25.0, carbs: 51, protein: 4.9 },
    {
      id: 3,
      name: "Eclair",
      calories: 262,
      fat: 16.0,
      carbs: 24,
      protein: 6.0,
    },
    // Add more data as needed
  ];
  console.log(formik.values);
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
                <Grid container spacing={2}>
                  {/* Align Name and Email fields side by side */}
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      variant="standard"
                      id="Status"
                      name="Status"
                      label="Status"
                      value={formik.values.Status}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.Status && Boolean(formik.errors.Status)
                      }
                      helperText={formik.touched.Status && formik.errors.Status}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      variant="standard"
                      id="Description"
                      name="Description"
                      label="Description"
                      value={formik.values.Description}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.Description &&
                        Boolean(formik.errors.Description)
                      }
                      helperText={
                        formik.touched.Description && formik.errors.Description
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container justifyContent="flex-end">
                  <Button color="primary" variant="contained" type="submit">
                    Submit
                  </Button>
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

export default Lead_Status;
