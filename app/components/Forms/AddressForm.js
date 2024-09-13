import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';

function AddressForm(props) {
  const { intl } = props;
  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        <FormattedMessage {...messages.shipping_address} />
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="standard"
            required
            id="firstName"
            name="firstName"
            label={intl.formatMessage(messages.first_name)}
            fullWidth
            autoComplete="fname" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="standard"
            required
            id="lastName"
            name="lastName"
            label={intl.formatMessage(messages.last_name)}
            fullWidth
            autoComplete="lname" />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="standard"
            required
            id="address1"
            name="address1"
            label={intl.formatMessage(messages.address1)}
            fullWidth
            autoComplete="billing address-line1" />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="standard"
            id="addiress2"
            name="addiress2"
            label={intl.formatMessage(messages.address2)}
            fullWidth
            autoComplete="billing address-line2" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="standard"
            required
            id="city"
            name="city"
            label={intl.formatMessage(messages.city)}
            fullWidth
            autoComplete="billing address-level2" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="standard"
            id="state"
            name="state"
            label={intl.formatMessage(messages.state)}
            fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="standard"
            required
            id="zip"
            name="zip"
            label={intl.formatMessage(messages.zip)}
            fullWidth
            autoComplete="billing postal-code" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="standard"
            required
            id="country"
            name="country"
            label={intl.formatMessage(messages.country)}
            fullWidth
            autoComplete="billing country" />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
            label={intl.formatMessage(messages.check_address)}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
}

AddressForm.propTypes = { intl: PropTypes.object.isRequired };

export default injectIntl(AddressForm);
