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


export default function JobApplicantView() {

    const [mainlist, setMainList] = React.useState([]);
    const [selectedId, setSelectedId] = React.useState(null); // State for selected _id
    const location = useLocation();
    const { jobID: applicantDetails, selectID, selectedJob } = location.state || {};

    const table3 = async () => {
        try {
            const loginHeaders = new Headers();
            loginHeaders.append("Content-Type", "application/json");

            const authToken = localStorage.getItem("token");
            if (authToken) {
                loginHeaders.append("Authorization", `Bearer ${authToken}`);
            }
            const data = { id: applicantDetails };
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
    }, [applicantDetails]);
    console.log(applicantDetails);

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
    const selectedApplicant = applicantDetails;

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
                        <Typography variant="h3" color={"primary"} style={{ fontSize: 30 }}>
                            Applicant Details
                        </Typography>
                    </div>

                </div>

                {/* Display job details in a simple format */}
                {selectedApplicant ? (
                    <React.Fragment>
                        <Paper style={{ marginBottom: "6px", marginTop: 20 }}>
                            <Typography
                                variant="h5"
                                color="textSecondary"
                                style={{
                                    backgroundColor: "#9a9a9d", // Grey background color
                                    color: "#FFFFFF", // White text color
                                    padding: "8px", // Padding around the text
                                    borderRadius: "8px", // Rounded corners
                                }}
                            >
                                Applicant Details
                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                <span style={{ fontWeight: 'bold' }}>Job Title:</span>
                                <span style={{ marginLeft: "20px" }}>{selectedApplicant.jobID.jobTitle}</span>

                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                <span style={{ fontWeight: 'bold' }}>Applicant Name:</span>
                                <span style={{ marginLeft: "20px" }}>{selectedApplicant.applicantData.applicantName}</span>
                                {/* Applicant Name:{" "}
                      {selectedApplicant.applicantData.applicantName} */}
                            </Typography>
                            <Typography variant="h6" color="textSecondary">

                                <span style={{ fontWeight: 'bold' }}>Resume:</span>
                                <span style={{ marginLeft: "20px" }}><a
                                    href={selectedApplicant.applicantData.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Resume
                                </a></span>

                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                <span style={{ fontWeight: 'bold' }}>Phone Number:</span>
                                <span style={{ marginLeft: "20px" }}>{selectedApplicant.applicantData.phoneNumber}</span>

                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                <span style={{ fontWeight: 'bold' }}>Email:</span>
                                <span style={{ marginLeft: "20px" }}>{selectedApplicant.applicantData.email}</span>

                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                <span style={{ fontWeight: 'bold' }}>Recent Certification:</span>
                                <span style={{ marginLeft: "20px" }}><a
                                    href={selectedApplicant.applicantData.recentCertification}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Certification
                                </a></span>


                            </Typography>
                        </Paper>
                        <Paper>
                            <Typography
                                variant="h5"
                                color="textSecondary"
                                style={{
                                    backgroundColor: "#9a9a9d", // Grey background color
                                    color: "#FFFFFF", // White text color
                                    padding: "8px", // Padding around the text
                                    borderRadius: "8px", // Rounded corners
                                }}
                            >
                                Custom Questions
                            </Typography>

                            {/* <Typography variant="h5" color="textSecondary">Custom Questions</Typography> */}
                            {selectedApplicant.customQuestion?.map((question, qIndex) => (
                                <div key={qIndex}>
                                    <Typography variant="h6" color="textSecondary">
                                        <span style={{ fontWeight: 'bold' }}>Question:</span>
                                        <span style={{ marginLeft: "20px" }}>{question.customQuestion}</span>

                                    </Typography>
                                    <Typography variant="h6" color="textSecondary">
                                        <span style={{ fontWeight: 'bold' }}>Answer: </span>
                                        <span style={{ marginLeft: "20px" }}>{question.answer}</span>

                                    </Typography>
                                </div>
                            ))}
                        </Paper>

                        <Paper>
                            <Typography
                                variant="h5"
                                color="textSecondary"
                                style={{
                                    backgroundColor: "#9a9a9d", // Grey background color
                                    color: "#FFFFFF", // White text color
                                    padding: "8px", // Padding around the text
                                    borderRadius: "8px", // Rounded corners
                                }}
                            >
                                Interview details
                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                <span style={{ fontWeight: 'bold' }}>Interviewer Name:</span>
                                <span style={{ marginLeft: "20px" }}>{selectedApplicant.interviewerDetails.interviewerName}</span>


                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                <span style={{ fontWeight: 'bold' }}>Interview Start Date:</span>
                                <span style={{ marginLeft: "20px" }}>{new Date(
                                    selectedApplicant.interviewerDetails.startDate
                                ).toLocaleDateString()}</span>


                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                <span style={{ fontWeight: 'bold' }}>Interview End Date:</span>
                                <span style={{ marginLeft: "20px" }}>{new Date(
                                    selectedApplicant.interviewerDetails.endDate
                                ).toLocaleDateString()}</span>


                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                <span style={{ fontWeight: 'bold' }}> Feedback: </span>
                                <span style={{ marginLeft: "20px" }}>{parseFeedback(selectedApplicant.interviewerDetails.feedback)}</span>


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