import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import { injectIntl } from 'react-intl';
import messages from './messages';
import useStyles from './todo-jss';

function TaskForm(props) {
  const { intl, handleSubmit } = props;
  const { classes } = useStyles();
  const [title, setTitle] = useState('');

  const clearInput = () => setTitle('');
  const handleChange = (event) => setTitle(event.target.value);
  const handleKeyUp = (event) => {
    if (event.keyCode === 27) clearInput();
  };
  const handleSubmitForm = (event) => {
    event.preventDefault();
    const titleString = title.trim();
    if (titleString.length) handleSubmit(titleString);
    clearInput();
  };

  return (
    <form onSubmit={handleSubmitForm} noValidate>
      <FormControl variant="standard" fullWidth className={classes.addTask}>
        <Input
          autoComplete="off"
          maxLength="64"
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          placeholder={intl.formatMessage(messages.placeholder)}
          type="text"
          value={title}
          endAdornment={(
            <InputAdornment className={classes.hint} position="end">
              <Chip label={intl.formatMessage(messages.hint)} className={classes.chip} />
            </InputAdornment>
          )}
        />
        <p>
          Once you submit, its mean you have agreed with our
          &nbsp;
          <a href="/terms-conditions" target="_blank">
            terms &amp; conditions
          </a>
        </p>
      </FormControl>
    </form>
  );
}

TaskForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
};

export default injectIntl(TaskForm);
