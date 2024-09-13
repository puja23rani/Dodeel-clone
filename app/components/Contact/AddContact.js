import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import Add from '@mui/icons-material/Add';
import { injectIntl } from 'react-intl';
import messages from './messages';
import AddContactForm from './AddContactForm';
import FloatingPanel from '../Panel/FloatingPanel';
import useStyles from './contact-jss';

function AddContact(props) {
  const { classes } = useStyles();
  const {
    openForm,
    closeForm,
    avatarInit,
    addContact,
    initialValues,
    submit,
    intl,
  } = props;
  const [img, setImg] = useState(null);
  const [files] = useState([]);

  const onDrop = useCallback((filesVal) => {
    let oldFiles = files;
    const filesLimit = 1;
    oldFiles = oldFiles.concat(filesVal);
    if (oldFiles.length > filesLimit) {
      console.log('Cannot upload more than ' + filesLimit + ' items.');
    } else {
      setImg(filesVal[0]);
    }
  }, [files]);

  const sendValues = useCallback((values) => {
    const avatar = img === null ? avatarInit : img;
    setTimeout(() => {
      submit(values, avatar);
      setImg(null);
    }, 500);
  }, [avatarInit, submit, img]);

  const branch = '';
  return (
    <div>
      <Tooltip title={intl.formatMessage(messages.add_contacts)}>
        <Fab color="secondary" onClick={() => addContact()} className={classes.addBtn}>
          <Add />
        </Fab>
      </Tooltip>
      <FloatingPanel
        title={intl.formatMessage(messages.add_contacts)}
        openForm={openForm}
        branch={branch}
        closeForm={closeForm}
      >
        <AddContactForm
          initialValues={initialValues}
          sendValues={(values) => sendValues(values)}
          onDrop={onDrop}
          imgAvatar={img === null ? avatarInit : img}
        />
      </FloatingPanel>
    </div>
  );
}

AddContact.propTypes = {
  submit: PropTypes.func.isRequired,
  addContact: PropTypes.func.isRequired,
  openForm: PropTypes.bool.isRequired,
  avatarInit: PropTypes.string.isRequired,
  closeForm: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
};

export default injectIntl(AddContact);
