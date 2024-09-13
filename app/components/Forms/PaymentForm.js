import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { injectIntl } from 'react-intl';
import messages from './messages';

function PaymentForm(props) {
  const { intl } = props;
  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField variant="standard" required id="cardName" label="Name on card" fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField variant="standard" required id="cardNumber" label="Card number" fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField variant="standard" required id="expDate" label="Expiry date" fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            variant="standard"
            required
            id="cvv"
            label="CVV"
            helperText={intl.formatMessage(messages.last_three)}
            fullWidth />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label={intl.formatMessage(messages.check_credit)}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
}

PaymentForm.propTypes = { intl: PropTypes.object.isRequired };

export default injectIntl(PaymentForm);
