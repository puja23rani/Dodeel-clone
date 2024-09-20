import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import ArrowForward from "@mui/icons-material/ArrowForward";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { injectIntl, FormattedMessage } from "react-intl";
import messages from "./messages";
import useStyles from "./user-jss";
import { DoddleLogo } from "../../../Assets";
import Popup from "../Popup/Popup";

function LoginForm(props) {
  const { classes, cx } = useStyles();
  const { intl, loading } = props;

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validate = () => {
    let isValid = true;
    let errors = {};
  
    // Email validation
    if (!state.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }
  
    // Password validation: must be between 6 to 10 characters
    if (!state.password.toString().trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (state.password.toString().length < 6 || state.password.toString().length > 10) {
      errors.password = "Password must be between 6 to 10 characters";
      isValid = false;
    }
  
    setErrors(errors);
    return isValid;
  };
  
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    if(!validate()){return;}
    const loginHeaders = new Headers();
    loginHeaders.append("Content-Type", "application/json");

    const data = {
      email: state.email,
      password: state.password,
    };
    const requestOptions = {
      method: "POST",
      headers: loginHeaders,
      body: JSON.stringify(data),
    };
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/auth/Adminlogin`,
      requestOptions
    );
    const actualData = await res.json();
    if (actualData.token) {
      localStorage.setItem("token", actualData.token);
      if (actualData.role === "ADMIN") {
        window.localStorage.setItem("role", actualData.role);
        navigate("/app");
      }
    }else{
      setMessage(actualData.message);
      setOpen(true);
      setSeverity("error");
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <section style={{ backgroundColor: "#fff", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "350px" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "2vh" }}>
          <p style={{ fontSize: "3rem", fontWeight: 500 }}>Sign in</p>
        </div>
        <div>
          <FormControl variant="standard" style={{ width: "100%", marginBottom: "1rem" }}>
            <TextField
              id="email"
              name="email"
              label={intl.formatMessage(messages.loginFieldEmail)}
              variant="standard"
              value={state.email}
              onChange={(e) => setState({ ...state, email: e.target.value })}
              className={classes.field}
              error={!!errors.email} // Show error if it exists
              helperText={errors.email} // Display error message
              fullWidth
            />
          </FormControl>
          <FormControl variant="standard" style={{ width: "100%", marginBottom: "1rem" }}>
            <TextField
              id="password"
              name="password"
              label={intl.formatMessage(messages.loginFieldPassword)}
              type={showPassword ? "text" : "password"}
              variant="standard"
              value={state.password}
              onChange={(e) => setState({ ...state, password: e.target.value })}
              className={classes.field}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      size="large"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
              error={!!errors.password} // Show error if it exists
              helperText={errors.password} // Display error message
            />
          </FormControl>
        </div>
        <div className={classes.btnArea}>
          <Button
            variant="contained"
            disabled={loading}
            fullWidth
            color="primary"
            size="large"
            type="submit"
            onClick={handleLogin}
          >
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            <FormattedMessage {...messages.loginButtonContinue} />
            {!loading && (
              <ArrowForward
                className={cx(classes.rightIcon, classes.iconSmall, classes.signArrow)}
              />
            )}
          </Button>
        </div>
        <Popup
        open={open}
        message={message}
        onClose={handleClose}
        severity={severity} // You can change this to "error", "warning", etc.
      />
      </div>
    </section>
  );
}

LoginForm.propTypes = {
  intl: PropTypes.object.isRequired,
  loading: PropTypes.bool,
};

LoginForm.defaultProps = {
  loading: false,
};

export default injectIntl(LoginForm);
