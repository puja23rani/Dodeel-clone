import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Dropzone from 'react-dropzone';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Type from 'enl-styles/Typography.scss';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import PermContactCalendar from '@mui/icons-material/PermContactCalendar';
import CircularProgress from '@mui/material/CircularProgress';
import Bookmark from '@mui/icons-material/Bookmark';
import LocalPhone from '@mui/icons-material/LocalPhone';
import Email from '@mui/icons-material/Email';
import Smartphone from '@mui/icons-material/Smartphone';
import LocationOn from '@mui/icons-material/LocationOn';
import Work from '@mui/icons-material/Work';
import Language from '@mui/icons-material/Language';
import css from 'enl-styles/Form.scss';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import useStyles from './contact-jss';

const validationSchema = yup.object({
  name: yup
    .string('this field is required')
    .required('this field is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
});

function AddContactForm(props) {
  const saveRef = useRef(null);
  const { classes } = useStyles();

  const {
    onDrop, sendValues,
    imgAvatar, initialValues,
    intl
  } = props;

  let dropzoneRef;
  const acceptedFiles = ['image/jpeg', 'image/png', 'image/bmp'];
  const fileSizeLimit = 300000;

  const imgPreview = img => {
    if (typeof img !== 'string' && img !== '') {
      return URL.createObjectURL(imgAvatar);
    }
    return img;
  };

  const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      await sleep(500);
      sendValues(values);
      await sleep(500);
      formik.resetForm({
        values: initialValues
      });
    },
  });

  const reset = () => {
    formik.resetForm({
      values: initialValues
    });
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <section className={css.bodyForm}>
          <div>
            <Typography className={Type.textCenter}>
              <FormattedMessage {...messages.upload} />
              &nbsp;(Max 100KB)
            </Typography>
            <Dropzone
              className={classes.hiddenDropzone}
              accept={acceptedFiles.join(',')}
              acceptClassName="stripes"
              onDrop={onDrop}
              maxSize={fileSizeLimit}
              ref={(node) => { dropzoneRef = node; }}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                </div>
              )}
            </Dropzone>
            <div className={classes.avatarWrap}>
              <Avatar
                alt="Avatar"
                className={classes.uploadAvatar}
                src={imgPreview(imgAvatar)}
              />
              <Tooltip id="tooltip-upload" title={intl.formatMessage(messages.upload)}>
                <IconButton
                  className={classes.buttonUpload}
                  component="button"
                  onClick={() => {
                    dropzoneRef.open();
                  }}
                  size="large">
                  <PhotoCamera />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div>
            <TextField
              id="name"
              name="name"
              value={formik.values.name}
              placeholder={intl.formatMessage(messages.name)}
              label={intl.formatMessage(messages.name)}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              onChange={formik.handleChange}
              variant="standard"
              ref={saveRef}
              className={classes.field}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PermContactCalendar />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              placeholder={intl.formatMessage(messages.title)}
              label={intl.formatMessage(messages.title)}
              className={classes.field}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Bookmark />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              id="phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              placeholder={intl.formatMessage(messages.phone)}
              type="tel"
              label={intl.formatMessage(messages.phone)}
              className={classes.field}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalPhone />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              id="secondaryPhone"
              name="secondaryPhone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              placeholder={intl.formatMessage(messages.secondary_phone)}
              type="tel"
              label={intl.formatMessage(messages.secondary_phone)}
              className={classes.field}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Smartphone />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              id="personalEmail"
              name="personalEmail"
              placeholder={intl.formatMessage(messages.personal_email)}
              type="email"
              label={intl.formatMessage(messages.personal_email)}
              className={classes.field}
              value={formik.values.personalEmail}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              onChange={formik.handleChange}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              id="companyEmail"
              name="companyEmail"
              placeholder={intl.formatMessage(messages.company_email)}
              type="email"
              label={intl.formatMessage(messages.company_email)}
              className={classes.field}
              value={formik.values.companyEmail}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              onChange={formik.handleChange}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              id="addressInput"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              placeholder={intl.formatMessage(messages.address)}
              label={intl.formatMessage(messages.address)}
              className={classes.field}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              id="website"
              name="website"
              placeholder={intl.formatMessage(messages.website)}
              type="url"
              label={intl.formatMessage(messages.website)}
              className={classes.field}
              value={formik.values.website}
              onChange={formik.handleChange}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Language />
                  </InputAdornment>
                )
              }}
            />
          </div>
        </section>
        <div className={css.buttonArea}>
          <p>
            Once you submit, its mean you have agreed with our
            &nbsp;
            <a href="/terms-conditions" target="_blank">
              terms &amp; conditions
            </a>
          </p>
          <div>
            <Button variant="contained" color="secondary" type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
              <FormattedMessage {...messages.submit} />
            </Button>
            <Button
              type="button"
              disabled={formik.isSubmitting || !formik.dirty}
              onClick={reset}
            >
              <FormattedMessage {...messages.reset} />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

AddContactForm.propTypes = {
  sendValues: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  onDrop: PropTypes.func.isRequired,
  imgAvatar: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  intl: PropTypes.object.isRequired
};

AddContactForm.defaultProps = {
  initialValues: {}
};

export default injectIntl(AddContactForm);
