import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import useStyles from './todo-jss';

function TaskFilters(props) {
  const { filter, type } = props;
  const { classes } = useStyles();
  return (
    <ul className={classes.filter}>
      <li>
        <Button size="small" onClick={() => filter('')} className={type === '' ? classes.active : ''}>
          <FormattedMessage {...messages.view_all} />
        </Button>
      </li>
      <li>/</li>
      <li>
        <Button size="small" onClick={() => filter('active')} className={type === 'active' ? classes.active : ''}>
          <FormattedMessage {...messages.active} />
        </Button>
      </li>
      <li>/</li>
      <li>
        <Button size="small" onClick={() => filter('completed')} className={type === 'completed' ? classes.active : ''}>
          <FormattedMessage {...messages.completed} />
        </Button>
      </li>
    </ul>
  );
}

TaskFilters.propTypes = {
  filter: PropTypes.func.isRequired,
  type: PropTypes.string
};

TaskFilters.defaultProps = {
  type: ''
};

export default injectIntl(TaskFilters);
