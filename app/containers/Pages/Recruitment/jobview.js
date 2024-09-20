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
  } from "@mui/material";
  import React from "react";

  import { MoreVert } from "@mui/icons-material";
 

  import { useNavigate } from "react-router";
  import { useLocation } from "react-router-dom";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css"; // Ensure the CSS is imported

  
  export default function JobAppView() {
 
    const [mainlist, setMainList] = React.useState([]);
    const [selectedId, setSelectedId] = React.useState(null); // State for selected _id
    const location = useLocation();
    const { jobID, selectID, selectedJob } = location.state || {};
  
    const table3 = async () => {
      try {
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
  
        const authToken = localStorage.getItem("token");
        if (authToken) {
          loginHeaders.append("Authorization", `Bearer ${authToken}`);
        }
        const data = {  id: jobID };
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
  
    return (
      <div >
       
        <div >
          <div
            
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Typography variant="h3" color={"primary"} style={{fontSize:30}}>
                Job Application Details
              </Typography>
            </div>
           
          </div>
          
  
          {/* Display job details in a simple format */}
          {selectedApplicant ? (
            <React.Fragment >
              {/* <Card className={classes.card} style={{ marginBottom:"6px" , marginTop:20}} >
                <CardContent style={{margin:"4px"}}> */}
                <Paper style={{ marginBottom:"6px" , marginTop:20}}>
                  <Typography
                    variant="h5"
                    color="textSecondary"
                    style={{
                      backgroundColor: "#9a9a9d", // Grey background color
                      color: "#FFFFFF", // White text color
                      padding: "8px", // Padding around the text
                      borderRadius: "8px",
                      marginBottom: "15px" // Rounded corners
                    }}
                  >
                    Applicantion Details
                  </Typography>
                  <Typography variant="h6" color="textSecondary" style={{ marginBottom: "12px" }}>
                  <span style={{ fontWeight: 'bold' }}>Job Title:</span>
                  <span style={{ marginLeft: "20px" }}>{selectedApplicant.jobTitle}</span>
                  </Typography>
                  <Typography variant="h6" color="textSecondary" style={{ marginBottom: "12px" }}>
                  <span style={{ fontWeight: 'bold' }}>Job category : </span>
                  <span style={{ marginLeft: "20px" }}>{selectedApplicant.jobCategory}</span> 
                  </Typography>
  
                  {/* <Typography variant="h6" color="textSecondary">
                      Job Description: {selectedApplicant.jobDescription}
                    </Typography> */}
                  <Typography variant="h6" color="textSecondary" style={{ marginBottom: "12px" }}>
                    <span style={{ fontWeight: 'bold' }}>Job Status: </span> 
                    <span style={{ marginLeft: "20px",background:"lightgreen" , borderRadius: 10 ,width: "fit-content",padding: 4,fontSize:"10px" ,color:"white"}}> {selectedApplicant.createStatus}</span>
                  </Typography>
                  <Typography variant="h6" color="textSecondary" style={{ marginBottom: "12px" }}>
                  <span style={{ fontWeight: 'bold' }}>Start date of Job Application: </span> 
                  <span style={{ marginLeft: "20px" }}> {new Date(selectedApplicant.startDate).toLocaleDateString()}</span>
                  </Typography>
                  <Typography variant="h6" color="textSecondary" style={{ marginBottom: "12px" }}>
                  <span style={{ fontWeight: 'bold' }}>End date of Job Application: </span>
                  <span style={{ marginLeft: "20px" }}>{new Date(selectedApplicant.endDate).toLocaleDateString()}</span>
                  </Typography>
                  <Typography variant="h6" color="textSecondary" style={{ marginBottom: "12px" }}>
                  <span style={{ fontWeight: 'bold' }}>Job Description: </span>
                  <span style={{ marginLeft: "20px" }}>{parseFeedback(selectedApplicant.jobDescription)}</span>
                  </Typography>
                  <span style={{ fontWeight: 'bold' }}>Skills : </span>
                  {selectedApplicant.skills?.map((skill, index) => (
                    <Typography
                      key={index}
                      variant="h6"
                      color="textSecondary"
                      style={{
                        padding: 4,
                        backgroundImage: 'linear-gradient(135deg, #c2c2d6 0%, #c2c2d6 100%)',
                        borderRadius: 10,
                        width: "fit-content",
                        display: "inline",
                        flexDirection: "row",
                        margin: 3,
                      }}
                    >
                      
                       {skill}
                    </Typography>
                  ))}
                  </Paper>
                {/* </CardContent>
              </Card> */}
  
              {/* <Card className={classes.card} style={{ marginBottom:"6px"}}>
                <CardContent> */}
                <Paper style={{ marginBottom:"6px"}}>
                  <Typography
                    variant="h5"
                    color="textSecondary"
                    style={{
                      backgroundColor: "#9a9a9d", // Grey background color
                      color: "#FFFFFF", // White text color
                      padding: "8px", // Padding around the text
                      borderRadius: "8px",
                      marginBottom: "15px" // Rounded corners
                    }}
                  >
                    Custom Questions
                  </Typography>
  
                  {/* <Typography variant="h5" color="textSecondary">Custom Questions</Typography> */}
                  {selectedApplicant.customQuestionID?.map((question, qIndex) => (
                    <div key={qIndex}>
                      <Typography variant="h6" color="textSecondary" style={{ marginBottom: "12px" }}>
                      <span style={{ fontWeight: 'bold' }}>Question : </span> 
                      <span style={{ marginLeft: "20px" }}> {question.customQuestion}</span> 
                      </Typography>
                      <Typography variant="h6" color="textSecondary" style={{ marginBottom: "12px" }}>
                      <span style={{ fontWeight: 'bold' }}>Requirement Or not: </span> 
                      <span style={{ marginLeft: "20px" }}>{question.requirement}</span> 
                      </Typography>
                    </div>
                  ))}
                  </Paper>
                {/* </CardContent>
              </Card>
   */}
             <Paper>
                  <Typography
                    variant="h5"
                    color="textSecondary"
                    style={{
                      backgroundColor: "#9a9a9d", // Grey background color
                      color: "#FFFFFF", // White text color
                      padding: "8px", // Padding around the text
                      borderRadius: "8px",
                      marginBottom: "15px" // Rounded corners
                    }}
                  >
                    Job Description
                  </Typography>
  
                  {/* <Typography variant="h5" color="textSecondary">Custom Questions</Typography> */}
                  <Typography variant="h6" color="textSecondary" style={{ marginBottom: "12px" }}>
                  {/* <span style={{ fontWeight: 'bold' }}>Job Description: </span> */}
                    {parseFeedback(selectedApplicant.jobDescription)}
                  </Typography>
                  
                  </Paper>
            </React.Fragment>
          ) : (
            <Typography variant="h6" color="textSecondary">
              No applicants found.
            </Typography>
          )}
        </div>
        <ToastContainer />
      </div>
    );
  }