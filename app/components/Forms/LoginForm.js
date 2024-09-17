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

function LoginForm(props) {
  const { classes, cx } = useStyles();
  const { intl, loading } = props;

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
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
      localStorage.setItem("role", actualData.role);
      if (actualData.role === "ADMIN") {
        navigate("/app");
      }
    }
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
