import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import Popover from '@mui/material/Popover';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Help from '@mui/icons-material/Help';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import dummy from 'enl-api/dummy/dummyContents';
import avatarApi from 'enl-api/images/avatars';
import { injectIntl, FormattedMessage } from 'react-intl';
import { useFormik } from 'formik';
import * as yup from 'yup';
import messages from './messages';
import useStyles from './user-jss';

// validation functions
const validationSchema = yup.object({
  password: yup
    .string('Enter your password')
    .required('Password is required'),
});

function LockForm(props) {
  const { classes } = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { intl } = props;

  const handleShowHint = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });
  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      await sleep(500);
      console.log(JSON.stringify(values, null, 2));
      navigate('/app');
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <section className={classes.lockWrap}>
          <Avatar alt="John Doe" src={avatarApi[6]} className={classes.avatar} />
          <div>
            <Typography className={classes.userName} variant="h5">{dummy.user.name}</Typography>
            <div className={classes.lockForm}>
              <FormControl variant="standard" className={classes.lockField}>
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  label={intl.formatMessage(messages.loginFieldPassword)}
                  className={classes.field}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="Helper Hint" onClick={handleShowHint} size="large">
                          <Help />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </FormControl>
              <Fab size="small" color="secondary" type="submit" disabled={formik.isSubmitting}>
                <ArrowForward className={classes.signArrow} />
              </Fab>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Typography className={classes.hint}>
                  <FormattedMessage {...messages.lockHint} />
                </Typography>
              </Popover>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}

LockForm.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(LockForm);
