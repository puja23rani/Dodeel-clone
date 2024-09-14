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

                {/* Password field takes up the full row */}
                {/* <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                </Grid>

                <FormControl fullWidth>
                  <InputLabel variant="standard" id="demo-simple-select-label">
                    Select
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="select"
                    name="select"
                    variant="standard"
                    label="Select Option"
                    value={formik.values.select}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="option 1">Option 1</MenuItem>
                    <MenuItem value="option 2">Option 2</MenuItem>
                    <MenuItem value="option 3">Option 3</MenuItem>
                  </Select>
                </FormControl>

                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="check"
                        name="check"
                        checked={formik.values.check}
                        onChange={formik.handleChange}
                      />
                    }
                    label="Check"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        id="switch"
                        name="switch"
                        checked={formik.values.switch}
                        onChange={formik.handleChange}
                      />
                    }
                    label="Switch ON/OFF"
                  />
                </FormGroup> */}

                {/* Rest of your fields */}
                {/* <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">
                    Options
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={formik.values.option}
                    onChange={formik.handleChange}
                    id="option"
                    name="option"
                  >
                    <FormControlLabel
                      value="option 1"
                      control={<Radio />}
                      label="Option 1"
                    />
                    <FormControlLabel
                      value="option 2"
                      control={<Radio />}
                      label="Option 2"
                    />
                    <FormControlLabel
                      value="option 3"
                      control={<Radio />}
                      label="Option 3"
                    />
                    <FormControlLabel
                      value="option 4"
                      control={<Radio />}
                      label="Option 4"
                    />
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <FormLabel id="demo-check--group-label">Options</FormLabel>
                  <FormGroup row aria-labelledby="demo-check--group-label">
                    <FormControlLabel
                      value="option 1"
                      checked={formik.values.group.indexOf("option 1") > -1}
                      name="group"
                      onChange={formik.handleChange}
                      control={<Checkbox />}
                      label="Option 1"
                    />
                    <FormControlLabel
                      value="option 2"
                      checked={formik.values.group.indexOf("option 2") > -1}
                      name="group"
                      onChange={formik.handleChange}
                      control={<Checkbox />}
                      label="Option 2"
                    />
                    <FormControlLabel
                      value="option 3"
                      checked={formik.values.group.indexOf("option 3") > -1}
                      name="group"
                      onChange={formik.handleChange}
                      control={<Checkbox />}
                      label="Option 3"
                    />
                    <FormControlLabel
                      value="option 4"
                      checked={formik.values.group.indexOf("option 4") > -1}
                      name="group"
                      onChange={formik.handleChange}
                      control={<Checkbox />}
                      label="Option 4"
                    />
                  </FormGroup>
                </FormControl> */}

                {/* <TextField
                  fullWidth
                  multiline
                  variant="standard"
                  rows={4}
                  id="textarea"
                  name="textarea"
                  label="Textarea"
                  value={formik.values.textarea}
                  onChange={formik.handleChange}
                /> */}

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
