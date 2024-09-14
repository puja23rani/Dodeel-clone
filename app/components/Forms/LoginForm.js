import React, { useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import { injectIntl, FormattedMessage } from "react-intl";
import { useFormik } from "formik";
import * as yup from "yup";
import brand from "enl-api/dummy/brand";
import logo from "enl-images/logo.svg";
import MessagesForm from "./MessagesForm";
import messages from "./messages";
import useStyles from "./user-jss";
import { toast } from "react-toastify";

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) {
  // eslint-disable-line
  return <NavLink to={props.to} {...props} />; // eslint-disable-line
});

function LoginForm(props) {
  const { classes, cx } = useStyles();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const {
    link,
    intl,
    messagesAuth,
    closeMsg,
    loading,
    submitForm,
    googleAuth,
    twitterAuth,
    githubAuth,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // -------------------------------------------------------------
  //            MY CODE
  // -------------------------------------------------------------
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
          `${process.env.REACT_APP_API_URL}/api/auth/Adminlogin`,
          requestOptions
        );
        const actualData = await res.json();
        if (actualData.token) {
          localStorage.setItem("token", actualData.token);
          localStorage.setItem("role", actualData.role);
          if (actualData.role == "ADMIN") {
            navigate("/app");
          }
        } 
    }

  // console.log(process.env.REACT_APP_API_URL);


  return (
      <Paper className={classes.sideWrap}>
        {!mdUp && (
          <div className={classes.headLogo}>
            <NavLink to="/" className={classes.brand}>
              <img src={logo} alt={brand.name} />
              {brand.name}
            </NavLink>
          </div>
        )}
        <div className={classes.topBar}>
          <Typography variant="h4" className={classes.title}>
            <FormattedMessage {...messages.login} />
          </Typography>
          <Button
            size="small"
            className={classes.buttonLink}
            component={LinkBtn}
            to={link}
          >
            <Icon className={cx(classes.icon, classes.signArrow)}>
              arrow_forward
            </Icon>
            <FormattedMessage {...messages.createNewAccount} />
          </Button>
        </div>
      
      <div className={classes.topBar}>
        <Typography variant="h4" className={classes.title}>
          <FormattedMessage {...messages.login} />
        </Typography>
        <Button
          size="small"
          className={classes.buttonLink}
          component={LinkBtn}
          to={link}
        >
          <Icon className={cx(classes.icon, classes.signArrow)}>
            arrow_forward
          </Icon>
          <FormattedMessage {...messages.createNewAccount} />
        </Button>
      </div>
      {messagesAuth !== null || "" ? (
        <MessagesForm
          variant="error"
          className={classes.msgUser}
          message={messagesAuth}
          onClose={closeMsg}
        />
      ) : (
        ""
      )}
      <section className={classes.pageFormSideWrap}>
        <div>
          <div>
            <FormControl variant="standard" className={classes.formControl}>
              <TextField
                id="email"
                name="email"
                label={intl.formatMessage(messages.loginFieldEmail)}
                variant="standard"
                value={state.email}
                onChange={(e) => {
                  const value = e.target.value;
                  setState({
                    ...state,
                    email: value,
                  });
                }}
                className={classes.field}
              />
            </FormControl>
          </div>
          <div>
            <FormControl variant="standard" className={classes.formControl}>
              <TextField
                id="password"
                name="password"
                label={intl.formatMessage(messages.loginFieldPassword)}
                type={showPassword ? "text" : "password"}
                variant="standard"
                value={state.password}
                onChange={(e) => {
                  const value = e.target.value;
                  setState({
                    ...state,
                    password: value,
                  });
                }}
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
              />
            </FormControl>
          </div>
          <div className={classes.optArea}>
            {/* <FormControlLabel
              className={classes.label}
              control={<Checkbox name="checkbox" />}
              label={intl.formatMessage(messages.loginRemember)}
            /> */}
            <Button
              size="small"
              component={LinkBtn}
              to="/reset-password"
              className={classes.buttonLink}
            >
              <FormattedMessage {...messages.loginForgotPassword} />
            </Button>
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
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
                <FormattedMessage {...messages.loginButtonContinue} />
                {!loading && (
                  <ArrowForward
                    className={cx(
                      classes.rightIcon,
                      classes.iconSmall,
                      classes.signArrow
                    )}
                  />
                )}
              </Button>
            </div>
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
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
              <FormattedMessage {...messages.loginButtonContinue} />
              {!loading && (
                <ArrowForward
                  className={cx(
                    classes.rightIcon,
                    classes.iconSmall,
                    classes.signArrow
                  )}
                />
              )}
            </Button>
          </div>
      </section>
      <h5 className={classes.divider}>
        <span>
          <FormattedMessage {...messages.loginOr} />
        </span>
      </h5>
      <section className={classes.socmedSideLogin}>
        <Button
          variant="contained"
          className={classes.redBtn}
          type="button"
          size="large"
          onClick={googleAuth}
        >
          <i className="ion-logo-google" />
          Google
        </Button>
        <Button
          variant="contained"
          className={classes.cyanBtn}
          type="button"
          size="large"
          onClick={twitterAuth}
        >
          <i className="ion-logo-twitter" />
          Twitter
        </Button>
        <Button
          variant="contained"
          className={classes.greyBtn}
          type="button"
          size="large"
          onClick={githubAuth}
        >
          <i className="ion-logo-github" />
          Github
        </Button>
      </section>
    </Paper>
  );
}

LoginForm.propTypes = {
  intl: PropTypes.object.isRequired,
  messagesAuth: PropTypes.string,
  loading: PropTypes.bool,
  closeMsg: PropTypes.func,
  submitForm: PropTypes.func.isRequired,
  googleAuth: PropTypes.func,
  twitterAuth: PropTypes.func,
  githubAuth: PropTypes.func,
  link: PropTypes.string,
};

LoginForm.defaultProps = {
  messagesAuth: null,
  loading: false,
  closeMsg: () => { },
  googleAuth: () => { },
  twitterAuth: () => { },
  link: "#",
};

export default injectIntl(LoginForm);
