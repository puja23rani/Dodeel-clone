import {
  Avatar,
  Divider,
  Typography,
  Grid,
  Button,
  IconButton,
  Card,
  CardContent,
  alpha,
  Paper,
  Dialog,
  AppBar,
  Toolbar,
  Slider,
  Slide,
  Tabs,
  useTheme,
  Tab,
  List,
  ListItem,
  Icon,
} from "@mui/material";
import React from "react";

import { MoreVert, Settings } from "@mui/icons-material";


import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure the CSS is imported
import useStyles from "../../../components/Product/product-jss";
import CloseIcon from '@mui/icons-material/Close';
import imgData from 'enl-api/images/imgData';
import { useState } from "react";
import SwipeableViews from 'react18-swipeable-views';
import PropTypes from "prop-types";
import { ListItemText } from "@mui/material";


export default function JobAppView(props) {

  const [mainlist, setMainList] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState(null); // State for selected _id
  const location = useLocation();
  const { jobID, selectID, selectedJob } = location.state || {};
  const [qty, setQty] = useState(1);
  const {
    open,
    close,
    detailContent,
    productIndex,
    handleAddToCart,
    intl
  } = props;

  const table3 = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }
      const data = { id: jobID };
      console.log(data);
      const requestOptions = {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/auth/getJobById`,
        requestOptions
      );
      const actualData = await res.json();

      console.log(actualData);
      setMainList(actualData.data || []); // Ensure it's an array
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    //   table3();
    console.log(jobID);
  }, [jobID]);

  const parseFeedback = (feedback) => {
    try {
      const feedbackJson = JSON.parse(feedback);
      return feedbackJson.blocks?.map((block) => block.text).join(" ");
    } catch (error) {
      console.error("Error parsing feedback:", error);
      return feedback;
    }
  };

  const handleApplicantClick = (id) => {
    setSelectedId(id); // Set the selected _id
  };

  // const selectedApplicant = mainlist.find(applicant => applicant._id === selectedId);
  const selectedApplicant = jobID;
  const [value, setValue] = useState(0);

  const handleChange = (event, val) => {
    setValue(val);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };


  const theme = useTheme();
  const { classes, cx } = useStyles();

  function TabContainer({ children, dir }) {
    return (
      <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
        {children}
      </Typography>
    );
  }

  TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
  };


  return (
    <div>
      <div

        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Typography variant="h3" color={"primary"} style={{ fontSize: 30 }}>
            Job Application Details
          </Typography>
        </div>
      </div>
      <Paper className={classes.rootDesc} elevation={0} style={{paddingBottom: 40}}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >

            <Tab label="Job Details" />
            <Tab label="Questions" />
            <Tab label="Description" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>
            <article>
              <Grid container spacing={3}>
                <Grid item md={9} xs={12}>
                  <Typography variant="h7">
                    <strong>Job Title:</strong>
                    <span style={{ marginLeft: "20px", fontWeight: "normal" }}>
                      {selectedApplicant.jobTitle}
                    </span>
                  </Typography>
                  <Divider className={classes.divider} style={{ width: '77vw'}}   />
                  <Typography variant="h7">
                    <strong>Job category :</strong>
                    <span style={{ marginLeft: "20px", fontWeight: "normal" }}>
                    {selectedApplicant.jobCategory}
                    </span>
                  </Typography>
                  <Divider className={classes.divider} style={{ width: '77vw'}} />
                  <Typography variant="h7">
                    <strong>Job Status:</strong>
                    <span style={{ marginLeft: "20px", fontWeight: "normal" }}>
                    {selectedApplicant.createStatus}
                    </span>
                  </Typography>
                  <Divider className={classes.divider} style={{ width: '77vw'}} />
                  <Typography variant="h7">
                    <strong>Start date of Job Application:</strong>
                    <span style={{ marginLeft: "20px", fontWeight: "normal" }}>
                    {new Date(selectedApplicant.startDate).toLocaleDateString()}
                    </span>
                  </Typography>
                  <Divider className={classes.divider} style={{ width: '77vw'}} />
                  <Typography variant="h7">
                    <strong>End date of Job Application:</strong>
                    <span style={{ marginLeft: "20px", fontWeight: "normal" }}>
                    {new Date(selectedApplicant.endDate).toLocaleDateString()}
                    </span>
                  </Typography>
                  <Divider className={classes.divider} style={{ width: '77vw'}} />
                  <Typography variant="h7">
                    <strong>Skills :</strong>
                    <span style={{ marginLeft: "20px", fontWeight: "normal" }}>
                    {selectedApplicant.skills}
                    </span>
                  </Typography>
                  <Divider className={classes.divider} style={{ width: '77vw'}} />
                 
                </Grid>
              </Grid>
            </article>
          </TabContainer>
          <TabContainer dir={theme.direction}>
            <article>
              <Grid container spacing={3}>
                <Grid item md={9} xs={12}>
                {selectedApplicant.customQuestionID?.map((question, qIndex) => (
                <div key={qIndex}>
                <Typography variant="h7">
                    <strong>Question : </strong>
                    <span style={{ marginLeft: "20px", fontWeight: "normal" }}>
                    {question.customQuestion}
                    </span>
                  </Typography>
                  <Divider className={classes.divider} style={{ width: '77vw'}} />
                  <Typography variant="h7">
                    <strong>Requirement Or not:</strong>
                    <span style={{ marginLeft: "20px", fontWeight: "normal" }}>
                    {question.requirement}
                    </span>
                  </Typography>
                  <Divider className={classes.divider} style={{ width: '77vw'}} />
                  </div>
                  ))}
                  
                </Grid>
              </Grid>
            </article>
          </TabContainer>
          <TabContainer dir={theme.direction}>
            <Grid container spacing={3}>
            <Grid item md={9} xs={12}>
                  <Typography variant="h7">
                    <strong>Job Description:</strong>
                    <span style={{ marginLeft: "20px", fontWeight: "normal" }}>
                      {parseFeedback(selectedApplicant.jobDescription)}
                    </span>
                  </Typography>
                  <Divider className={classes.divider} style={{ width: '77vw'}} />
              </Grid>
            </Grid>
          </TabContainer>
        </SwipeableViews>
      </Paper>
    </div>
  );
}

