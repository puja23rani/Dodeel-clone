import React from 'react';
import PropTypes from 'prop-types';
import Fab from '@mui/material/Fab';
import Edit from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import { injectIntl } from 'react-intl';
import ComposeEmailForm from './ComposeEmailForm';
import messages from './messages';
import FloatingPanel from '../Panel/FloatingPanel';
import useStyles from './email-jss';

function ComposeEmail(props) {
  const { classes } = useStyles();
  const {
    open, closeForm, sendEmail,
    to, subject,
    validMail, inputChange,
    compose, processing,
    intl
  } = props;
  const branch = '';

  return (
    <div>
      <Tooltip title={intl.formatMessage(messages.compose)}>
        <Fab color="secondary" onClick={() => compose()} className={classes.addBtn}>
          <Edit />
        </Fab>
      </Tooltip>
      <FloatingPanel
        openForm={open}
        branch={branch}
        closeForm={closeForm}
        title={intl.formatMessage(messages.compose)}
        extraSize
      >
        <ComposeEmailForm
          to={to}
          subject={subject}
          validMail={validMail}
          sendEmail={sendEmail}
          closeForm={closeForm}
          inputChange={inputChange}
          processing={processing}
        />
      </FloatingPanel>
    </div>
  );
}

ComposeEmail.propTypes = {
  open: PropTypes.bool.isRequired,
  to: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  validMail: PropTypes.string.isRequired,
  compose: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  sendEmail: PropTypes.func.isRequired,
  inputChange: PropTypes.func.isRequired,
  processing: PropTypes.bool,
  intl: PropTypes.object.isRequired
};

ComposeEmail.defaultProps = {
  processing: false
};

export default injectIntl(ComposeEmail);
