import React, { useEffect, useState } from 'react'
import TablePlayground from '../../../Tables/TablePlayground';
import { makeStyles, useStyles } from 'tss-react/mui';
import AlertDialog from '../../../UiElements/demos/DialogModal/AlertDialog';
import Popup from '../../../../components/Popup/Popup';

const AppraisalList = () => {

    const { classes } = useStyles();

    const [state, setState] = useState({
        id: "",
        leaveTypes: "",
        daysPerYear: "",
        isUpdate: false,
    });

    // console.log(state);

    const [errors, setErrors] = useState({
        leaveTypes: "",
        daysPerYear: ""
    });

    const validate = () => {
        let isValid = true;
        let errors = {};

        if (!state.leaveTypes.trim()) {
            errors.leaveTypes = "Leave Types Name is required";
            isValid = false;
        }

        if (state.daysPerYear.length == "") {
            errors.daysPerYear = "Days Per Year Name is required";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const [rowdata, setRowdata] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
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
            id: "leaveTypes",
            numeric: false,
            disablePadding: false,
            label: "Leave Types",
        },
        {
            id: "daysPerYear",
            numeric: false,
            disablePadding: false,
            label: "Days Per Year",
        },
        { id: "actions", label: "Action" },
    ];

    const getLeaveList = async () => {
        try {
            const loginHeaders = new Headers();
            loginHeaders.append("Content-Type", "application/json");

            // Assuming you have an authorization token stored in localStorage
            const authToken = localStorage.getItem("token");
            if (authToken) {
                loginHeaders.append("Authorization", `Bearer ${authToken}`);
            }

            const data = {
                "pageSize": 1,
                "pageNumber": 1
            }

            const requestOptions = {
                method: "POST",
                headers: loginHeaders,
            };
            const res = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/auth/getAllAppraisal`,
                requestOptions,
                data
            );
            const actualData = await res.json();
            console.log(actualData);

            // if (actualData.status === 200) {
            //     setRowdata(
            //         actualData.data.map((item) => ({
            //             slNo: actualData.leaveTypes.indexOf(item) + 1,
            //             id: item._id,
            //             leaveTypes: item.leaveTypes,
            //             daysPerYear: item.daysPerYear,
            //             actions: (
            //                 <>
            //                     <IconButton
            //                         aria-label="Edit"
            //                         onClick={(e) => {
            //                             // console.log(item);
            //                             setState({
            //                                 id: item._id,
            //                                 leaveTypes: item.leaveTypes,
            //                                 daysPerYear: item.daysPerYear,
            //                                 isUpdate: true,
            //                             });
            //                             setOpenDialog(true);
            //                         }}
            //                     >
            //                         <EditIcon color={"primary"} />
            //                     </IconButton>
            //                     <IconButton
            //                         aria-label="Delete"
            //                         onClick={(e) => {
            //                             setDeleteDialogOpen(true);
            //                             setIdToDelete(item._id);
            //                         }}
            //                     >
            //                         <DeleteIcon color={"primary"} />
            //                     </IconButton>
            //                 </>
            //             ),
            //         }))
            //     );
            // }
        } catch (err) {
            console.log(err);
            setMessage("Something went wrong!");
            setOpen(true);
            setSeverity("error");
        }
    }

    useEffect(() => {
        getLeaveList();
    }, []);

    const handleDptDelete = async () => {
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
                `${process.env.REACT_APP_BASE_URL}/api/auth/deleteLeaveType`,
                requestOptions
            );
            const actualData = await res.json();
            if (actualData.status === 200) {
                setDeleteDialogOpen(false);
                setIdToDelete(null);
                getLeaveList();
                setMessage("Deleted successfully!");
                setOpen(true);
                setSeverity("success");
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

    const handleCloseDialog = () => {
        setState({
            id: "",
            leaveTypes: "",
            daysPerYear: "",
            isUpdate: false,
        })
        setOpenDialog(false);
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

    return (
        <div>
            {rowdata && (
                <TablePlayground
                    title="Appraisal List"
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
                onDelete={handleDptDelete}
            />
            <Popup
                open={open}
                message={message}
                onClose={handleClose}
                severity={severity} // You can change this to "error", "warning", etc.
            />
        </div>
    )
}

export default AppraisalList