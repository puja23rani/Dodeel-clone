import React, { useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/BorderColor";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import AlertDialog from "../../../UiElements/demos/DialogModal/AlertDialog";
import TablePlayground from "../../../Tables/TablePlayground";
import Popup from "../../../../components/Popup/Popup";
import { useNavigate } from "react-router-dom";
import { openAction } from 'enl-redux/modules/ui';
import { useDispatch } from "react-redux";

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

function EmployeeDetails() {
    const { classes } = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [rowdata, setRowdata] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const columnData = [
        {
            id: "slNo",
            numeric: true,
            disablePadding: false,
            label: "Sl No",
        },
        {
            id: "employeeName",
            numeric: false,
            disablePadding: false,
            label: "Employee Name",
        },
        {
            id: "contactNumber",
            numeric: false,
            disablePadding: false,
            label: "Contact Number",
        },
        {
            id: "emailAddress",
            numeric: false,
            disablePadding: false,
            label: "Email Address",
        },
        {
            id: "departmentName",
            numeric: false,
            disablePadding: false,
            label: "Department Name",
        },
        {
            id: "desgination",
            numeric: false,
            disablePadding: false,
            label: "Desgination",
        },
        { id: "actions", label: "Action" },
    ];

    const getEmployeeDetailsList = async () => {
        try {
            const loginHeaders = new Headers();
            loginHeaders.append("Content-Type", "application/json");

            // Assuming you have an authorization token stored in localStorage
            const authToken = localStorage.getItem("token");
            if (authToken) {
                loginHeaders.append("Authorization", `Bearer ${authToken}`);
            }

            const requestOptions = {
                method: "GET",
                headers: loginHeaders,
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/getEmployeeDetails`,
                requestOptions
            );
            const actualData = await res.json();
            // console.log(actualData);

            if (actualData.status === 200) {
                if (actualData.employees.length > 0) {
                    setRowdata(
                        actualData.employees.map((item) => ({
                            slNo: actualData.employees.indexOf(item) + 1,
                            id: item._id,
                            employeeName: item.personalDetails.employeeName || "N/A",
                            contactNumber: item.personalDetails.phoneNumber || "N/A",
                            emailAddress: item.personalDetails.email || "N/A",
                            departmentName: item.officialDetails.departmentName || "N/A",
                            desgination: item.officialDetails.designationName || "N/A",
                            actions: (
                                <>
                                    <IconButton
                                        aria-label="Edit"
                                        onClick={() => {
                                            navigate("/app/hrm-setting/employee-details/create-employee-details", {
                                                state: { updateId: item._id },
                                            });
                                        }}
                                    >
                                        <EditIcon color={"primary"} />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Delete"
                                        onClick={(e) => {
                                            setDeleteDialogOpen(true);
                                            setIdToDelete(item._id);
                                        }}
                                    >
                                        <DeleteIcon color={"primary"} />
                                    </IconButton>
                                </>
                            ),
                        }))
                    );
                }
            }
        } catch (err) {
            console.log(err);
            setMessage("Something went wrong!");
            setOpen(true);
            setSeverity("error");
        }
    }

    useEffect(() => {
        getEmployeeDetailsList();
    }, []);

    const handleDeleteEmployee = async () => {
        try {
            const loginHeaders = new Headers();
            loginHeaders.append("Content-Type", "application/json");

            // Assuming you have an authorization token stored in localStorage
            const authToken = localStorage.getItem("token");
            if (authToken) {
                loginHeaders.append("Authorization", `Bearer ${authToken}`);
            }
            const data = { id: idToDelete };
            const requestOptions = {
                method: "DELETE",
                headers: loginHeaders,
                body: JSON.stringify(data),
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/deleteEmployee`,
                requestOptions
            );
            const actualData = await res.json();
            // console.log(actualData);
            if (actualData.status === 200) {
                setDeleteDialogOpen(false);
                setIdToDelete(null);
                setMessage("Deleted successfully!");
                setOpen(true);
                setSeverity("success");
                getEmployeeDetailsList();
            }
        } catch (err) {
            console.log(err);
            setDeleteDialogOpen(false);
            setIdToDelete(null);
            setMessage("Something went wrong!");
            setOpen(true);
            setSeverity("error");
        }
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage); // Update the current page
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10)); // Update the rows per page
        setPage(0); // Reset to first page
    };

    const handleNavigate = () => {
        dispatch(openAction("HRM"));
        navigate("/app/hrm-setting/employee-details/create-employee-details");
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
                                onClick={handleNavigate}
                                color="primary"
                                className={classes.button}
                            >
                                <AddIcon /> Add Employee
                            </Button>
                        </Tooltip>
                    </div>
                </Toolbar>
            </div>

            {rowdata && (
                <TablePlayground
                    title="Employee List"
                    columnData={columnData}
                    rowData={rowdata}
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
                onClose={handleCloseDeleteDialog}
                onDelete={handleDeleteEmployee}
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

export default EmployeeDetails;
