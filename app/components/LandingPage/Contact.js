import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import Title from './Title';
import useStyles from './landingStyle-jss';

function Contact(props) {
  const { intl } = props;
  const { classes, cx } = useStyles();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className={classes.contact}>
      <div className={classes.container}>
        <div className={classes.contactBubble}>
          <Title title={intl.formatMessage(messages.titleContact)} desc="Cras convallis lacus orci, tristique tincidunt magna consequat in." align="left" nomargin />
          <Grid container spacing={3}>
            <Grid item lg={6} xs={12}>
              <FormControl variant="standard" className={classes.formControl}>
                <TextField
                  variant="standard"
                  fullWidth
                  id="standard-name"
                  label={intl.formatMessage(messages.nameContact)}
                  className={classes.textField}
                  value={name}
                  required
                  onChange={e => setName(e.target.value)}
                  margin="normal"
                  classes={{
                    root: classes.contactFieldRoot,
                  }} />
              </FormControl>
              <FormControl variant="standard" className={classes.formControl}>
                <TextField
                  variant="standard"
                  fullWidth
                  id="standard-email"
                  label={intl.formatMessage(messages.emailContact)}
                  className={classes.textField}
                  value={email}
                  required
                  onChange={e => setEmail(e.target.value)}
                  margin="normal"
                  classes={{
                    root: classes.contactFieldRoot,
                  }} />
              </FormControl>
            </Grid>
            <Grid item lg={6} xs={12}>
              <FormControl variant="standard" className={classes.formControl}>
                <TextField
                  variant="standard"
                  fullWidth
                  id="standard-multiline-flexible"
                  label={intl.formatMessage(messages.messagesContact)}
                  multiline
                  rows="4"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className={cx(classes.textField, classes.textarea)}
                  margin="normal"
                  classes={{
                    root: classes.contactFieldRoot,
                  }} />
              </FormControl>
              <div className={classes.btnArea}>
                <Button variant="contained" size="large" className={classes.button} color="secondary">
                  <FormattedMessage {...messages.sendContact} />
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

Contact.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(Contact);
