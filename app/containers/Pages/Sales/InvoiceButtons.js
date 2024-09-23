import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tooltip, Checkbox, FormControlLabel, Grid, Typography, Switch, FormControl, InputLabel, Select, MenuItem, Menu } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';

import CalendarToday from '@mui/icons-material/CalendarToday';

import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// import CustomInputAndSelectField from '../../components/CustomInputAndSelectField/Index';
// import CustomInputField from '../../components/CustomInputField/Index';
import { convertToRaw, Editor, EditorState } from 'draft-js';
import { toast } from 'react-toastify';
import 'draft-js/dist/Draft.css';  // Ensure you import the Draft.js CSS

import { format } from 'date-fns';
// import TextField from "@mui/material/TextField";

const InvoiceButtons = ({mainlist,table}) => {
  
  const navigate = useNavigate();
  const [openReminderPopup, setOpenReminderPopup] = useState(false);
  const [openPublishPopup, setOpenPublishPopup] = useState(false);
  const location = useLocation();
  const { InvoiceID } = location.state || {};
  const [reminderDate, setReminderDate] = useState(null);
  const [reminderTime, setReminderTime] = useState(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [openEmailPopup, setOpenEmailPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [openPaymentPopup, setOpenPaymentPopup] = useState(false);
  const [showPaymentNote, setShowPaymentNote] = useState(false);
  const [openRecurringSettingsPopup, setOpenRecurringSettingsPopup] = useState(false);
  const [repeatEvery, setRepeatEvery] = useState('');
  const [repeatUnit, setRepeatUnit] = useState('months');
  const [cycles, setCycles] = useState('');
  const [nextInvoiceDate, setNextInvoiceDate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openStopRecurringPopup, setOpenStopRecurringPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  
  console.log(mainlist);
  const [state, setState] = useState({
    paymentDate: "",
    paymentAmount: "",
    paymentTransactionID: "",
    paymentInvoiceID:"",
    paymentMode: "",
    value:"",
    paymentNotes: EditorState.createEmpty(),
    id: null,
    isUpdate: false,
  });

  const handleReminderPopupOpen = () => {
    setOpenReminderPopup(true);
  };

  const handleReminderPopupClose = () => {
    setOpenReminderPopup(false);
  };

  const handlePublishPopupOpen = () => {
    setOpenPublishPopup(true);
  };

  const handlePublishPopupClose = () => {
    setOpenPublishPopup(false);
  };

  const handleCheckboxChange = (event) => {
    setIsScheduled(event.target.checked);
  };
  
  const handleEmailPopupOpen = () => {
    setOpenEmailPopup(true);
  };

  const handleEmailPopupClose = () => {
    setOpenEmailPopup(false);
  };
  
  const handlePaymentPopupOpen = () => {
    setOpenPaymentPopup(true);
  };

  const handlePaymentPopupClose = () => {
    setOpenPaymentPopup(false);
  };

  const handleStopRecurringOpen = () => {
    setOpenStopRecurringPopup(true);
    handleRecurringClose();
  };

  const handleStopRecurringClose = () => {
    setOpenStopRecurringPopup(false);
  };
console.log("invoicebutton",InvoiceID)

const handleCreatePay = async (id) => {
  try {
    const loginHeaders = new Headers();
    loginHeaders.append("Content-Type", "application/json");

    // Assuming you have an authorization token stored in localStorage
    const authToken = localStorage.getItem("token");
    if (authToken) {
      loginHeaders.append("Authorization", `Bearer ${authToken}`);
    }

    // Function to format date to mm-dd-yyyy
    const formatDate = (date) => {
      if (!date) return ""; // Handle empty or undefined date
      return format(new Date(date), 'MM-dd-yyyy');
    };

    const data = {
      paymentDate: formatDate(state.paymentDate),
      paymentInvoiceID: mainlist.bill_ID,
      paymentAmount: parseInt(state.paymentAmount),
      paymentTransactionID: state.paymentTransactionID,
      paymentMode: state.paymentMode,
      paymentNotes: JSON.stringify(
        convertToRaw(state.paymentNotes.getCurrentContent())
      ),
    };

    const requestOptions = {
      method: "POST",
      headers: loginHeaders,
      body: JSON.stringify(data),
    };

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/createPayment`,
      requestOptions
    );
    const actualData = await res.json();

    if (actualData.status === 200) {
      toast.success("Create Successfully");
      
      setState((prevState) => ({
        ...prevState,
        paymentDate: "",
        paymentAmount: "",
        paymentInvoiceID:"",
        paymentTransactionID: "",
        paymentMode: "",
        paymentNotes: EditorState.createEmpty(),
        isUpdate: false,
      }));
      handlePaymentPopupClose();
     
    }
    await table();
  } catch (err) {
    console.log(err);
  }
};
  const handleRecurringClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRecurringClose = () => {
    setAnchorEl(null);
  };

  const handleRecurringSettingsOpen = () => {
    setOpenRecurringSettingsPopup(true);
    handleRecurringClose();
  };

  const handleRecurringSettingsClose = () => {
    setOpenRecurringSettingsPopup(false);
  };
   // Open Delete Confirmation Dialog
   const handleDeletePopupOpen = () => {
    setOpenDeletePopup(true);
  };

  // Close Delete Confirmation Dialog
  const handleDeletePopupClose = () => {
    setOpenDeletePopup(false);
  };
  const handleInvoiceDelete = async () => {
    try {
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");

      const authToken = localStorage.getItem("token");
      if (authToken) {
        loginHeaders.append("Authorization", `Bearer ${authToken}`);
      }
      const data = { id: InvoiceID };
      const requestOptions = {
        method: "DELETE",
        headers: loginHeaders,
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/deleteInvoice`,
        requestOptions
      );
      const actualData = await res.json();
      if (actualData.status == 200) {
        toast.success("Successfully deleted !");
        handleDeletePopupClose();
        navigate("/Invoice_list");

      } else {
        toast.error("Failed to delete Invoice!");
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginBottom: '10px',
      }}
    >
      <Tooltip title="Reminder" arrow placement="bottom">
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleReminderPopupOpen}
          style={{ position: 'relative' }}
        >
          <AccessTimeIcon />
        </Button>
      </Tooltip>

      <Tooltip title="Publish Invoice" arrow placement="bottom">
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handlePublishPopupOpen}
          style={{ position: 'relative' }}
        >
          {/* <MdPublishedWithChanges style={{ fontSize: '1.4rem' }} /> */}
          publish changes
        </Button>
      </Tooltip>

      <Tooltip title="Send Email" arrow placement="bottom">
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleEmailPopupOpen}
          style={{ position: 'relative' }}
        >
          {/* <HiOutlineMailOpen style={{ fontSize: '1.4rem' }} /> */}
          mail open
        </Button>
      </Tooltip>

      <Tooltip title="Payment" arrow placement="bottom">
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handlePaymentPopupOpen}
          style={{ position: 'relative' }}
        >
          {/* <MdPayment style={{ fontSize: '1.4rem' }} /> */}
          payment
        </Button>
      </Tooltip>
       {/* Recurring Options Button */}
      <Tooltip title="Recurring Option" arrow placement="bottom">
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleRecurringClick}
          style={{ position: 'relative' }}
        >
          {/* <GiCycle style={{ fontSize: '1.4rem' }} /> */}
          recurring
        </Button>
      </Tooltip>
      {/* Delete button */}
      <Tooltip title="Delete" arrow placement="bottom">
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleDeletePopupOpen}
          style={{ position: 'relative' }}
        >
          {/* <MdDelete style={{ fontSize: '1.4rem' }} /> */}
          delete
        </Button>
      </Tooltip>


      {/* Recurring Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleRecurringClose}
      >
        <MenuItem onClick={handleRecurringSettingsOpen}>
          {/* <FiSettings style={{ marginRight: '8px' }} /> */}
          Recurring setting
        </MenuItem>
        <MenuItem onClick={handleStopRecurringOpen}>
          {/* <FaStop style={{ marginRight: '8px' }} /> */}
          Stop recurring
        </MenuItem>
      </Menu>

      {/* Reminder Dialog */}
      <Dialog open={openReminderPopup} onClose={handleReminderPopupClose}>
        <DialogTitle>Set Reminder</DialogTitle>
        <DialogContent style={{display:"flex" , flexDirection:"column" ,gap:"8px"}}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Reminder Date"
              value={reminderDate}
              onChange={(date) => setReminderDate(date)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
            <TimePicker
              label="Reminder Time"
              value={reminderTime}
              onChange={(time) => setReminderTime(time)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReminderPopupClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReminderPopupClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog open={openPublishPopup} onClose={handlePublishPopupClose}>
        <DialogTitle>Publish Invoice</DialogTitle>
        <DialogContent style={{display:"flex" , flexDirection:"column" ,gap:"8px"}}>
          <FormControlLabel
            control={<Checkbox />}
            label="Publish Now"
          />
          <FormControlLabel
            control={<Checkbox checked={isScheduled} onChange={handleCheckboxChange} />}
            label="Scheduled"
          />
          {isScheduled && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={reminderDate}
                onChange={(date) => setReminderDate(date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: <CalendarToday />,
                      style: { fontSize: '0.875rem' }
                    }}
                    style={{ width: '200px' }}
                  />
                )}
              />
            </LocalizationProvider>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePublishPopupClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePublishPopupClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={openEmailPopup} onClose={handleEmailPopupClose}>
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEmailPopupClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEmailPopupClose} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={openPaymentPopup} onClose={handlePaymentPopupClose}>
        <DialogTitle>Add Payment</DialogTitle>
        <DialogContent style={{display:"flex" , flexDirection:"column" ,gap:"8px"}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Payment Date"
                type="date"
                value={state.paymentDate}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    paymentDate: e.target.value,
                  }))
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Payment Amount"
                type="number"
                value={state.paymentAmount}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    paymentAmount: e.target.value,
                  }))
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Transaction ID"
                value={state.paymentTransactionID}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    paymentTransactionID: e.target.value,
                  }))
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              {/* <CustomInputAndSelectField
                label="Payment Mode"
                options={[
                  "Online","Cash","Bank transfer"
                ]}
                value={state.paymentMode}
                changeCallBack={(e , v) =>
                  setState((prevState) => ({
                    ...prevState,
                    paymentMode: v,
                  }))
                }
                fullWidth
              /> */}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showPaymentNote}
                    onChange={() => setShowPaymentNote((prev) => !prev)}
                  />
                }
                label="Add Payment Note"
              />
            </Grid>
            {showPaymentNote && (
              <Grid item xs={12}>
                <div style={{border: '1px solid #ccc', padding: '10px', borderRadius: '4px', minHeight: '100px'}}>
                  <Editor
                    editorState={state.paymentNotes}
                    onChange={(editorState) =>
                      setState((prevState) => ({
                        ...prevState,
                        paymentNotes: editorState,
                      }))
                    }
                    placeholder="Enter payment notes..."
                  />
                </div>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePaymentPopupClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreatePay} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Recurring Settings Dialog */}
      <Dialog open={openRecurringSettingsPopup} onClose={handleRecurringSettingsClose}>
        <DialogTitle>Recurring Settings</DialogTitle>
        <DialogContent style={{display:"flex" , flexDirection:"column" ,gap:"8px"}}>
          <TextField
            label="Repeat Every"
            type="number"
            value={repeatEvery}
            onChange={(e) => setRepeatEvery(e.target.value)}
            fullWidth
            margin="normal"
          /> 
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel id="repeat-unit-label">Unit</InputLabel>
            <Select
              labelId="repeat-unit-label"
              id="repeat-unit"
              value={repeatUnit}
              onChange={(e) => setRepeatUnit(e.target.value)}
              label="Unit"
            >
              <MenuItem value="days">Days</MenuItem>
              <MenuItem value="months">Months</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Cycles"
            type="number"
            value={cycles}
            onChange={(e) => setCycles(e.target.value)}
            fullWidth
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Next Invoice Date"
              value={nextInvoiceDate}
              onChange={(date) => setNextInvoiceDate(date)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRecurringSettingsClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRecurringSettingsClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Stop Recurring Confirmation Dialog */}
      <Dialog open={openStopRecurringPopup} onClose={handleStopRecurringClose}>
        <DialogTitle>Stop Recurring</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to stop the recurring setting?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStopRecurringClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleStopRecurringClose} color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeletePopup} onClose={handleDeletePopupClose}>
        <DialogTitle>Delete Invoice</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to delete this Invoice?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeletePopupClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleInvoiceDelete} color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InvoiceButtons;
